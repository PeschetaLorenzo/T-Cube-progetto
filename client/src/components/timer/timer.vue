<template>
    <section>
        <div class="timer">
            {{time|0}}<small>.{{(time).toString().split('.')[1]}}</small>
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

</template>

<script>



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
            
            time: 19.244
        }
    },
    computed:{
        seconds() {
            this.time = this.timer.time
        }
    },
    methods:{
        startTimer() {
            console.log('start')
        },
        stopTimer() {
            console.log('stop')

        },
        startInspection(){
            console.log('ispezione')

        }

    },
    mounted() {

    }
}


</script>

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