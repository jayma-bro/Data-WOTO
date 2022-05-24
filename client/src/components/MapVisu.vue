<template>
  <div class="full">
    <fade-loader v-if='loading' class="position-absolute top-50 start-50"></fade-loader>
    <l-map
      v-else
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
        :options="clusterOptions"
        ref="cluster">
        <l-marker
          v-for="depoll in depolls"
          :key="depoll.id"
          :lat-lng="depoll.localisation"
          @click="markerSelect(depoll)">
          <l-popup class="popup">{{ depoll.lieu }} <br>
            Surface {{Math.round(depoll.surface)}}m² <br>
          </l-popup>
        </l-marker>
      </v-marker-cluster>
      <l-polygon :lat-lngs="polygon"></l-polygon>
      <l-polyline :lat-lngs="polyline"></l-polyline>
    </l-map>
  </div>
</template>

<script>
import FadeLoader from 'vue-spinner/src/FadeLoader.vue'
import LControlFullscreen from 'vue2-leaflet-fullscreen'
import L from "leaflet"
import { LMap, LTileLayer, LMarker, LPopup, LPolygon, LPolyline } from 'vue2-leaflet'
import Vue2LeafletMarkerCluster from 'vue2-leaflet-markercluster'


export default {
  name: 'MapView',
  components: {
    FadeLoader,
    LControlFullscreen,
    LMap,
    LMarker,
    LTileLayer,
    LPopup,
    LPolygon,
    LPolyline,
    'v-marker-cluster': Vue2LeafletMarkerCluster
  }, data () {
    return {
      localisation: [],
      polyline: [],
      polygon: [],
      depolls: [],
      map: null,
      loading: true,
      offset: L.point(0, -25),
      mapAtt: {
        zoom: 5,
        center: L.latLng(46.783, 2.667),
        url: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
        attribution: 'Wings Of The Ocean &copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>',
        mapOptions: { zoomSnap: 0.5 },
      },
      clusterOptions: {maxClusterRadius: 35}
    }
  }, mounted () {
    this.$http.get('api/depoll').then((res) => {
      this.lieu = res.data
      let rowDepolls = res.data
      let depolls = []
      let depoll_index = 0
      for (let depoll in rowDepolls) {
        rowDepolls[depoll].dateEvenement = new Date(rowDepolls[depoll].dateEvenement)
        if (rowDepolls[depoll].crewId.some(crew => encodeURIComponent(crew.crewName) === this.$route.params.crew)) {
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
            polygon: rowDepolls[depoll].lieuId.polygon,
            polyline: rowDepolls[depoll].lieuId.polyline,
            poidsTotal: 0,
            volumeTotal: 0
          })
          for (let material of ['PlastiqueNonRecy', 'PlastiqueRecy', 'Metal', 'VerreEtCeramique', 'Textile', 'PapierEtCarton', 'Bois', 'Caoutchouc', 'Autre']) {
            for (let type of [{arr: 'dechetQuantitatifPoids', ty: 'poids'}, {arr: 'dechetQuantitatifVolume', ty: 'volume'}]) {
              if (rowDepolls[depoll][type.arr][type.ty + material] !== null) {
                depolls[depoll_index][type.ty + 'Total'] += rowDepolls[depoll][type.arr][type.ty + material]
              }
            }
          }
          depoll_index ++
        }
      }
      console.log('depolls:', depolls)
      this.depolls = depolls
    })
    this.loading = false
  }, methods: {
    markerSelect(depoll) {
      this.polygon = depoll.polygon
      this.polyline = depoll.polyline
    }
  }
}
</script>
<style>
.full {
  height: 100vh;
  width: 100vw;
}
</style>