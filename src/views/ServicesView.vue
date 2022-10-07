<script setup>
import { ref, reactive, onMounted } from 'vue';
import { getVillageois, getVideos, getGares } from '../composables/serviceAjax';
import { getLabels, countDatas } from '@/composables/utilsApp'

let listeVillageois = ref()
let listeVideos = ref()
let listeGares = ref()

let lstLabelsVillageois = ref()
let lstLabelsVideos = ref()
let lstLabelsGares = ref()

let lstDataVillageois = ref()
let lstDataVideos = ref()
let lstDataGares = ref()

onMounted(async () => {
    await getVillageois()
        .then(response => {
            listeVillageois.value = response
            lstLabelsVillageois.value = getLabels(listeVillageois.value, 'laSpecialite.nom#1')
            // console.log({ lstLabelsVillageois })
            lstDataVillageois.value = countDatas(listeVillageois.value, lstLabelsVillageois.value, 'laSpecialite.nom#1')
        })
    await getVideos()
        .then(response => {
            listeVideos.value = response
            lstLabelsVideos.value = getLabels(listeVideos.value, 'lesCategories.lib#multi')
            // console.log({ lstLabelsVideos })
            lstDataVideos.value = countDatas(listeVideos.value, lstLabelsVideos.value, 'lesCategories.lib#multi')
            console.log({ lstDataVideos })

        })
    await getGares('Doubs')
        .then(response => {
            listeGares.value = response.records
            lstLabelsGares.value = getLabels(listeGares.value, 'fields.commune#1')
            // console.log({ lstLabelsGares })
            lstDataGares.value = countDatas(listeGares.value, lstLabelsGares.value, 'fields.commune#1')

        })
})
</script>
<template>
    <div class="container">
        <h1>Services - Partie 01</h1>
        <div class="row">
            <div class="col-6">
                <pre>{{lstLabelsVillageois}}</pre>
            </div>
            <div class="col-6">
                <pre>{{lstDataVillageois}}</pre>
            </div>
        </div>
        <hr>
        <div class="row">
            <div class="col-6">
                <pre>{{lstLabelsVideos}}</pre>
            </div>
            <div class="col-6">
                <pre>{{lstDataVideos}}</pre>
            </div>
        </div>
        <hr>
        <div class="row">
            <div class="col-6">
                <pre>{{lstLabelsGares}}</pre>
            </div>
            <div class="col-6">
                <pre>{{lstDataGares}}</pre>
            </div>
        </div>
        <hr>
    </div>
</template>

<style scoped>
pre {
    color: white;
}
</style>