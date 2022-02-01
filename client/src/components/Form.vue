<template>
  <div class="form">
    <form  action="" method="post" accept-charset="utf-8" autocomplete="on" name="formulaire depoll" class="needs-validation" novalidate>
      <h1>Formulaire</h1>
      <div class="row">
        <div class="col-xl-3 col-md-6">
          <label for="lieu" class="form-label required">Nom du lieu</label>
          <pop-help :content="help.lieu"></pop-help>
          <input type="text" class="form-control" name="lieu" v-model="lieu" required>
        </div>
        <div class="col-xl-3 col-md-6">
          <label for="ville" class="form-label">Agglomération ou Commune</label>
          <pop-help :content="help.ville"></pop-help>
          <input type="text" class="form-control" name="ville" v-model="ville">
        </div>
        <div class="col-xl-3 col-md-6">
          <label for="dateEvenement" class="form-label required">Date</label>
          <pop-help :content="help.dateEvenement"></pop-help>
          <input type="date" class="form-control" name="dateEvenement" v-model="dateEvenement" required>
        </div>
        <div class="col-xl-3 col-md-6">
          <label for="dureeEvenement" class="form-label required">Durée de l'Evenement</label>
          <pop-help :content="help.dureeEvenement"></pop-help>
          <input type="time" class="form-control" name="dureeEvenement" v-model="dureeEvenement" required>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-3">
          <label for="nombreParticipantsWings" class="form-label required">Nombre de membre Wings</label>
          <pop-help :content="help.nombreParticipantsWings"></pop-help>
          <input type="number" class="form-control" name="nombreParticipantsWings" v-model="nombreParticipantsWings" required>
          <label for="nombreParticipantsExterne" class="form-label required">Nombre de participants Externe</label>
          <pop-help :content="help.nombreParticipantsExterne"></pop-help>
          <input type="number" class="form-control" name="nombreParticipantsExterne" v-model="nombreParticipantsExterne" required>
        </div>
        <div class="col-lg-3">
          <label for="latitude" class="form-label required">Latitude</label>
          <pop-help :content="help.latitude"></pop-help>
          <input type="number" class="form-control" name="latitude" id="latitude" step="0.0000001" v-model="latitude" required>
          <label for="longitude" class="form-label required">Longitude</label>
          <pop-help :content="help.longitude"></pop-help>
          <input type="number" class="form-control" name="longitude" id="longitude" step="0.0000001" v-model="longitude" required>
        </div>
        <div class="col-lg-6" id="map" style="">
          <l-map
            ref="myMap"
            @click="onMapClick"
            :zoom="mapAtt.zoom"
            :center="mapAtt.center"
            :options="mapAtt.mapOptions"
            style="height: 100%">
            <l-tile-layer
              :url="mapAtt.url"
              :attribution="mapAtt.attribution"/>
            <l-marker
              v-if="position.lat && position.lng"
              visible
              draggable
              :icon="mapAtt.icon"
              :lat-lng.sync="position"
              @dragstart="dragging = true"
              @dragend="dragging = false"
              >
              <l-tooltip :content="tooltipContent" :options="{ direction: 'right', permanent: true }" />
            </l-marker>
          </l-map>
        </div>
        <div class="col-lg-6">
          <label for="crew" class="form-label">Crew de dépoll</label>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import PopHelp from './PopHelp.vue'
import help from '@/assets/json/help.json'
import { latLng, icon } from "leaflet"
import { LMap, LTileLayer, LMarker, LTooltip } from 'vue2-leaflet'

export default {
  name: 'Form',
  components: {
    PopHelp,
    LMap,
    LTileLayer,
    LMarker,
    LTooltip
  }, data () {
    return {
      help,
      position: {},
      mapAtt: {
        loading: false,
        icon: icon({
          //iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png")
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
      lieu: '',
      ville: '',
      dateEvenement: '',
      dureeEvenement: '',
      nombreParticipantsWings: '',
      nombreParticipantsExterne: '',
      latitude: '',
      longitude: '',
    }
  }, watch: {
    position: {
      deep: true,
      async handler(value) {
        this.mapAtt.address = await this.getAddress();
        this.$emit("input", { position: value, address: this.mapAtt.address });
      }
    }
  }, computed: {
    tooltipContent() {
      if (this.mapAtt.dragging) return "...";
      if (this.mapAtt.loading) return "Loading...";
      return `<strong>${this.mapAtt.address.replace(
        ",",
        "<br/>"
      )}</strong> <hr/><strong>lat:</strong> ${
        this.position.lat
      }<br/> <strong>lng:</strong> ${this.position.lng}`;
    }
  }, methods: {
    async getAddress() {
      this.mapAtt.loading = true;
      let address = "Unresolved address";
      try {
        const { lat, lng } = this.position;
        const result = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
        );
        if (result.status === 200) {
          const body = await result.json();
          address = body.display_name;
        }
      } catch (e) {
        console.error("Reverse Geocode Error->", e);
      }
      this.mapAtt.loading = false;
      return address;
    },
    onMapClick(value) {
      // place the marker on the clicked spot
      this.position = value.latlng;
    }
  }
}
</script>

<style>
  .required::after {
    content: ' *';
    color: red;
  }

  .show {
    display: block;
  }

  .hide {
    display: none;
  }

  #map {
    height: 50vh;
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .leaflet-tooltip {
    left: 15px;
  }
</style>
