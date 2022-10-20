<script setup>
import { ref, reactive, onMounted } from "vue";
import { Bar } from "vue-chartjs";
import { getVillageois, getVideos, getGares } from "@/composables/serviceAjax";
import { getLabels, countDatas } from "@/composables/utilsApp";
import { densite, aleatoire } from '../composables/commonChart.js'
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
} from "chart.js";
ChartJS.register(
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
);

const propChart = defineProps({
    chartId: { type: String, default: "bar-chart" }, //Id du graphique
    datasetIdKey: { type: String, default: "label" }, //Id du dataset
    width: { type: Number, default: 350 }, //largeur du graph
    height: { type: Number, default: 400 }, //Hauteur du graph
    cssClasses: { type: String, default: "" }, //class css use
    styles: { type: Object, default: () => { } }, //class css use
    plugins: { type: Object, default: () => { } }, // plugin use
});

let chartData = reactive({
    // etiquete de l'axe
    labels: [],
    // valeur des donnée du graphique
    datasets: [
        {},
    ],
});
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

let items = ref()

let modeSelected = ref()
modeSelected.value = false
let baseColor = ref()
baseColor.value = 'rgba(0,0,255,#deg#)'
let fields = ref()
fields.value = [
    { key: 'id', label: "id", type: "number", sortable: true, sort: 1, filter: "" },
    { key: 'nom', label: "Nom", type: "string", sortable: true, sort: 1, filter: "" },
    { key: 'adresse', label: "Adresse", type: "string", sortable: true, sort: 1, filter: "" },
    { key: 'laSpecialite.nom', label: "Spécialité", type: "string", sortable: true, sort: 1, filter: "" },
    { key: 'leLieuHabitat.nom', label: "Habitat", type: "string", sortable: true, sort: 1, filter: "" },
]
let itemsAll = ref()

onMounted(async () => {
    await getVillageois()
        .then(response => {
            items.value = response
            console.log("items villageois", chartData.labels)

            fields.value.forEach((field) => {
                let t = field.key.split(".")
                let lg = t.length
                items.value.forEach((item) => {
                    if (lg == 2) {
                        item[field.key] = item[t[0]][t[1]]
                    }
                    if (lg == 3) {
                        item[field.key] = item[t[0]][t[1]][t[2]]
                    }
                })
            })
            console.log("items 2", items)
            itemsAll.value = items.value

            updateGraph()
        });
})

const updateGraph = () => {
    //
    chartOptions.plugins.title.text = "Spécialités des villageois"
    //
    chartData.labels = getLabels(items.value, 'laSpecialite.nom#1')
    console.log("labels villageois", chartData.labels)
    //
    chartData.datasets[0].data = countDatas(items.value, chartData.labels, 'laSpecialite.nom#1')
    console.log("data villageois", chartData.datasets[0].data)
    //
    chartData.datasets[0].label = "Spécialités"
    // 
    selectMode()
    // let [bgColor, bdColor] = densite('rgba(0,0,255,#deg#)', chartData.datasets[0].data)
    // // let bgColor = densite('rgba(0,0,255,#deg#)', chartData.datasets[0].data)
    // // 
    // chartData.datasets[0].backgroundColor = bgColor
    // //
    // // let bdColor = densite('rgba(0,0,255,1)', chartData.datasets[0].data)
    // chartData.datasets[0].borderColor = bdColor
    // //
    // chartData.datasets[0].borderWidth = 1
}

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

const sortCol = (items, field) => {
    const compareString = (a, b) => {
        return a[field.key].toLowerCase() > b[field.key].toLowerCase() ? 1 * field.sort : -1 * field.sort
    }
    const compareNumber = (a, b) => {
        return parseFloat(a[field.key]) > parseFloat(b[field.key]) ? 1 * field.sort : -1 * field.sort
    }

    if (field.type == 'number') { items = items.sort(compareNumber) }
    else { items = items.sort(compareString) }
    field.sort = field.sort * -1
}

const tableFilter = (field) => {
    items.value = itemsAll.value.filter((villageois) => {
        return villageois[field.key].toLowerCase().includes(field.filter.toLowerCase())
    })
    updateGraph()
}




</script>
<template>
    <div class="fondblanc">
        <h1>Service - Partie 02</h1>
        <hr>
        <div class="row">
            <div class="col-5">
                <form class="navbar-nav ml-auto">
                    <div class="custom-control custom-switch">
                        <input type="checkbox" class="custom-control-input" id="customSwitch1" v-model="modeSelected"
                            @change="selectMode">
                        <label class="custom-control-label" for="customSwitch1"></label>
                    </div>
                </form>
                <Bar :chart-options="chartOptions" :chart-data="chartData" :chart-id="chartId"
                    :dataset-id-key="datasetIdKey" :plugins="plugins" :css-classes="cssClasses" :styles="styles"
                    :width="width" :height="height" />
            </div>
            <div class="col-7">
                <table class="table table-bordered table-striped table-responsive-lg">
                    <thead>
                        <tr>
                            <th v-for="field in fields" :key='field'>
                                <div class="input-group-text w-100 mb-2">
                                    <span class="col-10">
                                        {{field.label}}
                                    </span>
                                    <span class="col-2">
                                        <i v-if="field.sortable" class="fa fa-sort float-right"
                                            @click="sortCol(items, field)">
                                        </i>
                                    </span>
                                </div>
                                <div class="input-group">
                                    <span class="input-group-text">
                                        <i class="fa fa-filter fa-sm"></i>
                                    </span>
                                    <input class="form-control" @input="tableFilter(field)" v-model="field.filter">
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in items" :key='item'>
                            <td v-for="field in fields" :key='field'>
                                {{item[field.key]}}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

    </div>
</template>
<style scoped>
.fondblanc {
    background-color: white;
}
</style>
<style scoped>
.fondBlanc {
    background-color: white;
}
</style>