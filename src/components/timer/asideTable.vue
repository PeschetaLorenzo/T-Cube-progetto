<script setup>
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
            <select class="bg-dark text-light" v-model="selectedVisual">
                <option value="Tabella">Tabella</option>
                <option value="Grafico">Grafico</option>
                <option value="Calendario">Calendario</option>
            </select>
        </header>
    <section>
        <graficoTempi v-if="selectedVisual == 'Grafico'">Grafico</graficoTempi>
        <graficoCalendario v-if="selectedVisual == 'Calendario'">Calendario</graficoCalendario>
        <tabellaTempi v-if="selectedVisual == 'Tabella'">Tabella</tabellaTempi>
    </section>
    </aside>
</template>


<style>
    header{
        margin-top: 20px;
    }
    aside{
        width: max-content;
    }

    section{
        height: 100%;
        width: 100%;
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
    }

    select:focus{
        outline: none;
        outline: 1pt solid var(--vueGreen);
    }
    

    

</style>