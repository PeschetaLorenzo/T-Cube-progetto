import { showAlert } from '@/components/utilities/modal/alert'
import { useTimerStore } from '@/stores/timer'
import { getRequest, postRequest } from './apiClient'

const DEFAULT_ID_TIPO = 1
const RECORD_COUNTS = [3, 5, 12, 100, 1000]

// Legge JSON da sessionStorage senza far fallire la UI se il dato e assente o corrotto.
function readStorage(key, fallback = null) {
    try {
        return JSON.parse(sessionStorage.getItem(key) ?? JSON.stringify(fallback))
    } catch(err) {
        return fallback
    }
}

function writeStorage(key, value, eventName = null) {
    sessionStorage.setItem(key, JSON.stringify(value))

    if (eventName) {
        window.dispatchEvent(new Event(eventName))
    }
}

export function getUtente() {
    return readStorage('utente')
}

function setUtente(utente) {
    writeStorage('utente', utente)
}

function getTipoCuboId() {
    return readStorage('tipoCubo', {})?.idtipo ?? DEFAULT_ID_TIPO
}

function setSolvesStorage(solves) {
    writeStorage('solves', solves ?? [], 'solves-updated')
}

function setStatsStorage(stats) {
    writeStorage('statistiche', stats ?? [], 'stats-updated')
}

// Converte i flag avg/bpa/wpa nella lista di record richiesti.
function getSelectedCounts(flags, includeAll = false) {
    const counts = RECORD_COUNTS.filter((_, index) => flags[index])

    if (includeAll) {
        counts.push(getLastXTempi().length)
    }

    return counts
}

function averageMs(tempi) {
    if (tempi.length === 0) {
        return null
    }

    const somma = tempi.reduce((acc, tempo) => acc + tempo, 0)
    return somma / tempi.length
}

function formatMsAsSeconds(tempo) {
    return tempo == null ? null : (tempo / 1000).toFixed(3)
}

function getSolveTimes() {
    return getLastXTempi()
        .map(solve => Number(solve.time))
        .filter(tempo => !Number.isNaN(tempo))
}

// Calcola BPA/WPA: il prossimo tempo estremo viene escluso, poi si toglie l'altro estremo.
function calcolaPossibleAverage(nsolve, tipo) {
    if (!nsolve || nsolve <= 1) {
        return null
    }

    const requiredSolves = nsolve - 1
    const tempi = getSolveTimes().slice(-requiredSolves)

    if (tempi.length < requiredSolves) {
        return null
    }

    const tempiOrdinati = [...tempi].sort((a, b) => a - b)

    if (tipo === 'bpa') {
        tempiOrdinati.pop()
    } else {
        tempiOrdinati.shift()
    }

    return formatMsAsSeconds(averageMs(tempiOrdinati))
}

// Recupera dal backend i tipi di cubo disponibili.
export async function getTipiCubo() {
    const res = await getRequest('/getTipiCubo')
    return res.status === 200 ? res.tipiCubo : []
}

// Restituisce le average selezionate. Mantiene la firma a flag usata dai componenti.
export async function getAvgs(avg3=false, avg5=false, avg12=false, avg100=false, avg1000=false, avgAll=false) {
    return getSelectedCounts([avg3, avg5, avg12, avg100, avg1000], avgAll)
}

// Best possible average: media ottenibile se la prossima solve e il nuovo best escluso.
export function getBpas(bpa3=false, bpa5=false, bpa12=false, bpa100=false, bpa1000=false, bpaAll=false) {
    return getSelectedCounts([bpa3, bpa5, bpa12, bpa100, bpa1000], bpaAll)
        .map(nsolve => calcolaPossibleAverage(nsolve, 'bpa'))
}

// Worst possible average: media ottenibile se la prossima solve e il nuovo worst escluso.
export function getWpas(wpa3=false, wpa5=false, wpa12=false, wpa100=false, wpa1000=false, wpaAll=false) {
    return getSelectedCounts([wpa3, wpa5, wpa12, wpa100, wpa1000], wpaAll)
        .map(nsolve => calcolaPossibleAverage(nsolve, 'wpa'))
}

// Legge le solve locali, eventualmente limitandole alle ultime N.
export function getLastXTempi(limit = null) {
    const solves = readStorage('solves', [])
    return limit ? solves.slice(-limit) : solves
}

export async function getCalendarMonth(year, month) {
    const utente = getUtente()

    if (!utente) {
        return {
            year,
            month,
            startsOn: new Date(year, month - 1, 1).getDay(),
            days: []
        }
    }

    const res = await postRequest('/getCalendarMonth', {
        idUt: utente.id,
        idTipo: getTipoCuboId(),
        year,
        month
    })

    return res.calendar
}

export function getStatistiche() {
    return getUserStatistics()
}

