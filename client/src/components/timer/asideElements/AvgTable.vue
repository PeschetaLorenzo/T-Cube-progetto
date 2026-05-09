<script>
export default {
    props: {
        stats: []
    },
    data(){
        
    },
    computed:{
        statisticheTable(){
            return [...(this.stats ?? [])]
        }
    },
    methods:{

        
    },
}

</script>

<template>
    <table >
        <thead>
            <tr>
                <th></th>
                <th>Current</th>
                <th>Best</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="stat in statisticheTable">
                <th>{{stat.descRecord}}</th>
                <td>{{stat.current/1000}}</td>
                <td class="text-success">{{stat.statBest/1000}}</td>
            </tr>
        </tbody>
    </table>
</template>

<style scoped>
    table{
        width: max-content;
        text-align: center;
        width: 100%;
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

    th{
        font-weight: bold;
        margin-right: 10px;
        padding: 5px;
    }


    
</style>
