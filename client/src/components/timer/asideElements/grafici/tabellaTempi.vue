<script>
import { openSolveInfoModal } from '@/components/utilities/modal/solveInfoModal'

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
        openSolveInfo(idORd){
            openSolveInfoModal(idORd)
        },
        isDnf(solve) {
            return Boolean(solve?.isdnf || solve?.isDnf || solve?.isDNF || solve?.penalties?.dnf || solve?.penalties?.DNF)
        },
        formatMs(time) {
            if (time == null || time === '') {
                return 'DNF'
            }

            const numericTime = Number(time)
            return Number.isFinite(numericTime) ? (numericTime / 1000).toFixed(3) : String(time)
        },
        formatSolveTime(solve) {
            const formattedTime = this.formatMs(solve?.time)
            return this.isDnf(solve) ? `DNF(${formattedTime})` : formattedTime
        },
        formatAverage(value) {
            return value == null ? 'DNF' : this.formatMs(value)
        }
        
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
            <tr v-for="tempo in tempiTabella" :key="tempo.nRecord" @click="openSolveInfo(tempo.nRecord)">
                <td>{{tempo.nRecord}}</td>
                <td :class="{ best: tempo.isBestSingle}">{{ formatSolveTime(tempo) }}</td>
                <td :class="{ best: tempo.isBestAvg5}">{{ formatAverage(tempo.avg5) }}</td>
                <td class="progression">{{tempo.progression == 1 ? '▼' : tempo.progression == -1 ? '▲' : tempo.progression == 0 ? '=' : ' '}}</td>
            </tr>
        </tbody>
    </table>

</template>
<style scoped>
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
