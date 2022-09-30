<script setup>
import { reactive, ref, onMounted } from 'vue';

import { Line } from 'vue-chartjs';

// Import des objets du graphique de la bibliothèque ChartJs
import { Chart as ChartJS, Title, Tooltip, Legend, PointElement, LineElement, LineController, CategoryScale, LinearScale, Filler } from 'chart.js';

// Eléments utilisés par notre graphique
ChartJS.register(Title, Tooltip, Legend, PointElement, LineElement, LineController, CategoryScale, LinearScale, Filler)


// Propriétés du graphique Utilisés dans le template (props)
// On définit pour chacune son type de données et sa valeur par défaut
// On peut utiliser une grande variété de types, voire des objets
const propChart = defineProps({
    chartId: { type: String, default: 'pie-chart' }, // Id du graphique
    datasetIdKey: { type: String, default: 'label' }, // Id du dataSet
    width: { type: Number, default: 500 }, // Hauteur du graphe
    height: { type: Number, default: 500 }, // Largeur du graphe
    cssClasses: { type: String, default: '' }, // Classes css utilisées
    styles: { type: Object, default: () => { } }, // Styles utilisés
    plugins: { type: Object, default: () => { } }  // plugins utilisés
})

// Données injectées dans le graphique
let chartData = reactive({
    // Etiquette de l'axe
    labels: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai'],
    // Valeurs des données du graphique
    datasets: [{
        label: 'Femmes',
        data: [40, 20, 12, 14, 24],
        borderColor: 'rgba(255, 0,0,0.5)',
        tension: 0.5,
        fill: true,
        pointBackgroundColor: '#888',
        pointBorderColor: '#F00',
        pointHoverBackgroundColor: '#F00',
        pointHoverBorderColor: '#F00',
        pointRadius: 4,
        pointHoverRadius: 6
    }, {
        label: 'Hommes',
        data: [40, 20, 12, 14, 24],
        borderColor: 'rgba(0, 0,255,0.5)',
        tension: 0.5,
        fill: true,
        pointBackgroundColor: '#888',
        pointBorderColor: '#00F',
        pointHoverBackgroundColor: '#00F',
        pointHoverBorderColor: '#00F',
        pointRadius: 4,
        pointHoverRadius: 6
    }, {
        label: 'tous',
        data: [80, 40, 24, 28, 48],
        borderColor: 'rgba(0, 0,0,0.5)',
        tension: 0.5,
        fill: true,
        pointBackgroundColor: '#888',
        pointBorderColor: '#000',
        pointHoverBackgroundColor: '#000',
        pointHoverBorderColor: '#000',
        pointRadius: 4,
        pointHoverRadius: 6
    }]
})

// Options du graphique
// Les principales utilisées, ils en existe d'autres
// voir documentation
let chartOptions = reactive({
    // Aspect responsive du graphique
    responsive: true,
    // Maintien du ratio
    plugins: {
        title: {
            display: true,
            text: 'Université BFC - inscriptions : ',
            font: { size: 16 }
        },

    },
    maintainAspectRatio: false,

})

let liste = ref()
onMounted(async () => {
    let request = "https://data.enseignementsup-recherche.gouv.fr/api/records/1.0/search/"
        + "?dataset=fr-esr-statistiques-sur-les-effectifs-d-etudiants-inscrits-par-etablissement"
        + "&q=&rows=100"
        + "&sort=-annee_universitaire"
        + "&refine.etablissement_type=Université"
        + "&refine.etablissement_region=Bourgogne-Franche-Comté";
    await fetch(request)
        .then(response => response.json())
        .then(response => {
            liste.value = new Array(response)
            console.table(liste.value)
            chartOptions.plugins.title.text += liste.value[0].nhits + "réponses"
            let setlabels = new Set()
            liste.value[0].records.forEach((el) => {
                setlabels.add(el.fields.annee_universitaire)
            })
            chartData.labels = Array.from(setlabels)
            chartData.labels.sort()

            let cptf = []
            let cptm = []
            let cptall = []
            chartData.labels.forEach((label) => {
                let nbf = 0
                let nbm = 0
                let nball = 0
                liste.value[0].records.forEach((el) => {
                    if (label == el.fields.annee_universitaire) {
                        nbf += el.fields.sexef
                        nbm += el.fields.sexem
                        nball += el.fields.sexef + el.fields.sexem
                    }
                })
                cptf.push(nbf)
                cptm.push(nbm)
                cptall.push(nball)
            })
            chartData.datasets[0].data = cptf
            chartData.datasets[1].data = cptm
            chartData.datasets[2].data = cptall
        })
        .catch(error => console.log('erreur ajax'))

})

const couleur = (min, max) => {
    return Math.floor(Math.random() * (max - min))
}


</script>
    
<template>

    <Line :chart-options="chartOptions" :chart-data="chartData" :chart-id="chartId" :dataset-id-key="datasetIdKey"
        :plugins="plugins" :css-classes="cssClasses" :styles="styles" :width="width" :height="height" />
</template>
    
<style scoped>

</style>