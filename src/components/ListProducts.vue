<script setup>
import { ref, onMounted } from "vue"

    let liste = ref(null)
    onMounted(async()=>{
        const response = await fetch('https://jsonGaulois.jmfino.fr/listeVillageois.php')
        liste.value = await response.json()
    })
</script>

<template>
    <h6>Composant - ListProducts.vue</h6>
    <div v-for="v in liste" :key="v.id">
        {{v.id}} - {{v.nom}}
    </div>
</template>