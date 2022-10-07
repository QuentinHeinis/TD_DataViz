<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
    <div class="container-fluid">

        <nav class="navbar navbar-expand-lg navbar-dark justify-content-between">
            <RouterLink class="navbar-brand" to="/">VueJs-ChartJs</RouterLink>

            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarNav">

                <ul class="navbar-nav">
                    <li class="nav-item">
                        <RouterLink class="nav-link" to="/setup">Setup</RouterLink>
                    </li>
                    <li class="nav-item">
                        <RouterLink class="nav-link" to="/Firebase">Firebase</RouterLink>
                    </li>
                    <li class="nav-item">
                        <RouterLink class="nav-link" to="/Services">Services 01</RouterLink>
                    </li>
                    <li class="nav-item">
                        <RouterLink class="nav-link" to="/Services2">Services 02</RouterLink>
                    </li>
                    <li class="nav-item">
                        <RouterLink class="nav-link" to="/Map">Map</RouterLink>
                    </li>
                    <li class="nav-item">
                        <RouterLink class="nav-link" to="/Sncf">Sncf</RouterLink>
                    </li>

                    <li class="nav-item dropdown mr-0">
                        <a class="nav-link dropdown-toggle" href="#" id="dropdown01" role="button"
                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            ChartJs
                        </a>
                        <div class="dropdown-menu" aria-labelledby="dropdown01">

                            <RouterLink class="dropdown-item" to="/Bar">Barchart</RouterLink>
                            <RouterLink class="dropdown-item" to="/Line">LineChart</RouterLink>
                            <RouterLink class="dropdown-item" to="/Bubble">BubbleChart</RouterLink>
                            <RouterLink class="dropdown-item" to="/Pie">Pie</RouterLink>
                            <RouterLink class="dropdown-item" to="/Area">Area</RouterLink>
                            <RouterLink class="dropdown-item" to="/Radar">Radar</RouterLink>
                            <div class="dropdown-divider"></div>
                            <a class="dropdown-item" to="/Animation">Animation</a>
                        </div>
                    </li>

                    <li class="nav-item dropdown mr-0">
                        <a class="nav-link dropdown-toggle" href="#" id="dropdown02" role="button"
                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            TP
                        </a>
                        <div class="dropdown-menu" aria-labelledby="dropdown2">
                            <a class="dropdown-item disabled" href="#"><b>VueJs</b></a>
                            <a class="dropdown-item" href="#">TP01 - xxxx</a>
                            <a class="dropdown-item" href="#">TP02 - xxxx</a>
                            <a class="dropdown-item" href="#">TP03 - xxxx</a>
                            <a class="dropdown-item" href="#">TP04 - xxxx</a>
                            <a class="dropdown-item" href="#">TP05 - xxxx</a>
                            <a class="dropdown-item" href="#">TP06 - xxxx</a>
                            <a class="dropdown-item" href="#">TP07 - xxxx</a>
                            <div class="dropdown-divider"></div>
                            <a class="dropdown-item disabled" href="#"><b>ChartJs</b></a>
                            <a class="dropdown-item" href="#">TP01 - xxxx</a>
                            <a class="dropdown-item" href="#">TP02 - xxxx</a>
                            <a class="dropdown-item" href="#">TP03 - xxxx</a>
                            <a class="dropdown-item" href="#">TP04 - xxxx</a>
                            <a class="dropdown-item" href="#">TP05 - xxxx</a>
                            <a class="dropdown-item" href="#">TP06 - xxxx</a>
                            <a class="dropdown-item" href="#">TP07 - xxxx</a>

                        </div>
                    </li>
                </ul>


                <form class="form-inline  input-group-sm ml-auto">
                    <input class="form-control mr-2" placeholder="Login">
                    <input class="form-control mr-2" placeholder="Password">
                    <button class="btn btn-dark ml-auto" type="submit">
                        <i class="fa fa-power-off"></i>
                    </button>
                </form>

            </div>

        </nav>


    </div>
    <RouterView />
</template>

