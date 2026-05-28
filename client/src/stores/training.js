import { defineStore } from 'pinia'
import { getUtente } from '@/js/controller'
import {getAlgoritmiByTipo, getAllenamentoByTipo, getTipiAlgoritmo, salvaSolveAllenamento} from '@/js/trainingService'
import { normalizeTutorialText } from '@/js/tutorial'

const TRAINING_STATS_EVENT = 'training-stats-updated'

function trainingStatsKey(idUt, idTipoAlg) {
    return `trainingStats:${idUt}:${idTipoAlg}`
}

function readTrainingStats(idUt, idTipoAlg) {
    if (!idUt || !idTipoAlg) {
        return []
    }

    try {
        return JSON.parse(sessionStorage.getItem(trainingStatsKey(idUt, idTipoAlg)) ?? '[]')
    } catch (err) {
        return []
    }
}

function writeTrainingStats(idUt, idTipoAlg, statsByAlg) {
    if (!idUt || !idTipoAlg) {
        return
    }

    sessionStorage.setItem(
        trainingStatsKey(idUt, idTipoAlg),
        JSON.stringify(Object.values(statsByAlg))
    )
    window.dispatchEvent(new Event(TRAINING_STATS_EVENT))
}

function emptyStats(idAlg) {
    return {
        idAlg,
        best: null,
        media: null,
        nSolves: 0
    }
}

function nextStats(currentStats, tempo) {
    const nSolves = Number(currentStats?.nSolves ?? 0)
    const media = Number(currentStats?.media ?? 0)
    const best = currentStats?.best == null ? tempo : Math.min(Number(currentStats.best), tempo)
    const nextCount = nSolves + 1

    return {
        idAlg: currentStats.idAlg,
        best,
        media: ((media * nSolves) + tempo) / nextCount,
        nSolves: nextCount
    }
}

function randomItem(items) {
    return items[(Math.random() * items.length) | 0]
}

function matchesQuery(value, query) {
    const normalizedValue = normalizeTutorialText(value)
    const queries = Array.isArray(query) ? query : [query]

    return queries
        .filter(Boolean)
        .some(item => normalizedValue.includes(normalizeTutorialText(item)))
}

