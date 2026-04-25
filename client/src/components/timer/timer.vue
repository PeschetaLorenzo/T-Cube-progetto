<script>

import { useTimerStore } from '@/stores/timer'
import { setupEvents } from '@/js/event'
import Cubo from './../Cubo.vue'
 
export default {
    props: {
        wpas: {
            type: [Number]
        },
        bpas: {
            type: [Number]
        }
    },
    data(){
        return{
            timer: useTimerStore(),
            time: 19.244
        }
    },
    computed:{
        displayTime() {
           return (this.timer.time / 1000).toFixed(3)
        }
    },
    methods:{
    },
    mounted() {
      setupEvents()

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
                {{ displayTime .toString().split('.')[0]}}.<small>{{ displayTime .toString().split('.')[1]}}</small>
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
    </section>
    <Cubo></Cubo>

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


</style>