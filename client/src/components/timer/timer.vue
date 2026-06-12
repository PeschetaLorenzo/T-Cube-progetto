<script>

import { useTimerStore } from '@/stores/timer'
import { setupEvents } from '@/js/event'
import { changeSolve, deleteSolve } from '@/js/controller'; 
 
export default {
    props: {
        wpas: {
            type: Array,
            default: () => []
        },
        bpas: {
            type: Array,
            default: () => []
        },
        canUseTimer: {
            type: Boolean,
            default: true
        },
    },
    data(){
        return{
            timer: useTimerStore(),
            cleanupEvents: null,
        }
    },
    computed:{

    },
    methods:{
        btnClickMove(){
            this.timer.falloMossa = !this.timer.falloMossa
            changeSolve('fallomossa', this.timer.falloMossa)
        },
        btnClickDNF(){
            this.timer.isDNF = !this.timer.isDNF
            changeSolve('isDNF', this.timer.isDNF)

        },
        btnClickDel(){
            deleteSolve()
        }
    },
    mounted() {
      this.cleanupEvents = setupEvents(() => this.canUseTimer)
    },
    beforeUnmount() {
      if (this.cleanupEvents) {
        this.cleanupEvents()
      }
    }
}


</script>

<template>
    <section class="timer-panel">
        <div class="timer">
            <div
            :style="{
            color:
                timer.phase === 'ready' ? 'green' :
                timer.phase === 'inspection' ? 'orange' :
                timer.phase === 'running' ? 'red' : 'white'
            }"
            >
                <div v-if="timer.phase === 'inspection'">
                {{ timer.inspectionTime }}
                </div>

                <div v-else>
                {{ (timer.time / 1000).toFixed(3).toString().split('.')[0]}}.<small>{{ (timer.time / 1000).toFixed(3) .toString().split('.')[1]}}</small>
                </div>
            </div>
        </div>
        <div class="infos">
            <div>
                <p>BPA of 5: {{bpas[0]}}</p>
                <p>WPA of 5: {{wpas[0]}}</p>
            </div>
            <div>
                <p>BPA of 12: {{bpas[1]}}</p>
                <p>WPA of 12: {{wpas[1]}}</p>
            </div>
        </div>
        <div class="chart-controls row">
            <div class="control-group">
                <button type="button"  :class="{ checked: timer.falloMossa }" :disabled="timer.phase !== 'idle' || timer.time == 0" aria-label="Mostra solve successive" @click="btnClickMove()">+2</button>
                <button type="button" :class="{ checked: timer.isDNF }" :disabled="timer.phase !== 'idle' || timer.time == 0" aria-label="Segna come DNF" @click="btnClickDNF()">DNF</button>
            </div>
            
            <div class="control-group d-flex">
                <button type="button" class="bg-danger w-100 delete" :disabled="timer.phase !== 'idle' || timer.time == 0" aria-label="Segna come DNF" @click="btnClickDel()">🗑️ ELIMINA</button>
            </div>
        </div>
    </section>

</template>



<style scoped>
    .timer-panel{
        width: min(100%, 60rem);
        display: flex;
        flex-direction: column;
        justify-items: center;
        align-items: center;
        gap: clamp(0.75rem, 2vw, 1.5rem);
    }

    .timer{
        width: 100%;
        font-size: clamp(4.75rem, 17vw, 11.5rem);
        font-family: monospace;
        line-height: 0.95;
        text-align: center;
        overflow-wrap: anywhere;

        small{
            font-size: 0.72em;
        }
    }

    .infos{
        width: min(100%, 42rem);
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.75rem;
        justify-items: center;
        align-items: center;
        text-align: center;

        >div{
            width: 100%;
            padding: 0.65rem;
            border: 1px solid var(--color-border);
            border-radius: var(--radius-md);
            background: var(--color-background-soft);
        }
    }

    p{
        font-size: clamp(0.95rem, 2vw, 1.25rem);
        margin: 0.25rem;
    }

    .chart-panel {
        width: 100%;
        height: 100%;
        max-width: 100%;
        max-height: 100%;
        display: flex;
        flex-direction:column-reverse;
        gap: 0.65rem;
        overflow: hidden;
        padding: 0.25rem 0.35rem 0.65rem;
    }

.chart-controls {
    width: min(100%, 34rem);
    flex: 0 0 auto;
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem;
    align-items: center;
    justify-content: space-between;
}

.control-group {
    flex: 1 1 12rem;
    display: inline-flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem;
    border: 1px solid var(--color-border);
    border-radius: 6px;
    background: var(--color-background-soft);
}

button {
    width: 100%;
    min-width: 4.5rem;
    min-height: 2.25rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--color-border);
    border-radius: 5px;
    color: var(--color-text);
    background: var(--color-background);
    line-height: 1;
    transition:
        color 0.2s,
        border-color 0.2s,
        background-color 0.2s;
}

button:hover:not(:disabled),
button:focus-visible:not(:disabled), .checked{
    color: var(--vueGreen);
    border-color: var(--vueGreen);
    background: hsla(160, 100%, 37%, 0.12);
}

.delete:hover:not(:disabled),
.delete:focus-visible:not(:disabled){
    box-shadow: 0 0 10px darkred, 0 0 30px darkred, 0 0 60px darkred;
    color: rgb(116, 12, 12);
    border-color: rgb(116, 12, 12);

}

button:disabled {
    cursor: not-allowed;
    opacity: 0.45;
}

@media (max-width: 640px) {
    .timer-panel {
        justify-content: flex-start;
    }

    .infos {
        grid-template-columns: 1fr;
    }

    .chart-controls {
        justify-content: center;
    }
}

@media (max-width: 900px) and (orientation: landscape) {
    .timer-panel {
        gap: 0.5rem;
    }

    .timer {
        font-size: clamp(3.8rem, 15vh, 7rem);
    }

    .infos {
        width: min(100%, 38rem);
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 0.4rem;
    }

    .infos > div {
        padding: 0.45rem;
    }

    p {
        font-size: 0.88rem;
    }

    .chart-controls {
        max-width: 40rem;
    }
}

</style>
