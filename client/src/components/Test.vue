<template>
  <div>
    <l-map
      ref="map"
      :zoom="mapAtt.zoom"
      :center="mapAtt.center"
      @click="onMapClick"
      style="height: 500px">
      <l-polygon :lat-lngs="coordinates"></l-polygon>
      <l-tile-layer :url="mapAtt.url"/>
      <l-control position="bottomleft" >
        <button @click="resetPoly">
        Reset Poly
        </button>
        <button @click="changeMapAction('poly')">
        Edit Poly
        </button>
      </l-control>
      <!-- other map components -->
    </l-map>
    <div class="map2" id="map2">

    </div>
  </div>
</template>

<script>

import { latLng, icon, L } from "leaflet"
import { LMap, LTileLayer, LPolygon, LControl } from 'vue2-leaflet'
export default {
  components: {
    LMap,
    LTileLayer,
    LPolygon,
    LControl
  }, data () {
    return {
      mapAtt: {
        loading: false,
        icon: icon({
          iconUrl: require("leaflet/dist/images/marker-icon.png"),
          shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
          iconSize: [25, 41],
          iconAnchor: [12, 41]
        }),
        address:"",
        zoom: 5,
        center: latLng(46.783, 2.667),
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: 'Wings Of The Ocean &copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>',
        mapOptions: { zoomSnap: 0.5 },
        dragging: false
      },
      mapAction: 'poly',
      coordinates: [
      ],
    }
  }, mounted () {
    this.map2 = L.map('map2').setView(this.mapAtt.center, 6);

    // Set up the OSM layer
    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Data © <a href="http://osm.org/copyright">OpenStreetMap</a>',
        maxZoom: 18
      }).addTo(this.map2);

    // add a marker in the given location
    L.marker(this.mapAtt.center).addTo(this.map2);
    this.editableLayers = new L.FeatureGroup()
    this.drawPluginOptions = {
      position: 'topright',
      draw: {
        polygon: {
          allowIntersection: false, // Restricts shapes to simple polygons
          drawError: {
            color: '#e1e100', // Color the shape will turn when intersects
            message: '<strong>Oh snap!<strong> you can\'t draw that!' // Message that will show when intersect
          },
          shapeOptions: {
            color: '#97009c'
          }
        },
        // disable toolbar item by setting it to false
        polyline: false,
        circle: false, // Turns off this drawing tool
        rectangle: false,
        marker: false,
      },
      edit: {
        featureGroup: this.editableLayers, //REQUIRED!!
        remove: false
      }
    },
    this.drawControl = new L.Control.Draw(this.drawPluginOptions)
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


/* var editableLayers = new L.FeatureGroup();
map.addLayer(editableLayers);

var drawPluginOptions = {
  position: 'topright',
  draw: {
    polygon: {
      allowIntersection: false, // Restricts shapes to simple polygons
      drawError: {
        color: '#e1e100', // Color the shape will turn when intersects
        message: '<strong>Oh snap!<strong> you can\'t draw that!' // Message that will show when intersect
      },
      shapeOptions: {
        color: '#97009c'
      }
    },
    // disable toolbar item by setting it to false
    polyline: false,
    circle: false, // Turns off this drawing tool
    rectangle: false,
    marker: false,
    },
  edit: {
    featureGroup: editableLayers, //REQUIRED!!
    remove: false
  }
};

// Initialise the draw control and pass it the FeatureGroup of editable layers
var drawControl = new L.Control.Draw(drawPluginOptions);
map.addControl(drawControl);

var editableLayers = new L.FeatureGroup();
map.addLayer(editableLayers);

map.on('draw:created', function(e) {
  var type = e.layerType,
    layer = e.layer;

  if (type === 'marker') {
    layer.bindPopup('A popup!');
  }

  editableLayers.addLayer(layer);
}); */

</script>

<style>
.map { height: 600px }
</style>