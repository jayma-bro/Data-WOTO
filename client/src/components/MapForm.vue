<template>
  <div>
    <div class="map" id="map">
    </div>
  </div>
</template>

<script>
import L from "leaflet"
import '@geoman-io/leaflet-geoman-free'
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css'

export default {
  name: 'MapForm',
  props: {
    content: Object,
  }, data () {
    return {
      polygon: [],
      position: {},
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
  }, mounted () {
    L.PM.setOptIn(false)
    this.map = L.map('map').setView(this.mapAtt.center, this.mapAtt.zoom)
    this.map.pm.setLang('fr')
    L.tileLayer(
      this.mapAtt.url, {
        attribution: this.mapAtt.attribution
    }).addTo(this.map)
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
      name: this.content.value.marker.name,
      title: this.content.value.marker.text,
      onClick: () => { this.testShape(this.content.value.marker.name) }
    })
    this.map.pm.Toolbar.copyDrawControl('Polyline', {
      name: this.content.value.polyline.name,
      title: this.content.value.polyline.text,
      onClick: () => { this.testShape(this.content.value.polyline.name) }
    })
    this.map.pm.enableDraw(this.content.value.polyline.name, {
      allowSelfIntersection: false
    })
    this.map.pm.Toolbar.copyDrawControl('Polygon', {
      name: this.content.value.polygon.name,
      title: this.content.value.polygon.text,
      onClick: () => { this.testShape(this.content.value.polygon.name) }
    })
    this.map.pm.enableDraw(this.content.value.polygon.name, {
      allowSelfIntersection: false
    })
    this.map.pm.disableDraw()
    this.map.on('pm:create', (e) => {
      if (e.shape === this.content.value.marker.name) {
        this.marker = e.layer
        this.marker.on('pm:edit', (e) => {
          this.$emit('update', e.shape, e)
        })
        L.PM.reInitLayer(this.marker)
      } else if (e.shape === this.content.value.polyline.name) {
        this.polyline = e.layer
        this.polyline.setStyle({color: 'green'})
        console.log('polyline:', this.polyline)
        this.polyline.on('pm:edit', (e) => {
          this.$emit('update', e.shape, e)
        })
        L.PM.reInitLayer(this.polyline)
      } else if (e.shape === this.content.value.polygon.name) {
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

</style>