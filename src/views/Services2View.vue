<script setup>
import { reactive, ref, onMounted } from 'vue';

// Import d'un graphique type barChart
import { Bar } from 'vue-chartjs'

//import services ajax
import { getVillageois, getVideos, getGares } from '../composables/serviceAjax';
//import utils app
import { getLabels, countDatas } from '../composables/utilsApp';
//import commonchart
import { densite, aleatoire } from '../composables/commonChart'

// Import des objets du graphique de la bibliothèque ChartJs
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

// Eléments utilisés par notre graphique
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const propChart = defineProps({
    chartId: { type: String, default: 'bar-chart' }, // Id du graphique
    datasetIdKey: { type: String, default: 'label' }, // Id du dataSet
    width: { type: Number, default: 300 }, // Hauteur du graphe
    height: { type: Number, default: 450 }, // Largeur du graphe
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

let liste = ref()

let modeSelected = ref()
modeSelected.value = false

let baseColor = ref()
baseColor.value = 'rgba(0,0,255, #deg#)'

onMounted(async () => {
    await getVillageois()
        .then(response => {
            liste.value = response
            console.log({ liste })
            chartOptions.plugins.title.text = "Spécialités des villageois"
            chartData.labels = getLabels(liste.value, 'laSpecialite.nom#1')
            console.log('labels villageois', chartData.labels)
            chartData.datasets[0].data = countDatas(liste.value, chartData.labels, 'laSpecialite.nom#1')
            console.log('data villageois', chartData.datasets[0].data);
            chartData.datasets[0].label = "Spécialités"
            selectMod()
        })
})
const selectMod = () => {
    if (modeSelected.value) {
        let [bgColor, bdColor] = aleatoire(chartData.labels)
        chartData.datasets[0].backgroundColor = bgColor
        chartData.datasets[0].borderColor = bdColor
    } else {
        let [bgColor, bdColor] = densite(baseColor.value, chartData.datasets[0].data)
        chartData.datasets[0].backgroundColor = bgColor
        chartData.datasets[0].borderColor = bdColor
        chartData.datasets[0].borderWidth = 1
    }
}



</script>

<template>
    <div class="container">
        <h1>Services - Partie 02</h1>
        <hr>
        <form class="navbar-nav ml-auto">
            <div class="custom-control custom-switch">
                <input type="checkbox" class="custom-control-input" id="customSwitch1" v-model="modeSelected"
                    @change="selectMod">
                <label class="custom-control-label" for="customSwitch1">dégradé/aléatoire</label>
            </div>
        </form>
        <Bar :chart-options="chartOptions" :chart-data="chartData" :chart-id="chartId" :dataset-id-key="datasetIdKey"
            :plugins="plugins" :css-classes="cssClasses" :styles="styles" :width="width" :height="height"
            class="fondBlanc" />
    </div>
</template>

<style scoped>
.fondBlanc {
    background-color: white;
}
</style>