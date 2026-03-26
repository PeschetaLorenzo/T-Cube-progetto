var ispezione = false;
var timerFase = false;


let timer;
let longPress = false;
const DELAY = 500;

document.addEventListener('keydown', (e) => {
    switch(e.key)
    {
        case ' ':
            if (e.repeat) return;

            longPress = false;
            timer = setTimeout(() => {
                longPress = true;
                console.log('LONG PRESS');
                if(ispezione)
                {
                    timerFase = true
                    avviaTimer()
                }
                
            }, DELAY);
            break;
    }
});

document.addEventListener('keyup', (e) => {
    switch(e.key)
    {
        case ' ':
            clearTimeout(timer);

            if (!longPress) {
                console.log('SHORT PRESS');
                if(!ispezione && !timerFase)
                {
                    ispezione=true
                    setTimeout(()=>{
                    if(ispezione && !timerFase)
                        avviaTimer()
                    else
                        return
                    }, 15000)

                    avviaIspezione()
                }
                else if(timerFase)
                {
                    timerFase = false
                    ispezione = false
                    stopTimer()
                }
            }
            break;
    }

});



function avviaIspezione(){
    ispezione=true
    console.log('ispezione')
    setTimeout(()=>{
        if(ispezione && !timerFase)
            avviaTimer()
        else
            return
        }, 15000)

}


function avviaTimer(){
    timerFase = true
    console.log('timer')

}

function stopTimer(){
    timerFase = false
    ispezione = false
    console.log('stop')


}