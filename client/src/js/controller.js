import { showAlert } from '@/components/utilities/alert'
import { useTimerStore } from '@/stores/timer'

const URL_SERVER = 'http://localhost:3000'

export async function getTipiCubo() {
    return getRequest('/getTipiCubo').then((res => {
        console.log(res)
        if(res.status == 200)
        {
            console.log(res)
            return res.tipiCubo
        }
    }))
}

export async function getAvgs(avg3=false, avg5=false, avg12=false, avg100=false, avg1000=false, avgAll=false)
{
    let avgs = []

    if(avg3)
        avgs.push(3)

    if(avg5)
        avgs.push(5.001)
    
    if(avg12)
        avgs.push(12)
    
    if(avg100)
        avgs.push(100)
    
    if(avg1000)
        avgs.push(1000)
    
    if(avgAll)
        avgs.push(0)

     
    return avgs 
}

export function getBpas(bpa3=false, bpa5=false, bpa12=false, bpa100=false, bpa1000=false, bpaAll=false)
{
    let bpas = []

    console.log(JSON.parse(sessionStorage.getItem('solves')))

    if(bpa3)
        bpas.push(calcolaBpa(3))
    if(bpa5)
        bpas.push(calcolaBpa(5))
    if(bpa12)
        bpas.push(calcolaBpa(12))
    if(bpa100)
        bpas.push(calcolaBpa(100))
    if(bpa1000)
        bpas.push(calcolaBpa(1000))
    if(bpaAll)
        bpas.push(calcolaBpa(JSON.parse(sessionStorage.getItem('solves') ?? '[]').length))
    
    return bpas 
}

export function getWpas(wpa3=false, wpa5=false, wpa12=false, wpa100=false, wpa1000=false, wpaAll=false)
{
    let wpas = []

    if(wpa3)
        wpas.push(calcolaWpa(3))

    if(wpa5)
        wpas.push(calcolaWpa(5))
    
    if(wpa12)
        wpas.push(calcolaWpa(12))
    
    if(wpa100)
        wpas.push(calcolaWpa(100))
    
    if(wpa1000)
        wpas.push(calcolaWpa(1000))
    
    if(wpaAll)
        wpas.push(calcolaWpa(JSON.parse(sessionStorage.getItem('solves') ?? '[]').length))

     
    return wpas 
}

export function getLastXTempi(){
    let tempi

    try {
        tempi = JSON.parse(sessionStorage.getItem('solves') ?? '[]')
    } catch(err) {
        tempi = []
    }

    console.log(tempi)
    return tempi
}

export function getMonthData(MM, YYYY){
    let mese = []

    let dataIn = new Date(year=YYYY, monthIndex=MM)
    console.log(new Date(year=YYYY, monthIndex=MM))

    for(let i = 0; i < 30; i++)
        mese.push({
            tempi: getLastXTempi(Math.round(Math.random()*100)), 
            data: dataIn})

    return mese

}

export function getStatistiche(){
    return getUserStatistics()
}

export function login(email, pwd){    
    postRequest('/login', {mail: email, pwd: pwd}).then(res => {
        console.log(res)
        if(res.status == 200)
        {
            let utente = {id: res.user.id, username: res.user.username, mail: email}
            sessionStorage.setItem("utente", JSON.stringify(utente)); 
            console.log(JSON.parse(sessionStorage.getItem('utente')))

            getUserSolves()
            getStatistiche()
        }
    })
}

export function registrazione(username, email, pwd){
    postRequest('/registrazione', {username: username, mail: email, pwd: pwd}).then(res => {
        console.log(res)
        if(res.status == 200)
        {
            let utente = {id: res.user.id, username: res.user.username, mail: email}
            sessionStorage.setItem("utente", JSON.stringify(utente)); 
            console.log(JSON.parse(sessionStorage.getItem('utente')))
        }
    })
}

export function changeAccount(campo, valore)
{
    console.log(JSON.parse(sessionStorage.getItem('utente')))
    let newValues = {
        'username': JSON.parse(sessionStorage.getItem('utente')).username,
        'mail': JSON.parse(sessionStorage.getItem('utente')).mail,
    }

    switch(campo)
    {
        case 'username':
            newValues['username'] = valore
            break;
        case 'mail':
            newValues['mail'] = valore
            break;
        case 'password':
            newValues['pwd'] = valore
            break;
        
    }
    console.log({id: JSON.parse(sessionStorage.getItem('utente')).id, newValues: newValues})

    return postRequest('/changeAccount', {id: JSON.parse(sessionStorage.getItem('utente')).id, newValues: newValues}).then(res => {
        console.log(res)
        if(res.status == 200)
        {
            let utente = {id: res.user.id, username: res.user.username, mail: res.user.mail}
            sessionStorage.setItem("utente", JSON.stringify(utente)); 
            console.log(JSON.parse(sessionStorage.getItem('utente')))
        }
        return res
    })
}


