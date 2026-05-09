<script>
import { useTimerStore } from '@/stores/timer'

export default {
    props: {

    },
    data(){
        return{
            timer: useTimerStore()
        }
    },
    methods: {

    }
}
</script>

<template>
    <div>
        <button class="btn m-1" :disabled="timer.phase != 'idle'" @click="$emit('btnAction', 'oldScramble')">Ripeti scramble</button>
        <button class="btn m-1" :disabled="timer.phase != 'idle'" @click="$emit('btnAction', 'generate')">Nuovo scramble</button>
        <button class="btn m-1" :disabled="timer.phase != 'idle'" >Riconosci scramble</button>
    </div>
</template>

<style scoped>
    div{
        display: flex;
        flex-direction: column;
        align-items: right;
        width: fit-content;
    }

    button{
        min-width:max-content;
        width: 10rem;
        background-color: hsla(160, 100%, 37%, 1);;
    }
</style>