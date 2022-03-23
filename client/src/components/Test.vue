<template>
  <div>
    <div class="map" id="map">
    </div>
  </div>
</template>

<script>
import L from "leaflet"
// import "leaflet-draw"
import '@geoman-io/leaflet-geoman-free'
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css'
export default {
  components: {
  }, data () {
    return {
      mapAtt: {
        loading: false,
        address:"",
        zoom: 5,
        center: L.latLng(46.783, 2.667),
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: 'Wings Of The Ocean &copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>',
        mapOptions: { zoomSnap: 0.5 },
        dragging: false
      },
      mapAction: 'poly',
      coordinates: [
      ],
      map: null,
      tileLayer: null,
      drawnItems: null,
      drawControl: null,
      test: 'blup'
    }
  }, mounted () {
    L.PM.setOptIn(false)
    this.map = L.map('map').setView(this.mapAtt.center, 6)
    this.map.pm.setLang('fr')
    // Set up the OSM layer
    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Data © <a href="http://osm.org/copyright">OpenStreetMap</a>',
        maxZoom: 18
    }).addTo(this.map)
    this.map.pm.addControls({})
    this.drawnItems = new L.FeatureGroup()
    this.map.addLayer(this.drawnItems)
    this.map.on('pm:create', (e) => {
      L.PM.reInitLayer(e.layer);
    })
  }, methods: {
    onMapClick(value) {
      this.coordinates.push(value.latlng)
    }, resetPoly() {
      this.coordinates = [
        [47.2263299, -1.6222],
        [47.21024000000001, -1.6270065], 
        [47.1969447, -1.6136169], 
        [47.18527929999999, -1.6143036], 
        [47.1794457, -1.6098404], 
        [47.1775788, -1.5985107], 
        [47.1676598, -1.5753365], 
        [47.1593731, -1.5521622], 
        [47.1593731, -1.5319061], 
        [47.1722111, -1.5143967], 
        [47.1960115, -1.4841843], 
        [47.2095404, -1.4848709], 
        [47.2291277, -1.4683914], 
        [47.2533687, -1.5116501], 
        [47.2577961, -1.5531921], 
        [47.26828069, -1.5621185], 
        [47.2657179, -1.589241], 
        [47.2589612, -1.6204834],
        [47.237287, -1.6266632], 
        [47.2263299, -1.6222]
      ]
    }, changeMapAction(value) {
      this.mapAction = value
    }
  }
}
</script>

<style>
@import "~leaflet/dist/leaflet.css";
.map { height: 600px }
</style>