<script>

export default {
    props: {
        tempi: []
    },
    data(){
        
    },
    computed:{
        tempiTabella(){
            return [...(this.tempi ?? [])].reverse()
        }
    },
    methods:{

        
    },
}
</script>

<template>
    <table v-if="tempi != undefined">
        <thead>
            <tr>
                <th>n</th>
                <th>Tempo </th>
                <th>Avg 5</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="tempo in tempiTabella" :key="tempo.nRecord">
                <td>{{tempo.nRecord}}</td>
                <td :class="{ best: tempo.isBestSingle}">{{tempo.time/1000}}</td>
                <td :class="{ best: tempo.isBestAvg5}">{{tempo.avg5/1000}}</td>
                <td class="progression">{{tempo.progression == 1 ? '▼' : tempo.progression == -1 ? '▲' : tempo.progression == 0 ? '=' : ' '}}</td>
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
