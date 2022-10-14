<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getVillageois, getVideos, getGares } from '@/composables/serviceAjax.js'

let items = ref()

let itemsAll = ref()

let fields = ref()

fields.value = [
    { key: 'id', label: 'id', type: "number", sortable: true, sort: 1, filter: "" },
    { key: 'nom', label: 'nom', type: "string", sortable: true, sort: 1, filter: "" },
    { key: 'adresse', label: 'adresse', type: "string", sortable: true, sort: 1, filter: "" },
    { key: 'laSpecialite.nom', label: 'Spécialité', type: "string", sortable: true, sort: 1, filter: "" },
    { key: 'leLieuHabitat.nom', label: 'Habitat', type: "string", sortable: true, sort: 1, filter: "" },
]

// let nomKeyword = ref('')
// let spKeyword = ref('')
// let habitatKeyword = ref('')

onMounted(async () => {
    await getVillageois()
        .then(response => {
            items.value = response
            // console.log(items.value)
            fields.value.forEach((field) => {
                let t = field.key.split('.')
                let lg = t.length
                items.value.forEach((item) => {
                    if (lg == 2) { item[field.key] = item[t[0]][t[1]] }
                    if (lg == 3) { item[field.key] = item[t[0]][t[1]][t[2]] }
                    if (lg == 4) { item[field.key] = item[t[0]][t[1]][t[2]][t[3]] }
                })
            })
            itemsAll.value = items.value
        })
        .catch(error => console.log({ error }))
})

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

const nomFilter = () => {
    items.value = itemsAll.value.filter((villageois) => {
        return villageois.nom.toLowerCase().includes(nomKeyword.value.toLowerCase())
    })
}
const spFilter = () => {
    items.value = itemsAll.value.filter((villageois) => {
        return villageois.laSpecialite.nom.toLowerCase().includes(spKeyword.value.toLowerCase())
    })
}
const habitatFilter = () => {
    items.value = itemsAll.value.filter((villageois) => {
        return villageois.leLieuHabitat.nom.toLowerCase().includes(habitatKeyword.value.toLowerCase())
    })
}

const tableFilter = (field) => {
    items.value = itemsAll.value.filter((villageois) => {
        return villageois[field.key].toLowerCase().includes(field.filter.toLowerCase())
    })
}

</script>

<template>
    <div class="container">
        <h1>Tris et Filtres : Villageois</h1>
        <table class="table table-bordered table-striped fondBlanc">
            <thead>
                <tr>
                    <th v-for="field in fields" :key="field">
                        <div class="input-group-text w-100 mb-2">
                            <span class="col-10">{{field.label}}</span>
                            <span class="col-2">
                                <i v-if="field.sortable" class="fa fa-sort fa-sm float-right"
                                    @click="sortCol(items, field)"></i>
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
                <tr v-for="item in items" :key="item">
                    <td v-for="field in fields" :key="field">
                        {{item[field.key]}}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style scoped>
.fondBlanc {
    background-color: white;
}
</style>