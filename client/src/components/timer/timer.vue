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
    <section>
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
    section{
        display: flex;
        flex-direction: column;
        justify-items: center;
        align-items: center;
    }

    .timer{
        font-size: 140pt;
        font-family: monospace;

        >small{
            font-size: 110pt;
        }
    }

    .infos{
        display: flex;
        flex-direction: row;
        justify-items: center;
        align-items: center;
        text-align: center;

        >div{
            margin: 30px;
        }
    }

    p{
        font-size: 15pt;
        margin: 10px;
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
    flex: 0 0 auto;
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem;
    align-items: center;
    justify-content: space-between;
}

.control-group {
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
    width: 50%;
    height: 1.8rem;
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

</style>
