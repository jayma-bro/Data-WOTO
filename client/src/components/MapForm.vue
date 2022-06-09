<template>
  <div class="full">
    <fade-loader v-if='loading' class="position-absolute top-50 start-50"></fade-loader>
    <div class="map" id="map">
    </div>
  </div>
</template>

<script>
import L from "leaflet"
import '@geoman-io/leaflet-geoman-free'
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css'
import 'leaflet.markercluster'
import FadeLoader from 'vue-spinner/src/FadeLoader.vue'

export default {
  name: 'MapForm',
  components: {
    FadeLoader
  },
  props: {
    config: Object,
  }, data () {
    return {
      loading: true,
      markers: [],
      position: {},
      polygon: [],
      polyline: [],
      polygonObj: null,
      polylineObj: null,
      map: null,
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
    }
  }, watch: {
    config: {
      handler(value) {
        if (!this.loading) {
          if (value.modif) {
            this.map.pm.enableGlobalEditMode()
          } else {
            this.map.pm.disableGlobalEditMode()
            this.polygonObj.setLatLngs(this.polygon)
            this.polylineObj.setLatLngs(this.polyline)
          }
        }
      }
    }
  }, mounted () {
    let run = async () => {
      if (this.config.show === null) {
        this.map = L.map('map').setView(this.mapAtt.center, this.mapAtt.zoom)
      } else if (this.config.show === "depolls") {
        await this.$http.get('api/depolls').then((res) => {
          let rowDepolls = res.data
          let latlng = []
          let depolls = []
          let depoll_index = 0
          for (let depoll in rowDepolls) {
            rowDepolls[depoll].dateEvenement = new Date(rowDepolls[depoll].dateEvenement)
            let crewId = null
            if (this.$route.params.crewid != undefined) {
              crewId = this.$route.params.crewid
            }
            if (rowDepolls[depoll].crewId.some(crew => encodeURIComponent(crew._id) === crewId || crewId === null)) {
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
              latlng.push(rowDepolls[depoll].lieuId.localisation)
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
          this.markers = depolls
          this.mapAtt.bounds = L.latLngBounds(latlng)
        })
        this.map = L.map('map').fitBounds(this.mapAtt.bounds)
      } else if (this.config.show === "lieux") {
        await this.$http.get('api/lieux').then((res) => {
          let rowLieux = res.data
          let latlng = []
          let lieux = []
          for (let lieu in rowLieux) {
            lieux.push({
                lieu: rowLieux[lieu].lieu,
                ville: rowLieux[lieu].ville,
                pays: rowLieux[lieu].pays,
                longueur: rowLieux[lieu].longueur,
                typeLieu: rowLieux[lieu].typeLieu,
                surface: rowLieux[lieu].surface,
                localisation: rowLieux[lieu].localisation,
                polygon: rowLieux[lieu].polygon,
                polyline: rowLieux[lieu].polyline,
              })
              latlng.push(rowLieux[lieu].localisation)
          }
          this.markers = lieux
          this.mapAtt.bounds = L.latLngBounds(latlng)
        })
        this.map = L.map('map').fitBounds(this.mapAtt.bounds)
      }
      L.tileLayer(
        (this.config.tile != undefined) ? this.config.tile : this.mapAtt.url, {
          attribution: this.mapAtt.attribution
      }).addTo(this.map)
      if (this.config.poly) {
        this.polylineObj = L.polyline(this.polyline).addTo(this.map)
        this.polylineObj.on('pm:edit', (e) => {
          this.$emit('uppoly', e.shape, e)
        })
        this.polygonObj = L.polygon(this.polygon).addTo(this.map)
        this.polygonObj.on('pm:edit', (e) => {
          this.$emit('uppoly', e.shape, e)
        })
      }
      if (this.config.show != null) {
        let markers = L.markerClusterGroup()
        this.markers.forEach(marker => {
          markers.addLayer(L.marker(marker.localisation).bindPopup(
            (this.config.show == "depolls") ? marker.lieu + "<br>" + Math.round(marker.poidsTotal) + "Kg" : marker.lieu + "<br>" + Math.round(marker.surface) + "m²"
          ).on("click", (e) => {
            if (!e.target.isPopupOpen()) {
              e.target.closePopup()
            } else {
              e.target.openPopup()
            }
            if (this.config.poly) {
              this.polygon = marker.polygon
              this.polyline = marker.polyline
              this.polygonObj.setLatLngs(marker.polygon)
              this.polylineObj.setLatLngs(marker.polyline)
            }
            this.$emit('update', marker)
          }))
        })
        this.map.addLayer(markers)
      }
      if (this.config.edit === true) {
        L.PM.setOptIn(false)
        this.map.pm.setLang('fr')
        this.map.pm.addControls({
          drawCircleMarker: false,
          drawRectangle: false,
          drawCircle: false,
          cutPolygon: false,
          rotateMode: false,
          drawMarker: false,
          drawPolygon: false,
          drawPolyline: false,
          editMode: true,
          removalMode: true,
        })
        this.map.pm.Toolbar.copyDrawControl('Marker', {
          name: this.config.editVal.marker.name,
          title: this.config.editVal.marker.text,
          onClick: () => { this.testShape(this.config.editVal.marker.name) }
        })
        this.map.pm.Toolbar.copyDrawControl('Polyline', {
          name: this.config.editVal.polyline.name,
          title: this.config.editVal.polyline.text,
          onClick: () => { this.testShape(this.config.editVal.polyline.name) }
        })
        this.map.pm.enableDraw(this.config.editVal.polyline.name, {
          allowSelfIntersection: false
        })
        this.map.pm.Toolbar.copyDrawControl('Polygon', {
          name: this.config.editVal.polygon.name,
          title: this.config.editVal.polygon.text,
          onClick: () => { this.testShape(this.config.editVal.polygon.name) }
        })
        this.map.pm.enableDraw(this.config.editVal.polygon.name, {
          allowSelfIntersection: false
        })
        this.map.pm.disableDraw()
        this.map.on('pm:create', (e) => {
          if (e.shape === this.config.editVal.marker.name) {
            this.marker = e.layer
            this.marker.on('pm:edit', (e) => {
              this.$emit('update', e.shape, e)
            })
            L.PM.reInitLayer(this.marker)
          } else if (e.shape === this.config.editVal.polyline.name) {
            this.polyline = e.layer
            this.polyline.setStyle({color: 'green'})
            this.polyline.on('pm:edit', (e) => {
              this.$emit('update', e.shape, e)
            })
            L.PM.reInitLayer(this.polyline)
          } else if (e.shape === this.config.editVal.polygon.name) {
            this.polygon = e.layer
            this.polygon.on('pm:edit', (e) => {
              this.$emit('update', e.shape, e)
            })
            L.PM.reInitLayer(this.polygon)
          }
          this.$emit('update', e.shape, e)
        })
        this.map.on('pm:remove', (e) => {
          this.$emit('update', e.shape, e)
        })
      }
      
    this.loading = false
    }
    run()
  }, methods: {
    testShape(shape) {
      const drawArray = this.map.pm.getGeomanDrawLayers()
      const index = drawArray.findIndex((value) => value.pm.getShape() === shape)
      if (index !== -1) {
        drawArray[index].pm.remove()
      }
    }
  }
}
</script>

<style>
.full {
  height: 100vh;
  width: 100vw;
}
#map {
  height: 100%;
  margin: 0;
}
</style>