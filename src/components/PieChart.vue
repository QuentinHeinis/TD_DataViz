<script setup>
import { reactive, ref, onMounted } from 'vue';

import { Doughnut } from 'vue-chartjs';

// Import des objets du graphique de la bibliothèque ChartJs
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from 'chart.js';

// Eléments utilisés par notre graphique
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale)


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
    labels: ['val1', 'val2', 'val3', 'val4'],
    // Valeurs des données du graphique
    datasets: [{
        // Valeurs des données
        data: [],
        // Couleur des barres en regard des valeurs
        backgroundColor: [],
        borderColor: [],
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
    maintainAspectRatio: false,

})

let liste = ref(null)
let lstSpecialite = []
let listNb = []
onMounted(async () => {
    await fetch('https://jsongaulois.jmfino.fr/listeVillageois.php')
        .then(response => response.json())
        .then(response => {
            liste = response
            console.table(liste)
            let setSp = new Set()
            liste.forEach(vil => {
                setSp.add(vil.laSpecialite.nom)
            })
            console.log({ setSp });
            chartData.labels = Array.from(setSp)
            chartData.labels.sort()
            let cpt = []
            chartData.labels.forEach(function (spe) {
                let nb = 0
                liste.forEach((vil) => {
                    if (spe == vil.laSpecialite.nom)
                        nb++
                })
                cpt.push(nb)
            })
            chartData.datasets[0].data = cpt

            let bgColor = []
            let bdColor = []
            cpt.forEach(function (val) {
                let c1 = couleur(0, 255)
                let c2 = couleur(0, 255)
                let c3 = couleur(0, 255)
                let tr = 0.5
                let color = 'rgba(' + [c1, c2, c3, tr].join(',') + ')'
                bgColor.push(color)
                let border = 'rgba(' + [c1, c2, c3].join(',') + ')'
                bdColor.push(border)
            })
            chartData.datasets[0].backgroundColor = bgColor
            chartData.datasets[0].borderColor = bdColor
        })
        .catch(error => console.log('erreur ajax'))

})

const couleur = (min, max) => {
    return Math.floor(Math.random() * (max - min))
}


</script>
    
<template>

    <Doughnut :chart-options="chartOptions" :chart-data="chartData" :chart-id="chartId" :dataset-id-key="datasetIdKey"
        :plugins="plugins" :css-classes="cssClasses" :styles="styles" :width="width" :height="height" />
</template>
    
<style scoped>

</style>