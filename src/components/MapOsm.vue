<script setup>
import { onMounted, ref, reactive } from 'vue';
import * as Leaflet from 'leaflet'
import 'leaflet/dist/leaflet.css'

let tileLayer = Leaflet.tileLayer
let map = ref()

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

    let myIcon = Leaflet.icon({
        iconUrl: 'images/leaflet/marker-icon.png',
        shadowUrl: 'images/leaflet/marker-shadow.png',
        iconSize: [25, 41],
        shadowSize: [25, 41],
        iconAnchor: [0, 0],
        shadowAnchor: [-10, -10],
        popupAnchor: [0, 0]
    })

    let marker = Leaflet.marker([47.495328, 6.8044455], { icon: myIcon }).addTo(map)

    marker.bindPopup("je suis un marker")

    setTimeout(() => {
        map.panTo([47.50133850064826, 6.807621746718467])
    }, 5000);

    let marker2 = Leaflet.marker(
        [47.50133850064826, 6.807621746718467],
        { icon: myIcon }
    ).addTo(map)

    marker2.bindPopup("je suis la gendarmerie nationale")
})

const coordMe = reactive({ latitude: 0, longitude: 0 })

const locMe = () => {
    let watcher = navigator.geolocation.watchPosition(showLocation)
}

const showLocation = (position) => {
    coordMe.latitude = position.coords.latitude
    coordMe.longitude = position.coords.longitude

    map.panTo([coordMe.latitude, coordMe.longitude])

    let markerMe = Leaflet.marker([coordMe.latitude, coordMe.longitude]).addTo(map)
    markerMe.bindPopup("je suis la")
}


</script>

<template>
    <div>
        <button type="button" @click="locMe()">Se localiser</button>
        <span v-if="coordMe">
            coordonnées:{{coordMe.latitude}} - {{coordMe.longitude}}
        </span>
        <span v-else>
            Pas de coordonnées
        </span>
        <div class="container">
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