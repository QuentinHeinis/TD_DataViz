<script setup>
import { reactive, ref, onMounted, toRef } from 'vue';

import { getVillageois, getVideos, getGares } from '../../composables/serviceAjax.js'
import { getLabels, countDatas } from '../../composables/utilsApp.js'
import { aleatoire, densite } from '../../composables/commonChart.js'

// Import d'un graphique type barChart
import { PolarArea } from 'vue-chartjs'

// Import des objets du graphique de la bibliothèque ChartJs
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, RadialLinearScale } from 'chart.js'

// Eléments utilisés par notre graphique
ChartJS.register(Title, Tooltip, Legend, ArcElement, RadialLinearScale)


// Propriétés du graphique Utilisés dans le template (props)
// On définit pour chacune son type de données et sa valeur par défaut
// On peut utiliser une grande variété de types, voire des objets
const propChart = defineProps({
    chartId: { type: String, default: 'bar-chart' }, // Id du graphique
    datasetIdKey: { type: String, default: 'label' }, // Id du dataSet
    width: { type: Number, default: 300 }, // Hauteur du graphe
    height: { type: Number, default: 300 }, // Largeur du graphe
    cssClasses: { type: String, default: '' }, // Classes css utilisées
    styles: { type: Object, default: () => { } }, // Styles utilisés
    plugins: { type: Object, default: () => { } }  // plugins utilisés
})

let chartData = reactive({
    labels: [],
    datasets: [{}]
})
const chartOptions = reactive({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {

        title: {
            text: null,
            display: true
        }
    }
})

let listeVillageois = ref()
let listeVideos = ref()
let listeGares = ref()

let modeSelected = ref()
modeSelected.value = false

let baseColor = ref()


const selectMode = () => {
    let bgColor = null
    let bdColor = null

    if (modeSelected.value) {
        [bgColor, bdColor] = aleatoire(chartData.labels)
    } else {
        [bgColor, bdColor] = densite(baseColor.value, chartData.datasets[0].data)
    }
    chartData.datasets[0].backgroundColor = bgColor
    chartData.datasets[0].borderColor = bdColor
    chartData.datasets[0].borderWidth = 1
}

const selectVillageois = async () => {
    await getVillageois()
        .then(response => {
            listeVillageois.value = response
            chartOptions.plugins.title.text = "Spécialités des villageois"
            chartData.labels = getLabels(listeVillageois.value, 'laSpecialite.nom#1')
            chartData.datasets[0].data = countDatas(listeVillageois.value, chartData.labels, 'laSpecialite.nom#1')
            baseColor.value = 'rgba(0,0,255,#deg#)'
            selectMode()
        })
}
const selectGares = async () => {
    await getGares('Doubs')
        .then(response => {
            listeGares.value = response.records
            chartOptions.plugins.title.text = "Lignes des gares"
            chartData.labels = getLabels(listeGares.value, 'fields.code_ligne#1')
            chartData.datasets[0].data = countDatas(listeGares.value, chartData.labels, 'fields.code_ligne#1')
            baseColor.value = 'rgba(0,255,0,#deg#)'
            console.log("baseColor :", baseColor)
            selectMode()
        })
}
const selectVideos = async () => {
    await getVideos()
        .then(response => {
            listeVideos.value = response
            chartOptions.plugins.title.text = "Catégories des Videos"
            chartData.labels = getLabels(listeVideos.value, 'lesCategories.lib#multi')
            chartData.datasets[0].data = countDatas(listeVideos.value, chartData.labels, 'lesCategories.lib#multi')
            baseColor.value = 'rgba(255,0,0,#deg#)'
            selectMode()
        })
}

onMounted(async () => {
    await selectVillageois()
})

</script>

<template>
    <div class="container">
        <h1>Graphique PolarArea</h1>
        <br />
        <nav class="navbar navbar-expand navbar-dark bg-dark">
            <a href="#" class="navbar-brand">Selection :</a>
            <ul class="navbar-nav">
                <li class="nav-item">
                    <a href="#" class="nav-link" @click="selectVillageois">Villageois</a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link" @click="selectVideos">Videos</a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link" @click="selectGares">Gares</a>
                </li>
            </ul>
            <form class="navbar-nav ml-auto">
                <div class="custom-control custom-switch">
                    <input type="checkbox" class="custom-control-input" id="customSwitch1" v-model="modeSelected"
                        @change="selectColor">
                    <label class="custom-control-label" for="customSwitch1">
                        dégradé/aléatoire
                    </label>
                </div>
            </form>
        </nav>
        <PolarArea class="fondBlanc" :chart-options="chartOptions" :chart-data="chartData" :chart-id="chartId"
            :dataset-id-key="datasetIdKey" :plugins="plugins" :css-classes="cssClasses" :styles="styles" :width="width"
            :height="height" />
    </div>
</template>

<style>
.titre {
    text-align: center;
}

.fondBlanc {
    background-color: white;
}

.custom-control-label {
    color: #8a9da0;
}
</style>