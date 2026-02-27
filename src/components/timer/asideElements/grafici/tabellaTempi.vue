<script>

export default {
    props: {
        tempi: []
    },
    data(){
        
    },
    computed:{
        
    },
    methods:{

        
    },
    created() {
        this.tempi.reverse()
    },

}
</script>

<template>
    <table>
        <thead>
            <tr>
                <th>n</th>
                <th>Tempo </th>
                <th>Avg 5</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="tempo in tempi">
                <td>{{tempo.nRecord}}</td>
                <td :class="{ best: tempo.isBest}">{{tempo.time}}</td>
                <td :class="{ best: tempo.isInBest}">{{tempo.avg5}}</td>
                <td class="progression">{{tempo.progression}}</td>
            </tr>
        </tbody>
    </table>

</template>


<style scoped>
    template{
    }

    table{
        width: max-content;
        text-align: center;
        width: 100%;
        border-collapse: collapse;
        
    }

    tr{
        border-bottom: 1pt solid white;
    }

    tbody>tr:hover{
        background-color: hsla(160, 100%, 37%, 0.2);
    }

    td{
        width: 80px;
        padding:3px;
    }

    .progression{
        width: 40px;
    }

    th{
        font-weight: bold;
        margin-right: 10px;
        padding: 5px;
    }

    .best{
        color: var(--vueGreen);
    }
</style>