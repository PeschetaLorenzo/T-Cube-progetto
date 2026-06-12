<script>
import { useTimerStore } from '@/stores/timer'

export default {
    props: {
        hasAutoScramble: {
            type: Boolean,
            default: true
        }
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
    <div class="scramble-buttons">
        <button class="btn m-1" :disabled="timer.phase != 'idle' || !hasAutoScramble" @click="$emit('btnAction', 'oldScramble')">Ripeti scramble</button>
        <button class="btn m-1" :disabled="timer.phase != 'idle' || !hasAutoScramble" @click="$emit('btnAction', 'generate')">Nuovo scramble</button>
        <button class="btn m-1" :disabled="timer.phase != 'idle'" @click="$emit('btnAction', 'insert')">Inserisci scramble</button>
    </div>
</template>

<style scoped>
    .scramble-buttons{
        display: flex;
        flex-direction: column;
        align-items: stretch;
        gap: 0.35rem;
        width: fit-content;
    }

    button{
        min-width: 10rem;
        min-height: 2.35rem;
        background-color: hsla(160, 100%, 37%, 1);
        
        white-space: normal;
        line-height: 1.1;
    }

    @media (max-width: 1024px) {
        .scramble-buttons {
            width: 100%;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: center;
        }

        button {
            flex: 1 1 10rem;
            max-width: 14rem;
        }
    }

    @media (max-width: 640px) {
        button {
            min-width: 0;
            flex-basis: 100%;
        }
    }
</style>
