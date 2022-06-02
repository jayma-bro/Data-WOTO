<template>
  <div>
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
        ref="cluster">
        <l-marker
          v-for="lieu in lieux"
          :key="lieu.id"
          :lat-lng="lieu.localisation"
          @click="markerSelect(lieu)">
          <l-popup class="popup">{{ lieu.lieu }} <br>
            Surface {{Math.round(lieu.surface)}}m² <br>
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
  }, props: {
    content: Object,
  }, data () {
    return {
      localisation: [],
      polyline: [],
      polygon: [],
      lieux: {},
      map: null,
      loading: true,
      offset: L.point(0, -25),
      mapAtt: {
        zoom: 5,
        center: L.latLng(46.783, 2.667),
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: 'Wings Of The Ocean &copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>',
        mapOptions: { zoomSnap: 0.5 },
      }
    }
  }, mounted () {
    this.$http.get('api/lieux').then((res) => {
      this.lieux = res.data
    })
    this.loading = false
  }, methods: {
    markerSelect(lieu) {
      this.polygon = lieu.polygon
      this.polyline = lieu.polyline
      this.$emit('update', lieu)
    }
  }
}
</script>

<style>

</style>