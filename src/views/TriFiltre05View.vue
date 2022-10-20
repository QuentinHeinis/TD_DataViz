<script setup>

import { ref, reactive, onMounted } from 'vue'
import { getVideos } from '@/composables/serviceAjax.js'
import { linearData, filterColumn } from '@/composables/utilsTable.js'
import TableMdl from '@/components/TableMdl.vue'


let items = ref()
let itemsSvg = ref()

let fields = ref()

fields.value = [
    { key: 'id', label: 'id', type: "number", sortable: true, sort: 1, filter: "" },
    { key: 'titre', label: 'titre', type: "string", sortable: true, sort: 1, filter: "" },
    { key: 'lesPays.nom', label: 'Pays', type: "string", sortable: true, sort: 1, filter: "" },
    { key: 'lesCategories.lib', label: 'Catégories', type: "string", sortable: true, sort: 1, filter: "" },
    { key: 'lesActeurs.nom', label: 'Acteurs', type: "string", sortable: true, sort: 1, filter: "" },
]
let title = ref("Tris et Filtrages")
let color = ref("color:red;")

onMounted(async () => {
    await getVideos()
        .then(response => {
            items.value = response
            items.value = linearData(fields.value, items.value)
            // console.log("items", items)
            itemsSvg.value = items.value
        })
        .catch(error => console.log({ error }))
})
const tableFilter = (field) => {
    items.value = filterColumn(field, itemsSvg.value)
}


</script>

<template>
    <div class="container-fluid">
        <TableMdl :title="title" :fields="fields" :items="items" :itemsSvg="itemsSvg" :color="color"
            @tableFilter="tableFilter" />
    </div>
</template>