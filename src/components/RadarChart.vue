<script setup>
import { reactive, ref, onMounted } from 'vue';

import { Radar } from 'vue-chartjs';

// Import des objets du graphique de la bibliothèque ChartJs
import { Chart as ChartJS, Title, Tooltip, Legend, PointElement, RadialLinearScale, LineElement, Filler } from 'chart.js';

// Eléments utilisés par notre graphique
ChartJS.register(Title, Tooltip, Legend, PointElement, LineElement, RadialLinearScale, Filler)


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
    labels: ['Vanvier', 'Février', 'Mars', 'Avril', 'Mai'],
    // Valeurs des données du graphique
    datasets: [
        {
            label: 'Femmes',
            data: [40, 20, 12, 14, 24],
            borderColor: 'rgba(255,0,0,0.5)',
            fill: true,
        },
        {
            label: 'Hommes',
            data: [40, 20, 12, 14, 24],
            borderColor: 'rgba(0,0,255,0.5)',
            fill: true,
        }
    ]
})

// Options du graphique
// Les principales utilisées, ils en existe d'autres
// voir documentation
let chartOptions = reactive({
    // Aspect responsive du graphique
    responsive: true,
    // Maintien du ratio
    maintainAspectRatio: false,
    scales: {
        r: {
            angleLines: {
                display: true
            },
            suggestedMin: 0,
            suggestedMax: 100
        }
    },
    plugins: {
        title: {
            display: true,
            text: 'accidents vélos',
            font: {
                size: 16
            }
        }
    }
})

let theme = [
    { id: 1, lib: 'par mois' },
    { id: 2, lib: 'par année' },
    { id: 3, lib: 'par age' },
]

let themeSelect = ref()
themeSelect.value = 1

let total = ref()
total.value = 0

let liste = ref([])
liste.value = 0
let loading = ref()
loading.value = false

onMounted(async () => {
    // loading.value = false
    let request = "https://accidentvelo.jmfino.fr/json.php"
    await fetch(request)
        // réponse demandée en json
        .then(response => response.json())
        // récupération de la réponse
        .then(response => {
            liste.value = response
            console.log("liste", liste)
            console.log("nb ligne", liste.value.length)

            // Arret animation d'attente
            loading.value = true

            /*
            Le 1er record contient la définition des colonnes
            à partie du 2eme les données
            chaque mouvement est un accident
            récupération des thèmes - position
            1 date
            23 sexe
            24 age
            37 mois
            recherche annee min et max pour le titre */

            let anneeMax = 0
            let anneeMin = 9999
            liste.value.forEach((el) => {
                let dt = el[1].split("-")
                if (dt[0] < anneeMin) {
                    anneeMin = dt[0]
                }
                if (dt[0] > anneeMax) {
                    anneeMax = dt[0]
                }
            })
            chartOptions.plugins.title.text = chartOptions.plugins.title.text + " de " + anneeMin + " à " + anneeMax

            // par défaut par mois
            byMonth()
            // selection forcé à 1
            themeSelect = 1
        })
        .catch(error => console.log("erreur Ajax", error))
})

const selection = (theme) => {
    switch (theme) {
        case 1:
            byMonth()
            break
        case 2:
            byYear()
            break
        case 3:
            byAge()
            break
    }
}

const byMonth = () => {
    let setMois = new Set()
    let firstLine = true
    liste.value.forEach((el) => {
        if (!firstLine) { setMois.add(el[37]) }
        firstLine = false
    })
    chartData.labels = Array.from(setMois)
    let cptF = []
    let cptH = []
    total.value = 0
    firstLine = true
    chartData.labels.forEach((mois) => {
        let nbF = 0
        let nbH = 0
        liste.value.forEach((el) => {
            if (!firstLine) {
                if (mois == el[37]) {
                    if (el[23] == 'F') { nbF++ }
                    if (el[23] == 'M') { nbH++ }
                }
            }
        })
        total.value += nbF + nbH
        cptF.push(nbF)
        cptH.push(nbH)
        firstLine = false
    })
    chartData.datasets[0].data = cptF
    chartData.datasets[1].data = cptH
}

const byYear = () => {
    let setAnnee = new Set()
    let firstLine = true
    liste.value.forEach((el) => {
        if (!firstLine) {
            let dt = el[1].split('-')
            setAnnee.add(dt[0])
        }
        firstLine = false
    })
    chartData.labels = Array.from(setAnnee)
    chartData.labels.sort()
    let cptF = []
    let cptH = []
    total.value = 0
    firstLine = true
    chartData.labels.forEach((an) => {
        let nbF = 0
        let nbH = 0
        liste.value.forEach((el) => {
            if (!firstLine) {
                let dt = el[1].split('-')
                if (an == dt[0]) {
                    if (el[23] == 'F') { nbF++ }
                    if (el[23] == 'M') { nbH++ }
                }
            }
        })
        total.value += nbF + nbH
        cptF.push(nbF)
        cptH.push(nbH)
        firstLine = false
    })
    chartData.datasets[0].data = cptF
    chartData.datasets[1].data = cptH
}
const byAge = () => {
    let setAge = new Set()
    let firstLine = true
    let valOut = ['2004-2005', '2005-2006', '2006-2007', '2010-2011', '2012-2013', '2016-2017']
    liste.value.forEach((el) => {
        if (!firstLine) {
            if (valOut.indexOf(el[24]) < 0) {
                let test = el[24].split('-')
                if (test[0] < 10) [test[0] = "0" + test[0]]
                if (test[1] < 10) [test[1] = "0" + test[1]]
                let tr = [test[0], test[1]].join('-')
                if (test[0] < 80 && test[0] > 9) {
                    setAge.add(tr)
                }
            }
        }
        firstLine = false
    })
    chartData.labels = Array.from(setAge)
    chartData.labels.sort()
    let cptF = []
    let cptH = []
    firstLine = true
    total.value = 0
    chartData.labels.forEach((age) => {
        let nbH = 0
        let nbF = 0
        liste.value.forEach((el) => {
            if (!firstLine) {
                if (age == el[24]) {
                    if (el[23] == 'F') { nbF++ }
                    if (el[23] == 'M') { nbH++ }
                }
            }
        })
        total.value += nbF + nbH
        cptF.push(nbF)
        cptH.push(nbH)
        firstLine = false
    })
    chartData.datasets[0].data = cptF
    chartData.datasets[1].data = cptH

}

</script>
        
<template>
    <div class="container-fluid">
        <form>
            <div class="form-row">
                <div class="col-7">
                    <select class="form-control" v-model="themeSelect" @change="selection(themeSelect)">
                        <option v-for="th in theme" :key="th.id" :value="th.id">
                            {{th.id}} - {{th.lib}}
                        </option>
                    </select>
                </div>
                <div class="col-2">
                    <input type="text" class="form-control" value="total" readonly>
                </div>
                <div class="col-3">
                    <input type="text" class="form-control" :value="total" readonly>
                </div>
            </div>
        </form>
        <div v-if="loading">
            <Radar :chart-options="chartOptions" :chart-data="chartData" :chart-id="chartId"
                :dataset-id-key="datasetIdKey" :plugins="plugins" :css-classes="cssClasses" :styles="styles"
                :width="width" :height="height" />
        </div>
        <div v-else>
            <img src="/images/loading-23.gif" alt="loading" class="img-fluid">
        </div>
    </div>
</template>
        
<style scoped>

</style>