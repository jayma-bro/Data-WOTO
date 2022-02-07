<template>
  <div class="">
    <fade-loader v-if='chargement' class="position-absolute top-50 start-50"></fade-loader>
    <div class="" v-else>
      <div class="row">
        <h2>info général</h2>
        <h4>Surface total : {{stats.surfaceTotal}}m²</h4>
        <div class="col-6">
          <h6>Poids total par materiaux</h6>
          <ul>
            <li v-for="(val, material) in stats.poids" :key="val.id">{{material + " : " + val}}</li>
          </ul>
          <h4>Poids total : {{stats.poidsTotal}}Kg</h4>
        </div>
        <div class="col-6">
          <h6>Volume total par materiaux</h6>
          <ul>
            <li v-for="(val, material) in stats.volume" :key="val.id">{{material + " : " + val}}</li>
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
              visible
              v-for="mark in marker"
              :key="mark.id"
              :icon="mapAtt.icon"
              :lat-lng="mark.location">
            </l-marker>
          </v-marker-cluster>
        </l-map>
      </div>
      <h1>les dépolls enregistré</h1>
      <div class="row">
        <div class="col-6" style="padding: 0px;" v-for="depoll of depolls" :key="depoll.id">
          <div class="depoll">
            <h3>{{ depoll.lieu + ' : '+ depoll.ville }}</h3>
            <h5> <em v-for="(crewId, crewIndex) of depoll.crewName" :key='crewId.id'>{{ depoll.crewType[crewIndex] + ' : '+ crewId }} <br></em></h5>
            <h6>{{ depoll.dateEvenement.toLocaleDateString("fr-FR", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}) }}</h6>
            <p>pendant {{ Math.floor(depoll.dureeEvenement/60) }}h et {{ depoll.dureeEvenement%60 }} minutes <br>
              par {{ depoll.nombreParticipantsWings }} wings et {{ depoll.nombreParticipantsExterne }} participant externe et la participation de<br>
              {{ depoll.autresStructures }}
            </p>
            <ul>
              <li>Surface : {{depoll.surface}}m²</li>
              <li>Poids : {{depoll.poidsTotal}}Kg</li>
              <li>Volume : {{depoll.volumeTotal}}L</li>
            </ul>
            <p><strong>commentaire : </strong><br>
              {{ depoll.commentaire }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FadeLoader from 'vue-spinner/src/FadeLoader.vue'
import LControlFullscreen from 'vue2-leaflet-fullscreen'
import { latLng, icon} from "leaflet"
import { LMap, LTileLayer, LMarker} from 'vue2-leaflet'
import Vue2LeafletMarkerCluster from 'vue2-leaflet-markercluster'

export default {
  name: 'DataView',
  components: {
    FadeLoader,
    LControlFullscreen,
    LMap,
    LMarker,
    LTileLayer,
    'v-marker-cluster': Vue2LeafletMarkerCluster
  },
  data () {
    return {
      depolls: {},
      stats: {},
      chargement: true,
      marker: [],
      mapAtt: {
        zoom: 5,
        center: latLng(46.783, 2.667),
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: 'Wings Of The Ocean &copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>',
        mapOptions: { zoomSnap: 0.5 },
        icon: icon({
          iconUrl: require("leaflet/dist/images/marker-icon.png"),
          shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
          iconSize: [25, 41],
          iconAnchor: [12, 41]
        })
      }
    }
  }, mounted () {
    this.$http.get('api/form').then((res) => {
      let depolls = res.data
      let marker = []
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
      for (let depoll in res.data) {
        depolls[depoll].crewName = res.data[depoll].crewName.split(";")
        depolls[depoll].crewType = res.data[depoll].crewType.split(";")
        depolls[depoll].dateEvenement = new Date(res.data[depoll].dateEvenement)
        marker.push({name:res.data[depoll].lieu, location:[res.data[depoll].latitude, res.data[depoll].longitude]})
        depolls[depoll].poidsTotal = 0
        depolls[depoll].volumeTotal = 0
        for (let material of ['PlastiqueNonRecy', 'PlastiqueRecy', 'Metal', 'VerreEtCeramique', 'Textile', 'PapierEtCarton', 'Bois', 'Caoutchouc', 'Autre']) {
         for (let type of ['poids', 'volume']) {
           if (res.data[depoll][type + material] !== null) {
             stats[type][material] += res.data[depoll][type + material]
             depolls[depoll][type + 'Total'] += res.data[depoll][type + material]
           }
         }
       }
       if (res.data[depoll].surface !== null) {
        stats.surfaceTotal += res.data[depoll].surface
       }
      }
      for (let material of ['PlastiqueNonRecy', 'PlastiqueRecy', 'Metal', 'VerreEtCeramique', 'Textile', 'PapierEtCarton', 'Bois', 'Caoutchouc', 'Autre']) {
        stats.poidsTotal += stats.poids[material]
        stats.volumeTotal += stats.volume[material]
      }
      stats.surfaceTotal = Math.round(stats.surfaceTotal)
      stats.poidsTotal = Math.round(stats.poidsTotal)
      stats.volumeTotal = Math.round(stats.volumeTotal)
      this.stats = stats
      this.depolls = depolls
      this.marker = marker
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
</style>
