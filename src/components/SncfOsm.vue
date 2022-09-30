<script setup>
import { onMounted, ref, reactive } from 'vue';
import * as Leaflet from 'leaflet'
import 'leaflet/dist/leaflet.css'

let tileLayer = Leaflet.tileLayer
let map = ref()
let listeDep = ref()
let depSelect = ref()
let listeGares = ref()
onMounted(async () => {
    tileLayer = Leaflet.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png',
        {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        })

    map = Leaflet.map('map', {
        zoomControl: true,
        layers: [tileLayer],
        maxZoom: 18,
        minZoom: 6
    })
        .setView([47.495328, 6.8044455], 17)

    await fetch('https://geo.api.gouv.fr/departements')
        .then(response => response.json())
        .then(response => {
            listeDep.value = response
            console.log("response", listeDep)
            depSelect.value = "0"
        })
        .catch(error => console.log("erreur ajax", error))
})
const selection = async (dep) => {
    console.log('departement selectionné', dep)
    let request = 'https://ressources.data.sncf.com/api/records/1.0/search/'
        + '?dataset=liste-des-gares'
        + '&q=departemen=' + dep
        + '&rows=100'
        + '&lang=FR&facet=voyageurs';
    console.log({ request })
    await fetch(request)
        .then(response => response.json())
        .then(response => {
            listeGares.value = response.records
            console.log(listeGares)
            let markers = Leaflet.featureGroup()
            let myIcon = Leaflet.icon({
                iconUrl: 'images/leaflet/marker-icon.png',
                shadowUrl: 'images/leaflet/marker-shadow.png',
                iconSize: [25, 41],
                shadowSize: [25, 41],
                shadowAnchor: [-10, -10],
                popupAnchor: [0, 0]
            })
            listeGares.value.forEach((gare) => {
                let position = gare.geometry.coordinates
                let libelle = gare.fields.commune
                let marker = Leaflet.marker([position[1], position[0]], { icon: myIcon })
                marker.bindPopup(libelle)
                markers.addLayer(marker)
            })
            map.addLayer(markers)
            map.fitBounds(markers.getBounds())
        })
        .catch(error => console.log('erreur ajax', error))
}


</script>

<template>
    <div>
        <div class="container">
            <select class="custom-select" v-model="depSelect" @change="selection(depSelect)">
                <option disabled value="0">Sélectionner un departement</option>
                <option v-for="dep in listeDep" :key="dep.code" :value="dep.nom">{{dep.code}} - {{dep.nom}}</option>
            </select>
            <div id="map">
            </div>
        </div>
    </div>

</template>

<style scoped>
#map {
    width: 100%;
    height: 70vh;
}
</style>