export function addNewSolve(){
    const timer = useTimerStore()

    if(sessionStorage.getItem('utente'))
    {
        let idTipo

        try{
            idTipo = JSON.parse(sessionStorage.getItem('tipoCubo'))?.idtipo ?? 1
        }
        catch(err)
        {
            idTipo = 1
        }

        let body = {
            idUt: JSON.parse(sessionStorage.getItem('utente')).id,
            idTipo: idTipo,
            tempo: timer.time.toFixed(),
            scramble: timer.scramble.toString().replaceAll(',', ' '),
            falloIspezione: timer.falloIspezione,
            falloMossa: false
        }
        console.log(body)

        return postRequest("/addSolve", body).then(res => {
            console.log(res)
            return Promise.all([getUserSolves(), getStatistiche()]).then(() => res)
        })
    }
    else
        showAlert('Effettua il login per salvare la soluzione', 'danger')
    

}

export function getUserSolves()
{
    if(!sessionStorage.getItem('utente')) {
        setSolvesStorage([])
        return Promise.resolve([])
    }

    const idUt = JSON.parse(sessionStorage.getItem('utente')).id
    let idTipo

    try{
        idTipo = JSON.parse(sessionStorage.getItem('tipoCubo'))?.idtipo ?? 1
    }
    catch(err)
    {
        idTipo = 1
    }
    
    return postRequest('/getSolves', {idUt: idUt, idTipo: idTipo}).then(res => {
        console.log(res)
        setSolvesStorage(res.solves)
        return res.solves
    })
}

function getUserStatistics(){
    if(!sessionStorage.getItem('utente')) {
        sessionStorage.setItem('solves', JSON.stringify([]))
        window.dispatchEvent(new Event('solves-updated'))
        return Promise.resolve([])
    }

    const idUt = JSON.parse(sessionStorage.getItem('utente')).id
    let idTipo

    try{
        idTipo = JSON.parse(sessionStorage.getItem('tipoCubo'))?.idtipo ?? 1
    }
    catch(err)
    {
        idTipo = 1
    }
    
    return postRequest('/getStats', {idUt: idUt, idTipo: idTipo}).then(res => {
        console.log(res)
        sessionStorage.setItem('statistiche', JSON.stringify(res.stats))
        window.dispatchEvent(new Event('stats-updated'))
        return res.stats
    })}

/*
    getRequest("/api/test-db", {}).then(res => console.log(res))
    postRequest("/api/test-db", {}).then(res => console.log(res))
*/


function getRequest(service){
    return fetch(URL_SERVER+service)
        .then(res => res.json())
}

function postRequest(service, body){
     return fetch(`${URL_SERVER}${service}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body)
      }).then(res => res.json());
}

function setSolvesStorage(solves){
    sessionStorage.setItem('solves', JSON.stringify(solves ?? []))
    window.dispatchEvent(new Event('solves-updated'))
}


function calcolaBpa(nsolve){
    if (!nsolve || nsolve <= 1)
        return null

    let solves

    try {
        solves = JSON.parse(sessionStorage.getItem('solves') ?? '[]')
    } catch(err) {
        solves = []
    }

    // La prossima media avra il nuovo tempo migliore escluso:
    // quindi servono solo gli ultimi nsolve - 1 tempi gia salvati.
    if (solves.length < nsolve - 1)
        return null

    let tempi = solves
        .slice(-(nsolve - 1))
        .map(solve => Number(solve.time))
        .filter(tempo => !Number.isNaN(tempo))

    if (tempi.length < nsolve - 1)
        return null

    tempi.sort((a, b) => a - b)

    // Il nuovo best sarebbe il tempo piu basso ed esce dalla media;
    // tra i tempi rimasti va escluso il worst.
    tempi.pop()

    if (tempi.length === 0)
        return null

    const somma = tempi.reduce((acc, tempo) => acc + tempo, 0)
    const media = somma / tempi.length

    return (media / 1000).toFixed(3)
}

function calcolaWpa(nsolve){
    if (!nsolve || nsolve <= 1)
        return null

    let solves

    try {
        solves = JSON.parse(sessionStorage.getItem('solves') ?? '[]')
    } catch(err) {
        solves = []
    }

    // La prossima media avra il nuovo tempo peggiore escluso:
    // quindi servono solo gli ultimi nsolve - 1 tempi gia salvati.
    if (solves.length < nsolve - 1)
        return null

    let tempi = solves
        .slice(-(nsolve - 1))
        .map(solve => Number(solve.time))
        .filter(tempo => !Number.isNaN(tempo))

    if (tempi.length < nsolve - 1)
        return null

    tempi.sort((a, b) => a - b)

    // Il nuovo worst sarebbe il tempo piu alto ed esce dalla media;
    // tra i tempi rimasti va escluso il best.
    tempi.shift()

    if (tempi.length === 0)
        return null

    const somma = tempi.reduce((acc, tempo) => acc + tempo, 0)
    const media = somma / tempi.length

    return (media / 1000).toFixed(3)
}
