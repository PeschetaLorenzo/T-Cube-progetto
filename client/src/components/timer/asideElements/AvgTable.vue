<script setup>

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
            <tr>
                <th>Single</th>
                <td>{{19.244}}</td>
                <td class="text-success">{{11.731}}</td>
            </tr>
            <tr>
                <th>AVG of 3</th>
                <td>{{1}}</td>
                <td class="text-success">{{0.1}}</td>
            </tr>
            <tr>
                <th>AVG of 5</th>
                <td>{{1}}</td>
                <td class="text-success">{{40.143}}</td>
            </tr>
            <tr>
                <th>AVG of 12</th>
                <td>{{1}}</td>
                <td class="text-success">{{0.1}}</td>
            </tr>
            <tr>
                <th>AVG of 100</th>
                <td>{{1}}</td>
                <td class="text-success">{{0.1}}</td>
            </tr>
             <tr>
                <th>AVG of 1000 </th>
                <td>{{1}}</td>
                <td class="text-success">{{0.1}}</td>
            </tr>
            <tr>
                <th>AVG of All ({{12344}})</th>
                <td>{{1}}</td>
                <td class="text-success">{{0.1}}</td>
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