import { defineStore } from 'pinia'
import { getUtente } from '@/js/controller'
import {
    getAlgoritmiByTipo,
    getAllenamentoByTipo,
    getTipiAlgoritmo,
    salvaSolveAllenamento
} from '@/js/trainingService'
import { generateTrainingScramble, toRendererMoves } from '@/js/trainingScramble'

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

export const useTrainingStore = defineStore('training', {
    state: () => ({
        tipiAlgoritmo: [],
        selectedTypeId: null,
        algorithms: [],
        selectedAlgorithmIds: [],
        statsByAlg: {},
        currentAlgorithmId: null,
        currentScramble: '',
        currentScrambleMoves: [],
        currentRendererMoves: [],
        currentAuf: '',
        isTrainingActive: false,
        loadingTypes: false,
        loadingAlgorithms: false,
        saving: false,
        error: null,
        lastSaveError: null
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
                this.error = err.message || 'Impossibile caricare i tipi algoritmo'
            } finally {
                this.loadingTypes = false
            }
        },

        async selectType(idTipoAlg) {
            this.selectedTypeId = Number(idTipoAlg)
            this.isTrainingActive = false
            this.currentAlgorithmId = null
            this.currentScramble = ''
            this.currentScrambleMoves = []
            this.currentRendererMoves = []
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
                const [algorithms, stats] = await Promise.all([
                    getAlgoritmiByTipo(this.selectedTypeId),
                    utente ? getAllenamentoByTipo(this.selectedTypeId, utente.id) : Promise.resolve([])
                ])

                this.algorithms = algorithms
                this.selectedAlgorithmIds = algorithms.map(algoritmo => algoritmo.idAlg)
                this.statsByAlg = {}

                for (const algoritmo of algorithms) {
                    this.statsByAlg[algoritmo.idAlg] = emptyStats(algoritmo.idAlg)
                }

                for (const stat of stats) {
                    this.statsByAlg[stat.idAlg] = {
                        ...emptyStats(stat.idAlg),
                        ...stat
                    }
                }
            } catch (err) {
                this.algorithms = []
                this.selectedAlgorithmIds = []
                this.statsByAlg = {}
                this.error = err.message || 'Impossibile caricare gli algoritmi'
            } finally {
                this.loadingAlgorithms = false
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
                this.currentScrambleMoves = []
                this.currentRendererMoves = []
                this.error = 'Seleziona almeno un algoritmo da allenare'
                return false
            }

            const algoritmo = randomItem(selected)

            try {
                const scramble = generateTrainingScramble(algoritmo.mosse)

                this.currentAlgorithmId = algoritmo.idAlg
                this.currentScramble = scramble.scramble
                this.currentScrambleMoves = scramble.moves
                this.currentRendererMoves = toRendererMoves(scramble.moves)
                this.currentAuf = scramble.auf
                this.error = null
                return true
            } catch (err) {
                this.currentAlgorithmId = algoritmo.idAlg
                this.currentScramble = ''
                this.currentScrambleMoves = []
                this.currentRendererMoves = []
                this.error = err.message || 'Scramble algoritmo non valido'
                return false
            }
        },

        async recordSolve(tempo) {
            if (!this.currentAlgorithmId || !Number.isFinite(tempo)) {
                return
            }

            const idAlg = this.currentAlgorithmId
            const updatedStats = nextStats(this.getStatsForAlgorithm(idAlg), Math.round(tempo))
            this.statsByAlg = {
                ...this.statsByAlg,
                [idAlg]: updatedStats
            }

            const utente = getUtente()

            if (!utente) {
                this.lastSaveError = 'Effettua il login per salvare le statistiche training'
                this.prepareNextSolve()
                return
            }

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
                this.lastSaveError = err.message || 'Salvataggio statistiche training non riuscito'
            } finally {
                this.saving = false
                this.prepareNextSolve()
            }
        }
    }
})
