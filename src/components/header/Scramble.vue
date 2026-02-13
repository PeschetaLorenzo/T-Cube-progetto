<script>
import { displayScramble, generateScramble } from '@/js/cube.js';

export default {
    props: {
        lenScramble: {
            type: Number,
            default: 18
        }
    },
    data(){
        return {
            scramble: [],
            prevScramble: []
        }

    },
    computed:{
        
    },
    methods:{
        generateScramble(){
            this.prevScramble.push(this.scramble);
            this.scramble = displayScramble(generateScramble(this.lenScramble))
        },
        oldScramble(){
            this.scramble = this.prevScramble[this.prevScramble.length - 1]
            this.prevScramble.pop()
            
        }
    },
    created() {
        this.generateScramble()
    },

}
</script>

<template>
    <div class="d-flex flex-row flex-wrap justify-content-center w-100">
        <p v-for="item in scramble" class="m-2">
            {{ item }}
        </p>

    </div>

</template>


<style scoped>
p{
    font-size: 24pt;
}

div{
    width: 100%;
    margin-left: 30px;
    margin-right: 30px;
}
</style>