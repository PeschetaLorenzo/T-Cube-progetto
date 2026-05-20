<script>
export default {
    props: {
        stats: [],
        tempi: []
    },
    data(){
        
    },
    computed:{
        statisticheTable(){
            return [...(this.stats ?? [])]
        },
        avgAllCurrent() {
            const validTimes = (this.tempi ?? [])
                .filter(solve => !this.isDnf(solve))
                .map(solve => Number(solve?.time))
                .filter(time => Number.isFinite(time))

            if (validTimes.length === 0) {
                return null
            }

            return validTimes.reduce((sum, time) => sum + time, 0) / validTimes.length
        }
    },
    methods:{
        isDnf(solve) {
            return Boolean(solve?.isdnf || solve?.isDnf || solve?.isDNF || solve?.penalties?.dnf || solve?.penalties?.DNF)
        },
        formatStat(value, isDnf = false, isAvailable = true) {
            if (!isAvailable) {
                return '-'
            }

            if (isDnf) {
                return 'DNF'
            }

            const numericValue = Number(value)
            return value != null && Number.isFinite(numericValue) ? (numericValue / 1000).toFixed(3) : '-'
        }
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
            <tr v-if="statisticheTable.length === 0">
                <td colspan="3">Nessuna statistica disponibile</td>
            </tr>
            <tr v-for="stat in statisticheTable">
                <th>{{stat.descRecord}}</th>
                <td>{{ formatStat(stat.current, stat.currentIsDnf, stat.currentAvailable) }}</td>
                <td class="best">{{ formatStat(stat.statBest, stat.statBestIsDnf, stat.statBestAvailable) }}</td>
            </tr>
            <tr>
                <th>AvgAll ({{ tempi.length }})</th>
                <td >{{ formatStat(avgAllCurrent) }}</td>
            </tr>
            <small>(solo tempi validi per il calcolo)</small>
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

    .best{
        color: var(--vueGreen);
    }


    
</style>
