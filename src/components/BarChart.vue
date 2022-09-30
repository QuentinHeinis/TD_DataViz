<script setup>
import { reactive } from 'vue';

// Import d'un graphique type barChart
import { Bar } from 'vue-chartjs'

// Import des objets du graphique de la bibliothèque ChartJs
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

// Eléments utilisés par notre graphique
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)


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

// Données injectées dans le graphique
let chartData = reactive({
    // Etiquette de l'axe
    labels: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai'],
    // Valeurs des données du graphique
    datasets: [{
        // Etiquette du je de données à projeter
        label: 'données 01',
        // Valeurs des données
        data: [40, 20, 12, 14, 24],
        // Couleur des barres en regard des valeurs
        backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
        ],
        // Couleur de la bordure de chaque barre
        borderColor: [
            'rgba(255, 99, 132)',
            'rgba(255, 159, 64)',
            'rgba(255, 205, 86)',
            'rgba(75, 192, 192)',
            'rgba(54, 162, 235)',
        ],
        borderWidth: 1
    }]
})

// Options du graphique
// Les principales utilisées, ils en existe d'autres
// voir documentation
let chartOptions = reactive({
    // Aspect responsive du graphique
    responsive: true,
    // Maintien du ratio
    maintainAspectRation: false,

    // Type de projection utilisée
    // x : verticale
    // y : horizontale
    indexAxis: 'x',

    // Echelles du graphique
    scales: {
        y: {
            suggestedMax: 100,
            ticks: {
                font: {
                    size: 16
                }
            }
        },
        x: {
            ticks: {
                font: {
                    size: 16
                }
            }
        },
    },

    plugins: {
        legend: {
            labels: {
                color: 'green',
                font: {
                    size: 16
                }
            }
        },
        title: {
            display: true,
            text: "Chartjs - BarChart",
            color: 'blue',
            font: {
                size: 16
            }
        }
    }

})


</script>

<template>

    <Bar :chart-options="chartOptions" :chart-data="chartData" :chart-id="chartId" :dataset-id-key="datasetIdKey"
        :plugins="plugins" :css-classes="cssClasses" :styles="styles" :width="width" :height="height" />
</template>

<style scoped>

</style>