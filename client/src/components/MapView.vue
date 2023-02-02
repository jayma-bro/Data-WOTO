<template>
  <div class="full">
    <fade-loader
      v-if="loading"
      class="position-absolute top-50 start-50"
    ></fade-loader>
    <div class="map" id="map"></div>
  </div>
</template>

<script>
import L from 'leaflet'
import '@geoman-io/leaflet-geoman-free'
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css'
import 'leaflet.markercluster'
import FadeLoader from 'vue-spinner/src/FadeLoader.vue'

export default {
  name: 'MapForm',
  components: {
    FadeLoader,
  },
  props: {
    config: {
      show: null, // pour choisir ce qui doit être affiché de basse les valeurs possibles sont: null, 'lieux', 'depolls' ou l'id d'une depoll
      edit: false, // pour activer ou non le mode édition (ne peut pas être chanché a la volé)
      editVal: null, // en mode édition, obligatoir pour les informations textuel d'edition
      poly: false, // pour choisir d'afficher ou non la géométrie du lieu
      modif: null, // pour retoucher la géométrie d'un lieu à la volé
      tile: null, // pour utiliser un autre fond de carte
      year: false,
    },
  },
  data() {
    return {
      loading: true,
      markers: [],
      markersClust: null,
      position: {},
      polygon: [],
      polyline: [],
      polygonObj: null,
      polylineObj: null,
      map: null,
      mapAtt: {
        loading: false,
        address: '',
        zoom: 5,
        center: L.latLng(46.783, 2.667),
        mapOptions: { zoomSnap: 0.5 },
        dragging: false,
      },
    }
  },
  watch: {
    config: {
      handler(value) {
        if (!this.loading & (value.modif != null)) {
          if (value.modif) {
            this.map.pm.enableGlobalEditMode()
            this.map.removeLayer(this.markersClust)
          } else {
            this.map.pm.disableGlobalEditMode()
            this.polygonObj.setLatLngs(this.polygon)
            this.polylineObj.setLatLngs(this.polyline)
            this.map.addLayer(this.markersClust)
          }
        }
      },
    },
  },
  async mounted() {
    if (this.config.show === null) {
      this.map = L.map('map', { zoomSnap: 0.25 }).setView(
        this.mapAtt.center,
        this.mapAtt.zoom
      )
    } else if (this.config.show === 'depolls') {
      await this.$http.get('api/depolls').then((res) => {
        let rowDepolls = res.data
        let latlng = []
        let depolls = []
        let depoll_index = 0
        for (let depoll in rowDepolls) {
          rowDepolls[depoll].dateEvenement = new Date(
            rowDepolls[depoll].dateEvenement
          )
          if (
            rowDepolls[depoll].dateEvenement.getUTCFullYear() ==
              this.config.year ||
            this.config.year == false
          ) {
            let crewId = null
            if (this.$route.params.crewid != undefined) {
              crewId = this.$route.params.crewid
            }
            if (
              rowDepolls[depoll].crewId.some(
                (crew) => encodeURIComponent(crew._id) === crewId
              ) ||
              (crewId == 'labels' &&
                rowDepolls[depoll].crewId.some(
                  (crew) => crew.crewTypeId.value === 'labels'
                )) ||
              (crewId == 'antenneLocal' &&
                rowDepolls[depoll].crewId.some(
                  (crew) => crew.crewTypeId.value === 'antenneLocal'
                )) ||
              crewId === null
            ) {
              depolls.push({
                _id: rowDepolls[depoll]._id,
                lieu: rowDepolls[depoll].lieuId.lieu,
                ville: rowDepolls[depoll].lieuId.ville,
                crew: rowDepolls[depoll].crewId,
                dateEvenement: rowDepolls[depoll].dateEvenement,
                dureeEvenement: rowDepolls[depoll].dureeEvenement,
                nombreParticipantsWings:
                  rowDepolls[depoll].nombreParticipantsWings,
                nombreParticipantsExterne:
                  rowDepolls[depoll].nombreParticipantsExterne,
                autresStructures:
                  rowDepolls[depoll].autresStructures.join(', '),
                surface: rowDepolls[depoll].lieuId.surface,
                localisation: rowDepolls[depoll].lieuId.localisation,
                polygon: rowDepolls[depoll].lieuId.polygon,
                polyline: rowDepolls[depoll].lieuId.polyline,
                poidsTotal: 0,
                volumeTotal: 0,
              })
              latlng.push(rowDepolls[depoll].lieuId.localisation)
              for (let material of [
                'PlastiqueNonRecy',
                'PlastiqueRecy',
                'Metal',
                'VerreEtCeramique',
                'Textile',
                'PapierEtCarton',
                'Bois',
                'Caoutchouc',
                'Autre',
              ]) {
                for (let type of [
                  { arr: 'dechetQuantitatifPoids', ty: 'poids' },
                  { arr: 'dechetQuantitatifVolume', ty: 'volume' },
                ]) {
                  if (
                    rowDepolls[depoll][type.arr][type.ty + material] !== null
                  ) {
                    depolls[depoll_index][type.ty + 'Total'] +=
                      rowDepolls[depoll][type.arr][type.ty + material]
                  }
                }
              }
              depoll_index++
            }
          }
        }
        this.markers = depolls
        if (
          this.$route.query.top != undefined &&
          this.$route.query.bottom != undefined &&
          this.$route.query.right != undefined &&
          this.$route.query.left != undefined
        ) {
          this.mapAtt.bounds = L.latLngBounds([
            [this.$route.query.top, this.$route.query.right],
            [this.$route.query.bottom, this.$route.query.left],
          ])
        } else {
          this.mapAtt.bounds = L.latLngBounds(latlng)
        }
      })
      this.map = L.map('map', { zoomSnap: 0.25 }).fitBounds(this.mapAtt.bounds)
    } else if (this.config.show === 'lieux') {
      await this.$http.get('api/lieux').then((res) => {
        let rowLieux = res.data
        let latlng = []
        let lieux = []
        for (let lieu in rowLieux) {
          lieux.push({
            _id: rowLieux[lieu]._id,
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
        if (
          this.$route.query.top != undefined &&
          this.$route.query.bottom != undefined &&
          this.$route.query.right != undefined &&
          this.$route.query.left != undefined
        ) {
          this.mapAtt.bounds = L.latLngBounds([
            [this.$route.query.top, this.$route.query.right],
            [this.$route.query.bottom, this.$route.query.left],
          ])
        } else {
          this.mapAtt.bounds = L.latLngBounds(latlng)
        }
      })
      this.map = L.map('map', { zoomSnap: 0.25 }).fitBounds(this.mapAtt.bounds)
    } else {
      await this.$http.get('api/depolls/' + this.config.show).then((res) => {
        let polygon = []
        let polyline = []
        let surface = 0
        if (res.data.polygon === undefined) {
          polygon = res.data.lieuId.polygon
          polyline = res.data.lieuId.polyline
          surface = res.data.lieuId.surface
        } else {
          polygon =
            res.data.polygon.length === 0
              ? res.data.lieuId.polygon
              : res.data.polygon
          polyline =
            res.data.polyline.length === 0
              ? res.data.lieuId.polyline
              : res.data.polyline
          surface =
            res.data.surface == null
              ? res.data.lieuId.surface
              : res.data.surface
        }
        const marker = {
          lieu: res.data.lieuId.lieu,
          localisation: res.data.lieuId.localisation,
          polygon: polygon,
          polyline: polyline,
          surface: surface,
        }
        this.markers = [marker]
        this.polygon = marker.polygon
        this.polyline = marker.polyline
        if (
          this.$route.query.top != undefined &&
          this.$route.query.bottom != undefined &&
          this.$route.query.right != undefined &&
          this.$route.query.left != undefined
        ) {
          this.mapAtt.bounds = L.latLngBounds([
            [this.$route.query.top, this.$route.query.right],
            [this.$route.query.bottom, this.$route.query.left],
          ])
        } else {
          this.mapAtt.bounds = L.latLngBounds(marker.polygon)
        }
      })
      this.map = L.map('map', { zoomSnap: 0.25 }).fitBounds(this.mapAtt.bounds)
    }
    if (this.config.tile == null) {
      let osm = L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          attribution:
            'Wings Of The Ocean &copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>',
        }
      )
      let googleSat = L.tileLayer(
        'http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
        {
          subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
          attribution: 'Wings Of The Ocean &copy; Google Map Satellite',
        }
      )
      googleSat.addTo(this.map)
      osm.addTo(this.map)
      const baseMaps = {
        'Google Satellite': googleSat,
        OpenStreetMap: osm,
      }
      L.control.layers(baseMaps).addTo(this.map)
    } else {
      L.tileLayer(this.config.tile, {
        attribution: 'Wings Of The Ocean &copy;',
      }).addTo(this.map)
    }
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
      this.markersClust = L.markerClusterGroup({ maxClusterRadius: 35 })
      this.markers.forEach((marker) => {
        this.markersClust.addLayer(
          L.marker(marker.localisation)
            .bindPopup(
              this.config.show == 'depolls'
                ? marker.lieu + '<br>' + Math.round(marker.poidsTotal) + 'Kg'
                : marker.lieu + '<br>' + Math.round(marker.surface) + 'm²'
            )
            .on('click', (e) => {
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
            })
        )
      })
      this.map.addLayer(this.markersClust)
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
        onClick: () => {
          this.testShape(this.config.editVal.marker.name)
        },
      })
      this.map.pm.Toolbar.copyDrawControl('Polyline', {
        name: this.config.editVal.polyline.name,
        title: this.config.editVal.polyline.text,
        onClick: () => {
          this.testShape(this.config.editVal.polyline.name)
        },
      })
      this.map.pm.enableDraw(this.config.editVal.polyline.name, {
        allowSelfIntersection: false,
      })
      this.map.pm.Toolbar.copyDrawControl('Polygon', {
        name: this.config.editVal.polygon.name,
        title: this.config.editVal.polygon.text,
        onClick: () => {
          this.testShape(this.config.editVal.polygon.name)
        },
      })
      this.map.pm.enableDraw(this.config.editVal.polygon.name, {
        allowSelfIntersection: false,
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
          this.polylineObj = e.layer
          this.polylineObj.setStyle({ color: 'green' })
          this.polylineObj.on('pm:edit', (e) => {
            this.$emit('update', e.shape, e)
          })
          L.PM.reInitLayer(this.polylineObj)
        } else if (e.shape === this.config.editVal.polygon.name) {
          this.polygonObj = e.layer
          this.polygonObj.on('pm:edit', (e) => {
            this.$emit('update', e.shape, e)
          })
          L.PM.reInitLayer(this.polygonObj)
        }
        this.$emit('update', e.shape, e)
      })
      this.map.on('pm:remove', (e) => {
        this.$emit('update', e.shape, e)
      })
    }

    this.loading = false
  },
  methods: {
    testShape(shape) {
      const drawArray = this.map.pm.getGeomanDrawLayers()
      const index = drawArray.findIndex(
        (value) => value.pm.getShape() === shape
      )
      if (index !== -1) {
        drawArray[index].pm.remove()
      }
    },
  },
}
</script>

<style src="../assets/css/style.css">
</style>