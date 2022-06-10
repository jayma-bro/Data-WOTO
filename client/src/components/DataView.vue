<template>
  <div class="container">
    <fade-loader v-if='chargement' class="position-absolute top-50 start-50"></fade-loader>
    <div class="" v-else>
      <div class="row">
        <h2>Informations générales {{ $route.params.year }} </h2>
        <router-link :to="{ name: 'Home'}">Retour à l'accueil</router-link>
        <h4>Surface totale : {{stats.surfaceTotal}}m²</h4>
        <div class="col-6">
          <h6>Poids total par matériaux :</h6>
          <ul>
            <li v-for="(val, material) in stats.poids" :key="val.id">{{material + " : " + Math.round(val)}}kg</li>
          </ul>
          <h4>Poids total : {{stats.poidsTotal}}kg</h4>
        </div>
        <div class="col-6">
          <h6>Volume total par matériaux :</h6>
          <ul>
            <li v-for="(val, material) in stats.volume" :key="val.id">{{material + " : " + Math.round(val)}}L</li>
          </ul>
          <h4>Volume total : {{stats.volumeTotal}}L</h4>
        </div>
      </div>
      <div class="" id="map" style="">
        <l-map
          ref="myMap"
          :zoom="mapAtt.zoom"
          :center="mapAtt.center"
          :options="mapAtt.mapOptions"
          style="height: 100%">
          <l-tile-layer
            :url="mapAtt.url"
            :attribution="mapAtt.attribution"/>
          <l-control-fullscreen position="topleft"
            :options="{ title: { 'false': 'Go big!', 'true': 'Be regular' } }"/>
          <v-marker-cluster
            ref="cluster">
            <l-marker
              v-for="depoll in depolls"
              :key="depoll.id"
              :icon="mapAtt.icon"
              :lat-lng="depoll.localisation">
              <l-popup class="popup" :options="{offset: offset}">{{ depoll.lieu }} <br>
                {{ depoll.dateEvenement.toLocaleDateString("fr-FR", { day: '2-digit', month: '2-digit', year: '2-digit'}) }} <br>
                Surface {{Math.round(depoll.surface)}}m² <br>
                Poids {{Math.round(depoll.poidsTotal)}}kg <br>
                Volume {{Math.round(depoll.volumeTotal)}}L
              </l-popup>
            </l-marker>
          </v-marker-cluster>
        </l-map>
      </div>
      <h1>Les dépollutions enregistrées</h1>
      <div class="row">
        <table class="col-12 table table-striped table-bordered">
          <thead>
            <th>N°</th>
            <th>Lieu</th>
            <th>Ville</th>
            <th>Equipe</th>
            <th>Date</th>
            <th>Durée</th>
            <th>Participant·e·s</th>
            <th>Structures Externes</th>
            <th>Surface</th>
            <th>Poids</th>
            <th>Volume</th>
          </thead>
          <tbody>
            <tr  v-for="(depoll, depollIndex) of depolls" :key="depoll.id">
              <th>{{ depolls.length - depollIndex }}</th>
              <th>{{ depoll.lieu }}</th>
              <td>{{ depoll.ville }}</td>
              <td><span v-for="crew of depoll.crew" :key='crew.id'>{{ crew.crewTypeId.name + ' : '+ crew.crewName }}<br></span></td>
              <td>{{ depoll.dateEvenement.toLocaleDateString("fr-FR", { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'}) }}</td>
              <td>{{ Math.floor(depoll.dureeEvenement/60) }}h{{ depoll.dureeEvenement%60 }}</td>
              <td>{{ depoll.nombreParticipantsWings }} Wings, {{ depoll.nombreParticipantsExterne }} Externe</td>
              <td>{{ depoll.autresStructures }}</td>
              <td>{{Math.round(depoll.surface)}}m²</td>
              <td>{{Math.round(depoll.poidsTotal)}}Kg</td>
              <td>{{Math.round(depoll.volumeTotal)}}L</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import FadeLoader from 'vue-spinner/src/FadeLoader.vue'
import LControlFullscreen from 'vue2-leaflet-fullscreen'
import L from "leaflet"
import { LMap, LTileLayer, LMarker, LPopup } from 'vue2-leaflet'
import Vue2LeafletMarkerCluster from 'vue2-leaflet-markercluster'

export default {
  name: 'DataView',
  components: {
    FadeLoader,
    LControlFullscreen,
    LMap,
    LMarker,
    LTileLayer,
    LPopup,
    'v-marker-cluster': Vue2LeafletMarkerCluster
  },
  data () {
    return {
      depolls: {},
      stats: {},
      chargement: true,
      offset: L.point(0, -25),
      mapAtt: {
        zoom: 5,
        center: L.latLng(46.783, 2.667),
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: 'Wings Of The Ocean &copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>',
        mapOptions: { zoomSnap: 0.5 },
        icon: L.icon({
          iconUrl: require("leaflet/dist/images/marker-icon.png"),
          shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
          iconSize: [25, 41],
          iconAnchor: [12, 41]
        })
      }
    }
  }, mounted () {
    this.$http.get('api/depolls').then((res) => {
      let rowDepolls = res.data
      let depolls = []
      let stats = {
        poidsTotal:0,
        volumeTotal:0,
        surfaceTotal:0,
        poids: {
          PlastiqueNonRecy :0,
          PlastiqueRecy :0,
          Metal :0,
          VerreEtCeramique :0,
          Textile :0,
          PapierEtCarton :0,
          Bois :0,
          Caoutchouc :0,
          Autre :0
        },
        volume: {
          PlastiqueNonRecy :0,
          PlastiqueRecy :0,
          Metal :0,
          VerreEtCeramique :0,
          Textile :0,
          PapierEtCarton :0,
          Bois :0,
          Caoutchouc :0,
          Autre :0
        }
      }
      let depoll_index = 0
      for (let depoll in rowDepolls) {
        rowDepolls[depoll].dateEvenement = new Date(rowDepolls[depoll].dateEvenement)
        if (rowDepolls[depoll].dateEvenement.getUTCFullYear() == this.$route.params.year) {
          depolls.push({
            lieu: rowDepolls[depoll].lieuId.lieu,
            ville: rowDepolls[depoll].lieuId.ville,
            crew: rowDepolls[depoll].crewId,
            dateEvenement: rowDepolls[depoll].dateEvenement,
            dureeEvenement: rowDepolls[depoll].dureeEvenement,
            nombreParticipantsWings: rowDepolls[depoll].nombreParticipantsWings,
            nombreParticipantsExterne: rowDepolls[depoll].nombreParticipantsExterne,
            autresStructures: rowDepolls[depoll].autresStructures.join(', '),
            surface: rowDepolls[depoll].lieuId.surface,
            localisation: rowDepolls[depoll].lieuId.localisation,
            poidsTotal: 0,
            volumeTotal: 0
          })
          for (let material of ['PlastiqueNonRecy', 'PlastiqueRecy', 'Metal', 'VerreEtCeramique', 'Textile', 'PapierEtCarton', 'Bois', 'Caoutchouc', 'Autre']) {
            for (let type of [{arr: 'dechetQuantitatifPoids', ty: 'poids'}, {arr: 'dechetQuantitatifVolume', ty: 'volume'}]) {
              if (rowDepolls[depoll][type.arr][type.ty + material] !== null) {
                stats[type.ty][material] += rowDepolls[depoll][type.arr][type.ty + material]
                depolls[depoll_index][type.ty + 'Total'] += rowDepolls[depoll][type.arr][type.ty + material]
              }
            }
          }
          if (rowDepolls[depoll].lieuId.surface !== null) {
            stats.surfaceTotal += rowDepolls[depoll].lieuId.surface
          }
          depoll_index ++
        }
      }
      depolls.sort((a,b) => b.dateEvenement - a.dateEvenement)
      for (let material of ['PlastiqueNonRecy', 'PlastiqueRecy', 'Metal', 'VerreEtCeramique', 'Textile', 'PapierEtCarton', 'Bois', 'Caoutchouc', 'Autre']) {
        stats.poidsTotal += stats.poids[material]
        stats.volumeTotal += stats.volume[material]
      }
      stats.surfaceTotal = Math.round(stats.surfaceTotal)
      stats.poidsTotal = Math.round(stats.poidsTotal)
      stats.volumeTotal = Math.round(stats.volumeTotal)
      this.stats = stats
      this.depolls = depolls
      this.chargement = false
    })
  }
}
</script>

<style>
  @import "~leaflet.markercluster/dist/MarkerCluster.css";
  @import "~leaflet.markercluster/dist/MarkerCluster.Default.css";
  .depoll {
    border: solid;
    border-radius: 1rem;
    border-width: thin;
    background-color: rgb(228, 228, 228);
    margin: 8px;
    padding: 10px;
  }

  #map {
    height: 60vh;
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .cluster-text {
    margin:12px;
    width:40px;
    height:40px;
    border-radius:100%;
    background-color: #FEBF34;
    color:#fff;
    text-align:center;
    font-size:14px;
    overflow:hidden;
    line-height:40px;
  }

  .leaflet-popup {
    bottom: 20px;
  }
</style>