// Login utente e refresh dei dati dipendenti dall'account.
export async function login(email, pwd) {
    const res = await postRequest('/login', {mail: email, pwd})

    if (res.status === 200) {
        setUtente({id: res.user.id, username: res.user.username, mail: email})
        await Promise.all([getUserSolves(), getStatistiche()])
    }

    return res
}

// Registrazione utente e salvataggio della sessione locale.
export async function registrazione(username, email, pwd) {
    const res = await postRequest('/registrazione', {username, mail: email, pwd})

    if (res.status === 200) {
        setUtente({id: res.user.id, username: res.user.username, mail: email})
        await Promise.all([getUserSolves(), getStatistiche()])
    }

    return res
}

// Aggiorna username, email o password dell'account corrente.
export async function changeAccount(campo, valore) {
    const utente = getUtente()

    if (!utente) {
        throw new Error('Utente non loggato')
    }

    const newValues = {
        username: utente.username,
        mail: utente.mail
    }

    switch(campo) {
        case 'username':
            newValues.username = valore
            break
        case 'email':
        case 'mail':
            newValues.mail = valore
            break
        case 'password':
            newValues.pwd = valore
            break
    }

    const res = await postRequest('/changeAccount', {id: utente.id, newValues})

    if (res.status === 200) {
        setUtente({id: res.user.id, username: res.user.username, mail: res.user.mail})
    }

    return res
}

// Salva una nuova solve e ricarica solve/statistiche dal backend.
export async function addNewSolve() {
    const timer = useTimerStore()
    const utente = getUtente()
    const tipoCubo = readStorage('tipoCubo', {})

    if (!utente) {
        showAlert('Effettua il login per salvare la soluzione', 'danger')
        return null
    }

    const scramble = !tipoCubo?.scrambled && timer.scrambleSource !== 'manual'
        ? ''
        : timer.scramble.toString().replaceAll(',', ' ')

    const body = {
        idUt: utente.id,
        idTipo: getTipoCuboId(),
        tempo: timer.time.toFixed(),
        scramble,
        falloIspezione: timer.falloIspezione,
        falloMossa: false
    }

    const res = await postRequest('/addSolve', body)
    await Promise.all([getUserSolves(), getStatistiche()])
    writeStorage('lastSolve', res.solve.ordine)
    return res
}

// Recupera le solve dell'utente e aggiorna sessionStorage/eventi UI.
export async function getUserSolves() {
    const utente = getUtente()

    if (!utente) {
        setSolvesStorage([])
        return []
    }

    const res = await postRequest('/getSolves', {
        idUt: utente.id,
        idTipo: getTipoCuboId()
    })

    setSolvesStorage(res.solves)
    return res.solves
}

// Recupera tutti i dettagli di una solve specifica dato il suo ordine.
export async function getFullSolveData(ordine) {
    const utente = getUtente()

    if (!utente) {
        throw new Error('Utente non loggato')
    }

    return await postRequest('/getFullSolveData', {
        idUt: utente.id,
        idTipo: getTipoCuboId(),
        ordine
    })
}

// Recupera current/best record dell'utente e aggiorna la tabella statistiche.
async function getUserStatistics() {
    const utente = getUtente()

    if (!utente) {
        setStatsStorage([])
        return []
    }

    const res = await postRequest('/getStats', {
        idUt: utente.id,
        idTipo: getTipoCuboId()
    })

    setStatsStorage(res.stats)
    return res.stats
}


export async function changeSolve(campo, valore) {
    const utente = getUtente()

    if (!utente) {
        setStatsStorage([])
        return []
    }
    console.log(readStorage('lastSolve'))
    const res = await postRequest('/changeSolve', {
        idUt: utente.id,
        idTipo: getTipoCuboId(),
        ordine: getLastXTempi(1)[0].nRecord ,
        campo, 
        valore
    })

    showAlert("Solve aggiornata con successo", 'success')
    await getUserSolves()
    updateTimerStore()
    return res
}

export async function deleteSolve() {
    const utente = getUtente()

    if (!utente) {
        setStatsStorage([])
        return []
    }
    console.log(getLastXTempi(1)[0].nRecord)
    const res = await postRequest('/deleteSolve', {
        idUt: utente.id,
        idTipo: getTipoCuboId(),
        ordine: getLastXTempi(1)[0].nRecord
    })

    showAlert("Solve eliminata con successo", 'success')
    await getUserSolves()
    updateTimerStore()

    return res
}


function updateTimerStore(){
    const timer = useTimerStore()
    const lastSolve = getLastXTempi(1)[0]
    console.log(lastSolve)
    timer.time = lastSolve.time
    timer.scramble = lastSolve.scramble
    timer.scrambleSource = 'saved'
    timer.falloIspezione = lastSolve.falloIspezione
    timer.falloMossa = lastSolve.falloMossa
    timer.isDNF = lastSolve.isdnf
    timer.ordine = lastSolve.nRecord
}
