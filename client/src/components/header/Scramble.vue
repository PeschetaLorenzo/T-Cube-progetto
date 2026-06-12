<script>
import { displayScramble, generateScramble } from '@/js/cube.js';

export default {
    props: {
        lenScramble: {
            type: Number,
            default: 18
        }
    },
    emits: ['newScramble'],
    data(){
        return {
            scramble: [],
            prevScramble: []
        }
    },
    methods:{
        generateScramble(emitEvent = true){
            this.prevScramble.push([...this.scramble]);
            this.scramble = displayScramble(generateScramble(this.lenScramble))
            if (emitEvent) {
                this.$emit('newScramble', this.scramble)
            }
        },
        oldScramble(){
            this.scramble = this.prevScramble[this.prevScramble.length - 1]
            this.prevScramble.pop()
            this.$emit('newScramble', this.scramble)            
        },
        setScramble(scramble){
            this.scramble = scramble
        }
    },
    created() {
        this.generateScramble(false)
    },
    mounted() {
        this.$emit('newScramble', this.scramble)
    }

}
</script>

<template>
    <div class="scramble-list">
        <p v-for="(item, index) in scramble" :key="`${item}-${index}`" class="m-2">
            {{ item }}
        </p>

    </div>
</template>


<style scoped>
.scramble-list{
    width: 100%;
    min-width: 0;
    display: flex;
    flex-direction: row;
    flex-wrap:wrap;
    justify-content: center;
    gap: 0.15rem 0.35rem;
}

p{
    margin: 0.25rem;
    font-size: clamp(1.15rem, 3vw, 2rem);
    line-height: 1.15;
    font-family: monospace;
    
}

@media (max-width: 900px) and (orientation: landscape) {
    p {
        font-size: clamp(1rem, 2.4vw, 1.45rem);
    }
}
</style>
