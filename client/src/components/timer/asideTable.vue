<script setup>
    import { getLastXTempi, getStatistiche } from '@/js/controller';

    import AvgTable from './asideElements/AvgTable.vue';
    import graficoCalendario from './asideElements/grafici/graficoCalendario.vue';
    import graficoTempi from './asideElements/grafici/graficoTempi.vue';
    import tabellaTempi from './asideElements/grafici/tabellaTempi.vue';
    import SelectVisual from './../utilities/SelectVisual.vue';

    
    import { onBeforeUnmount, onMounted, ref } from 'vue'

    const selectedVisual = ref('Tabella')
    const tempi = ref(getLastXTempi())
    const statistics = ref([])

    const optionValues = ['Tabella', 'Grafico', 'Calendario']

    function updateTempi() {
        tempi.value = getLastXTempi()
    }

    function updateStats() {
        statistics.value = JSON.parse(sessionStorage.getItem('statistiche') ?? '[]')
    }

    onMounted(() => {
        getStatistiche().then(stats => {
            statistics.value = stats ?? []
        })

        window.addEventListener('solves-updated', updateTempi)
        window.addEventListener('stats-updated', updateStats)
    })

    onBeforeUnmount(() => {
        window.removeEventListener('solves-updated', updateTempi)
        window.removeEventListener('stats-updated', updateStats)
    })
</script >

<template>
    <aside>
        <AvgTable :stats="statistics" :tempi="tempi"></AvgTable>
        <SelectVisual 
            :labelText="`Seleziona il metodo di visualizzazione`"
            :optionValues="optionValues"
            :optionTexts="optionValues"
            v-model="selectedVisual"
        ></SelectVisual>
        <section>
            <graficoTempi v-if="selectedVisual == 'Grafico'" :tempi="tempi">Grafico</graficoTempi>
            <graficoCalendario v-if="selectedVisual == 'Calendario'">Calendario</graficoCalendario>
            <tabellaTempi v-if="selectedVisual == 'Tabella'" :tempi="tempi">Tabella</tabellaTempi>
        </section>
    </aside>
</template>


<style scoped>
    aside{
        width: max-content;
    }

    section{
        height: 80%;
        max-height: 80%;
        width: 100%;
        overflow-y: auto;
        overflow: overlay;

        direction: rtl;
        > * {
            direction: ltr;
        }
        scrollbar-width: auto;
        scrollbar-color: var(--vueGreen) var(--color-background-soft);
    }

    section::-webkit-scrollbar {
        width: 8px;
    }

    section::-webkit-scrollbar-track {
        background: var(--color-background-soft);
    }

    section::-webkit-scrollbar-thumb {
        background: var(--vueGreen);
        border-radius: 2px;
    }

    @media (prefers-color-scheme: dark) {
        section {
            scrollbar-color: var(--vueGreen) var(--color-background-mute);
        }

        section::-webkit-scrollbar-track {
            background: var(--color-background-mute);
        }
    }
</style>
