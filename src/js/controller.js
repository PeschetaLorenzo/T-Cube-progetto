export function getAvgs(avg3=false, avg5=false, avg12=false, avg100=false, avg1000=false, avgAll=false)
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

export function getLast100Tempi(){
    let tempi = []

    let min = 99999
    let prec = ''
    for(let i = 1; i < 20; i++)
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