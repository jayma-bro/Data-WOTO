<template>
  <editable-map editable :zoom="zoom" :center="center" style="height: 500px">
    <l-tile-layer :url="url" />
    <editable-polygon
      @click="editMode['polygon'] = !editMode['polygon']"
      :editable="editMode['polygon']"
      :lat-lngs="polygon"
    />
  </editable-map>
</template>

<script>
import { LTileLayer } from "vue2-leaflet"
import { EditableMap, EditablePolygon } from "vue2-leaflet-editable"

export default {
  name: 'the-map',
  components: {
    LTileLayer,
    EditableMap,
    EditablePolygon,
  },
  data: ()=> ({
    zoom: 14,
    center: [-33.8688, 151.2093],
    url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
    polygon: [
      [-33.8688, 151.2093],
      [-33.86, 151.2093],
      [-33.86, 151.215],
      [-33.8688, 151.215]
    ],
    editMode: { polygon: true }
  })
}
</script>

<style>
</style>