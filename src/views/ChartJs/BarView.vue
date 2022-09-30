<script setup>
// Import des éléments de vue
import { ref, onMounted } from 'vue';

import BarChart from '@/components/BarChart.vue'

</script>
    
<template>
    <div class="container">
        <h4 class="titre">R315 - TP01 : BarChart</h4>
        <br />
        <BarChart class="fondBlanc" />

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