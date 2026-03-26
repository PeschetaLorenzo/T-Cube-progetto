<script>

export default {
    props: {
        mese: [],
        
    },
    data(){
        return{
            meseCorr: 2
        }
    },
    computed:{
        
    },
    methods:{
        getMese(nMese)
        {
            let mesi = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre']

            return mesi[nMese]
        }
        
    },
    created() {
        
    },

}
</script>

<template>
    <table>
        <thead>
            <tr>
                <td><</td>
                <td>{{getMese(meseCorr)}}</td>
                <td>></td>
            </tr>

        </thead>
        <tbody>
            <tr>
                
            </tr>
        </tbody>

    </table>

</template>

<style scoped>

</style>