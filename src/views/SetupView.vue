<script setup>
    import {ref, reactive, computed, onMounted} from 'vue'

    import ListProducts from '@/components/ListProducts.vue'

    let title = ref()

    title.value = "setUp"

    const user = reactive({
        name: 'Heinis',
        firstName: 'Quentin'
    })

    const properties = defineProps({
        name: {type:String, default:'Heinis'},
        firstName: {type:String, default:'Quentin'},
        date: {type:Date, default:new Date()},
        number: {type:Number, default:78},
        preferences: {type:Object, default:()=>{}},
    })

    const now = computed(()=>{
        let d = new Date()
        let day = addZero(d.getDate())
        let month = addZero(d.getMonth())
        let year = d.getFullYear()
        let hour = addZero(d.getHours())
        let min = addZero(d.getMinutes())
        let sec = addZero(d.getSeconds())

        let d1 = [hour, min, sec].join(':')
        let d2 = [day, month, year].join('/')

        return[d2,d1].join(' à ')
    })

    const addZero = (val) =>{
        if(val >= 10) return val
        return val = '0' + val
    }

    let cp = false
    const capitalize = () =>{
        cp=!cp
        if(cp){
            title.value = title.value.toUpperCase()
        }else{
            title.value = title.value.toLowerCase()
        }
    }


    let liste = ref(null)
    onMounted(async()=>{
        const response = await fetch('https://jsonGaulois.jmfino.fr/listeVillageois.php')
        liste.value = await response.json()
    })
</script>

<template>
  <div class="container">
    <hr/>
    <h6>ref - title : {{title}}</h6>
    <h6>reactive - user : {{user.firstName}} {{user.name}}</h6>
    <hr/>
    <h6>props - properties :</h6>
    <ul>
        <li>{{properties.name}}</li>
        <li>{{properties.firstName}}</li>
        <li>{{properties.date}}</li>
        <li>{{properties.number}}</li>
        <li>{{properties.preferences}}</li>
    </ul>
    <hr/>
    <h6>zone calculée - Aujourd'hui{{now}}</h6>
    <hr/>
    <input type="text" v-model="title">
    <button type="button" @click="capitalize(title)">Capitalize (on/off)</button>
    <hr/>
    <h6>Liste des villageois</h6>
    <div v-for="v in liste" :key="v.id">
        {{v.id}} - {{v.nom}}
    </div>
    <hr/>
    <h6>Liste des villageois avec un composant</h6>
    <ListProducts/>
  </div>
</template>

<style>

hr{
    background: white;
}

</style>