const URL_SERVER = 'http://localhost:3000'

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

    if(bpa3)
        bpas.push(3)

    if(bpa5)
        bpas.push(5)
    
    if(bpa12)
        bpas.push(12.321)
    
    if(bpa100)
        bpas.push(100)
    
    if(bpa1000)
        bpas.push(1000)
    
    if(bpaAll)
        bpas.push(0)

     
    return bpas 
}

export function getWpas(wpa3=false, wpa5=false, wpa12=false, wpa100=false, wpa1000=false, wpaAll=false)
{
    let wpas = []

    if(wpa3)
        wpas.push(3)

    if(wpa5)
        wpas.push(5.435)
    
    if(wpa12)
        wpas.push(12)
    
    if(wpa100)
        wpas.push(100)
    
    if(wpa1000)
        wpas.push(1000)
    
    if(wpaAll)
        wpas.push(0)

     
    return wpas 
}

export function getLastXTempi(nTempi){
    let tempi = []

    let min = 99999
    let prec = ''
    for(let i = 1; i < nTempi; i++)
    {
        let t = Math.round(((Math.random() * 10)+10)*1000)/1000
        if(prec == '')
            prec = t
        min = t < min ? t : min
        tempi.push({
            nRecord: i,
            time: t,
            isBest: min == t,
            avg5: 1,
            isInBest: Math.round(Math.random()),
            progression: prec < t ? '▼' : t < prec ? '▲' : i == 1 ? ' ': '=',
        })
        prec = t
    }

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


export function login(email, pwd){    
    postRequest('/login', {mail: email, pwd: pwd}).then(res => {
        console.log(res)
        if(res.status == 200)
        {
            let utente = {id: res.user.id, username: res.user.username, mail: email}
            sessionStorage.setItem("utente", JSON.stringify(utente)); 
            console.log(JSON.parse(sessionStorage.getItem('utente')))
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
