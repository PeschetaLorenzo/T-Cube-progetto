<script setup>
    import { getLastXTempi, getMonthData } from '@/js/controller';

    import AvgTable from './asideElements/AvgTable.vue';
    import graficoCalendario from './asideElements/grafici/graficoCalendario.vue';
    import graficoTempi from './asideElements/grafici/graficoTempi.vue';
    import tabellaTempi from './asideElements/grafici/tabellaTempi.vue';

    
    import { ref } from 'vue'

    const selectedVisual = ref('Tabella')
</script >

<template>
    <aside>
        <AvgTable></AvgTable>
        <header>
            Seleziona il metodo di visualizzazione
            <select class="" v-model="selectedVisual">
                <option value="Tabella">Tabella</option>
                <option value="Grafico">Grafico</option>
                <option value="Calendario">Calendario</option>
            </select>
        </header>
    <section>
        <graficoTempi v-if="selectedVisual == 'Grafico'">Grafico</graficoTempi>
        <graficoCalendario v-if="selectedVisual == 'Calendario'" :mese="getMonthData(2, 2026)">Calendario</graficoCalendario>
        <tabellaTempi v-if="selectedVisual == 'Tabella'" :tempi="getLastXTempi(5000)">Tabella</tabellaTempi>
    </section>
    </aside>
</template>


<style scoped>
    header{
        margin-top: 20px;
    }
    aside{
        width: max-content;
    }

    section{
        height: 410px;
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

    select{
        border: none;
        border-bottom: 1pt solid var(--vueGreen);
        width: 100%;
        border-radius: 5%;
        height: 30px;
        margin-top: 3px;
        font-size: 15pt;
        text-align: center;
        font-weight: bold;
        color: var(--color-text);
        background-color: var(--color-background-mute);
    }

    @media (prefers-color-scheme: dark) {
        section {
            scrollbar-color: var(--vueGreen) var(--color-background-mute);
        }

        section::-webkit-scrollbar-track {
            background: var(--color-background-mute);
        }
    }

    select:focus{
        outline: none;
        outline: 1pt solid var(--vueGreen);
        -moz-outline-radius: 50%;
        
    }

    

    

</style>