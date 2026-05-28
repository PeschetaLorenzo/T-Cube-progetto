import { getRequest, postRequest } from './apiClient'

function asArray(payload, keys) {
    if (Array.isArray(payload)) {
        return payload
    }

    for (const key of keys) {
        if (Array.isArray(payload?.[key])) {
            return payload[key]
        }
    }

    return []
}

function asNumber(value, fallback = null) {
    if (value === null || value === undefined || value === '') {
        return fallback
    }

    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : fallback
}

function normalizzaTipoAlgoritmo(tipo) {
    const id = tipo.idTipoAlg ?? tipo.idtipoalg ?? tipo.id_tipo_alg ?? tipo.id
    const desc = tipo.descTipo ?? tipo.desctipo ?? tipo.desc_tipo ?? tipo.desc ?? tipo.nome ?? ''

    return {
        idTipoAlg: asNumber(id),
        descTipo: String(desc)
    }
}

function normalizzaAlgoritmo(algoritmo) {
    const id = algoritmo.idAlg ?? algoritmo.idalg ?? algoritmo.id_alg ?? algoritmo.id
    const idTipo = algoritmo.idTipoAlg ?? algoritmo.idtipoalg ?? algoritmo.id_tipo_alg

    return {
        idAlg: asNumber(id),
        descAlg: String(algoritmo.descAlg ?? algoritmo.descalg ?? algoritmo.desc_alg ?? algoritmo.nome ?? ''),
        mosse: String(algoritmo.mosse ?? algoritmo.moves ?? algoritmo.algoritmo ?? '').trim(),
        scramble: String(algoritmo.scramble ?? '').trim(),
        cubeState: algoritmo.cubeState ?? algoritmo.cubestate ?? algoritmo.cube_state ?? null,
        imgpath: algoritmo.imgpath ?? algoritmo.imgpath ?? algoritmo.imgpath ?? null,
        idTipoAlg: asNumber(idTipo)
    }
}

function normalizzaStatAllenamento(stat) {
    const id = stat.idAlg ?? stat.idalg ?? stat.id_alg ?? stat.id

    return {
        idAlg: asNumber(id),
        best: asNumber(stat.best),
        media: asNumber(stat.media ?? stat.average),
        nSolves: asNumber(stat.nSolves ?? stat.nsolves ?? stat.n_solve ?? stat.nsolve, 0)
    }
}

export async function getTipiAlgoritmo() {
    const payload = await getRequest('/tipi-algoritmo')

    return asArray(payload, ['tipiAlgoritmo', 'tipi', 'types'])
        .map(normalizzaTipoAlgoritmo)
        .filter(tipo => tipo.idTipoAlg !== null)
}

export async function getAlgoritmiByTipo(idTipoAlg) {
    const payload = await postRequest(`/getAlgoritmi`, {idTipoAlg})
    return asArray(payload, ['algoritmi', 'algorithms'])
        .map(normalizzaAlgoritmo)
        .filter(algoritmo => algoritmo.idAlg !== null)
}

export async function getAllenamentoByTipo(idTipoAlg, idUt = null) {
    const payload = await postRequest(`/getAllenamento`, {idTipoAlg: idTipoAlg, idUt: idUt ? idUt : ''})

    return asArray(payload, ['allenamento', 'stats', 'statistiche'])
        .map(normalizzaStatAllenamento)
        .filter(stat => stat.idAlg !== null)
}

export async function salvaSolveAllenamento(payload) {
    return await postRequest('/allenamento/solve', {
        idUt: payload.idUt,
        idAlg: payload.idAlg,
        tempo: payload.tempo,
        best: payload.best,
        media: payload.media,
        nSolves: payload.nSolves
    })
}