export const useTrainingStore = defineStore('training', {
    state: () => ({
        tipiAlgoritmo: [],
        selectedTypeId: null,
        algorithms: [],
        selectedAlgorithmIds: [],
        statsByAlg: {},
        currentAlgorithmId: null,
        currentScramble: '',
        statsUserId: null,
        isTrainingActive: false,
        loadingTypes: false,
        loadingAlgorithms: false,
        saving: false,
        error: null,
        lastSaveError: null,
        tutorialTrainingRequest: null
    }),

    getters: {
        selectedAlgorithms(state) {
            return state.algorithms.filter(algoritmo => state.selectedAlgorithmIds.includes(algoritmo.idAlg))
        },

        currentAlgorithm(state) {
            return state.algorithms.find(algoritmo => algoritmo.idAlg === state.currentAlgorithmId) ?? null
        },

        hasSelectedAlgorithms(state) {
            return state.selectedAlgorithmIds.length > 0
        }
    },

    actions: {
        async loadTypes() {
            this.loadingTypes = true
            this.error = null

            try {
                this.tipiAlgoritmo = await getTipiAlgoritmo()

                if (!this.selectedTypeId && this.tipiAlgoritmo.length > 0) {
                    await this.selectType(this.tipiAlgoritmo[0].idTipoAlg)
                }
            } catch (err) {
                this.error = 'Impossibile caricare i tipi algoritmo'
            } finally {
                this.loadingTypes = false
            }
        },

        async selectType(idTipoAlg) {
            this.selectedTypeId = Number(idTipoAlg)
            this.isTrainingActive = false
            this.currentAlgorithmId = null
            this.currentScramble = ''
            await this.loadAlgorithmsForSelectedType()
        },

        async loadAlgorithmsForSelectedType() {
            if (!this.selectedTypeId) {
                return
            }

            this.loadingAlgorithms = true
            this.error = null
            this.lastSaveError = null

            try {
                const utente = getUtente()
                const algorithms = await getAlgoritmiByTipo(this.selectedTypeId)
                const cachedStats = utente ? readTrainingStats(utente.id, this.selectedTypeId) : []

                this.algorithms = algorithms
                this.selectedAlgorithmIds = algorithms.map(algoritmo => algoritmo.idAlg)
                this.statsUserId = utente?.id ?? null
                this.setStatsForAlgorithms(cachedStats)

                if (utente) {
                    const stats = await getAllenamentoByTipo(this.selectedTypeId, utente.id)
                    this.setStatsForAlgorithms(stats)
                    writeTrainingStats(utente.id, this.selectedTypeId, this.statsByAlg)
                }
            } catch (err) {
                this.algorithms = []
                this.selectedAlgorithmIds = []
                this.statsByAlg = {}
                this.error = 'Impossibile caricare gli algoritmi'
            } finally {
                this.loadingAlgorithms = false
            }
        },

        setStatsForAlgorithms(stats = []) {
            this.statsByAlg = {}

            for (const algoritmo of this.algorithms) {
                this.statsByAlg[algoritmo.idAlg] = emptyStats(algoritmo.idAlg)
            }

            for (const stat of stats) {
                if (this.statsByAlg[stat.idAlg]) {
                    this.statsByAlg[stat.idAlg] = {
                        ...emptyStats(stat.idAlg),
                        ...stat
                    }
                }
            }
        },

        clearUserStats() {
            this.statsUserId = null
            this.lastSaveError = null
            this.isTrainingActive = false
            this.setStatsForAlgorithms([])
        },

        async refreshUserStats() {
            if (!this.selectedTypeId || this.algorithms.length === 0) {
                return
            }

            const utente = getUtente()

            if (!utente) {
                this.clearUserStats()
                return
            }

            this.statsUserId = utente.id
            this.setStatsForAlgorithms(readTrainingStats(utente.id, this.selectedTypeId))

            try {
                const stats = await getAllenamentoByTipo(this.selectedTypeId, utente.id)
                this.setStatsForAlgorithms(stats)
                writeTrainingStats(utente.id, this.selectedTypeId, this.statsByAlg)
            } catch (err) {
                this.lastSaveError = 'Impossibile aggiornare le statistiche training'
            }
        },

        getStatsForAlgorithm(idAlg) {
            return this.statsByAlg[idAlg] ?? emptyStats(idAlg)
        },

        toggleAlgorithm(idAlg) {
            const normalizedId = Number(idAlg)

            if (this.selectedAlgorithmIds.includes(normalizedId)) {
                this.selectedAlgorithmIds = this.selectedAlgorithmIds.filter(id => id !== normalizedId)
            } else {
                this.selectedAlgorithmIds = [...this.selectedAlgorithmIds, normalizedId]
            }
        },

        selectAllAlgorithms() {
            this.selectedAlgorithmIds = this.algorithms.map(algoritmo => algoritmo.idAlg)
        },

        clearSelectedAlgorithms() {
            this.selectedAlgorithmIds = []
        },

        requestTutorialTraining(trainingLink) {
            this.tutorialTrainingRequest = {
                ...trainingLink,
                requestedAt: Date.now()
            }
        },

        clearTutorialTrainingRequest() {
            this.tutorialTrainingRequest = null
        },

        async applyTutorialTrainingRequest() {
            const request = this.tutorialTrainingRequest
            if (!request) {
                return false
            }

            if (this.tipiAlgoritmo.length === 0) {
                await this.loadTypes()
            }

            const requestedType = this.tipiAlgoritmo.find(tipo => {
                return matchesQuery(tipo.descTipo ?? tipo.desctipo ?? '', request.typeQuery)
            })

            if (!requestedType) {
                this.error = 'Training collegato non disponibile per questa sezione'
                this.clearTutorialTrainingRequest()
                return false
            }

            if (Number(this.selectedTypeId) !== Number(requestedType.idTipoAlg)) {
                await this.selectType(requestedType.idTipoAlg)
            }

            if (request.algorithmQuery) {
                const matchingAlgorithms = this.algorithms
                    .filter(algoritmo => matchesQuery(algoritmo.descAlg ?? '', request.algorithmQuery))
                    .map(algoritmo => algoritmo.idAlg)

                if (matchingAlgorithms.length > 0) {
                    this.selectedAlgorithmIds = matchingAlgorithms
                }
            } else if (this.algorithms.length > 0) {
                this.selectAllAlgorithms()
            }

            this.clearTutorialTrainingRequest()
            return true
        },

        startTraining() {
            if (!this.hasSelectedAlgorithms) {
                this.error = 'Seleziona almeno un algoritmo da allenare'
                return false
            }

            this.isTrainingActive = true
            this.error = null
            return this.prepareNextSolve()
        },

        stopTraining() {
            this.isTrainingActive = false
        },

        prepareNextSolve() {
            const selected = this.selectedAlgorithms

            if (selected.length === 0) {
                this.currentAlgorithmId = null
                this.currentScramble = ''
                this.error = 'Seleziona almeno un algoritmo da allenare'
                return false
            }

            const algoritmo = randomItem(selected)

            try {
                if (!algoritmo.scramble) {
                    throw new Error('Scramble algoritmo mancante')
                }

                this.currentAlgorithmId = algoritmo.idAlg
                this.currentScramble = algoritmo.scramble
                this.error = null
                return true
            } catch (err) {
                this.currentAlgorithmId = algoritmo.idAlg
                this.currentScramble = ''
                this.error = 'Scramble algoritmo non valido o mancante'
                return false
            }
        },

        async recordSolve(tempo) {
            if (!this.currentAlgorithmId || !Number.isFinite(tempo)) {
                return
            }

            const utente = getUtente()

            if (!utente) {
                this.clearUserStats()
                this.lastSaveError = 'Effettua il login per salvare le statistiche training'
                this.prepareNextSolve()
                return
            }

            const idAlg = this.currentAlgorithmId
            const updatedStats = nextStats(this.getStatsForAlgorithm(idAlg), Math.round(tempo))
            this.statsByAlg = {
                ...this.statsByAlg,
                [idAlg]: updatedStats
            }
            this.statsUserId = utente.id
            writeTrainingStats(utente.id, this.selectedTypeId, this.statsByAlg)

            this.saving = true
            this.lastSaveError = null

            try {
                await salvaSolveAllenamento({
                    idUt: utente.id,
                    idAlg,
                    tempo: Math.round(tempo),
                    best: Math.round(updatedStats.best),
                    media: Math.round(updatedStats.media),
                    nSolves: updatedStats.nSolves
                })
            } catch (err) {
                this.lastSaveError = 'Salvataggio statistiche training non riuscito'
            } finally {
                this.saving = false
                this.prepareNextSolve()
            }
        }
    }
})
