<script setup>

import Doughnut from '@/components/PieChart.vue'

</script>
        
<template>
    <div class="container">
        <h4 class="titre">R315 - TP02 : PieChart</h4>
        <br />
        <Doughnut class="fondBlanc" />

    </div>

</template>
        
<style scoped>
.titre {
    text-align: center;
}

.fondBlanc {
    background-color: white;
}
</style>