<template>
  <div class="form">
    <form  action="" method="post" accept-charset="utf-8" autocomplete="on" name="formulaire depoll" class="needs-validation" novalidate>
      <h1>Formulaire</h1>
      <div class="row">
        <input-type :content="formInfo.lieu" baseclass="col-xl-3 col-md-6" @update="upValue"></input-type>
        <input-type :content="formInfo.ville" baseclass="col-xl-3 col-md-6" @update="upValue"></input-type>
        <input-type :content="formInfo.dateEvenement" baseclass="col-xl-3 col-md-6" @update="upValue"></input-type>
        <input-type :content="formInfo.dureeEvenement" baseclass="col-xl-3 col-md-6" @update="upValue"></input-type>
      </div>
      <div class="row">
        <div class="col-lg-3">
          <input-type :content="formInfo.nombreParticipantsWings" @update="upValue"></input-type>
        </div>
        <div class="col-lg-3">
          <input-type :content="formInfo.nombreParticipantsExterne" @update="upValue"></input-type>
        </div>
      </div>
      <div class="row">
        <div class="col-md-9" id="map" style="">
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
        <div class="col-md-3">
          <label for="latitude" class="form-label required">Latitude</label>
          <input type="text" class="form-control" name="latitude" id="latitude" step="0.0000001" v-model="sub.latitude" required disabled>
          <label for="longitude" class="form-label required">Longitude</label>
          <input type="text" class="form-control" name="longitude" id="longitude" step="0.0000001" v-model="sub.longitude" required disabled>
          <label for="pays" class="form-label">Pays</label>
          <input type="text" class="form-control" name="pays" id="pays" v-model="sub.pays" disabled>
        </div>
        <div class="col-lg-6">
          <label for="crew" class="form-label">Crew de dépoll</label>
          <div class="form-check">
            <input class="form-check-input" type="checkbox" name="crew" id="Kraken" value="Kraken" v-model="sub.crew">
            <label class="form-check-label" for="Kraken">Kraken</label>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="checkbox" name="crew" id="Etang de Berre" value="Etang de Berre" v-model="sub.crew">
            <label class="form-check-label" for="Etang de Berre">Etang de Berre</label>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="checkbox" name="crew" id="Amadeus" value="Amadeus" v-model="sub.crew">
            <label class="form-check-label" for="Amadeus">l'Amadeus</label>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="checkbox" name="crew" id="Antenne de Paris" value="Antenne de Paris" v-model="sub.crew">
            <label class="form-check-label" for="Antenne de Paris">Antenne de Paris</label>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="checkbox" name="crew" id="Antenne de Lyon" value="Antenne de Lyon" v-model="sub.crew">
            <label class="form-check-label" for="Antenne de Lyon">Antenne de Lyon</label>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="checkbox" name="crew" id="Antenne du Havre" value="Antenne du Havre" v-model="sub.crew">
            <label class="form-check-label" for="Antenne du Havre">Antenne du Havre</label>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="checkbox" name="crew" id="Depoll Pirate" value="Depoll Pirate" v-model="sub.crew">
            <label class="form-check-label" for="Depoll Pirate">Dépoll Pirate</label>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="checkbox" name="autre" id="AutreCrew">
            <label class="form-check-label" for="AutreCrew">Autre</label>
          </div>
          <div class="hide" id="autreCrewInput">
            <input type="text" class="form-control" name="crew">
          </div>
        </div>
      </div>
      <div class="row">
        <input-type :content="formInfo.autresStructures" baseclass="col-xl-3 col-md-6" @update="upValue"></input-type>
      </div>
      <h3>Info sur le lieu</h3>
      <div class="row">
        <input-type :content="formInfo.longueur" baseclass="col-lg-3" @update="upValue"></input-type>
        <input-type :content="formInfo.surface" baseclass="col-lg-3" @update="upValue"></input-type>
        <div class="col-lg-6">
          <label :for="formInfo.typeLieu.name" class="form-label" :class="{required: formInfo.typeLieu.req}">{{ formInfo.typeLieu.label }}</label>
          <pop-help :content="formInfo.typeLieu.help"></pop-help>
          <select class="form-select" name="typeLieu" v-model="sub.typeLieu" required>
              <option value="none" selected disabled hidden>Selectionez une option</option>
            <optgroup :label="group" v-for="group in formInfo.typeLieu.groups">
              <option :value="value" v-for="value in formInfo.typeLieu.values[group]"> {{ value }} </option>
            </optgroup>
          </select>
        </div>
      </div>
      <div class="row">
        <input-type :content="formInfo.typesDechet" baseclass="col" @update="upValue"></input-type>
        <input-type :content="formInfo.activites" baseclass="col" @update="upValue"></input-type>
      </div>
      <input-type :content="formInfo.frequentation" baseclass="col" @update="upValue"></input-type>
      <h3>Etat du terrain après dépollution</h3>
      <input-type :content="formInfo.quantiteDechet" baseclass="col" @update="upValue"></input-type>
      <input-type :content="formInfo.pourquoiIlEnReste" baseclass="col" @update="upValue"></input-type>
      <div class="row">
        <div class="col-lg-6">
          <label for="commentaire" class="form-label">Commentaire</label>
          <pop-help :content="formInfo.commentaire.help"></pop-help>
          <textarea name="commentaire" class="form-control" id="commentaire" v-model.lazy="sub.commentaire"></textarea>
        </div>
        <h3>Caractérisation des Déchets</h3>
        <div class="col-lg-6">
          <label :for="formInfo.DechetIndicateur.name" class="form-label">{{ formInfo.DechetIndicateur.label }}</label>
          <pop-help :content="formInfo.DechetIndicateur.help"></pop-help>
          <select class="form-select" :name="formInfo.DechetIndicateur.name" id="indicateur" v-model="DechetIndicateur">
            <option :value="sel" selected v-for="sel in formInfo.DechetIndicateur.valueSel"> {{ sel }} </option>
          </select>
        </div>
        <div class="col-lg-6" v-if="DechetIndicateur == 'Niveau 1' || DechetIndicateur == 'Niveau 2'">
          <table class="table">
            <thead>
              <tr>
                <th></th>
                <th width=120> Quantité </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="niv1 in formInfo.DechetIndicateur.value1">
                <th>{{ niv1[1] }}</th>
                <td>
                  <input type="number" class="form-control" :name="niv1[0]" v-model.lazy="sub.ValeurIndicateur.niv1[niv1[0]]">
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="col-lg-6" v-if="DechetIndicateur == 'Niveau 2'">
          <table class="table">
            <thead>
              <tr>
                <th></th>
                <th width=120> Quantité </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="niv2 in formInfo.DechetIndicateur.value2">
                <th>{{ niv2[1] }}</th>
                <td>
                  <input type="number" class="form-control" :name="niv2[0]" v-model.lazy="sub.ValeurIndicateur.niv2[niv2[0]]">
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="row">
        <div class="col-6">
          <table class="table">
            <thead>
              <th></th>
              <th width=100>Poids (Kg) </th>
              <th width=100>Volume (L) </th>
            </thead>
            <tbody>
              <tr v-for="material in formInfo.DechetQuantitatif.value">
                <th>{{ material.label }} <pop-help :content="material.help"></pop-help></th>
                <td>
                  <input type="number" class="form-control" :name="'poids' + material.name" v-model.lazy="sub.ValeurQuantitatif.poids[material.name]" step="0.001">
                </td>
                <td>
                  <input type="number" class="form-control" :name="'volume' + material.name" v-model.lazy="sub.ValeurQuantitatif.volume[material.name]" step="0.1">
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="row">
        <div class="col-6">
          <label :for="formInfo.nbDechetSpecifique.name" class="form-label">{{ formInfo.nbDechetSpecifique.label }}</label>
          <pop-help :content="formInfo.nbDechetSpecifique.help"></pop-help>
          <select class="form-select" :name="formInfo.nbDechetSpecifique.name" :id="formInfo.nbDechetSpecifique.name" v-model="nbDechetSpecifique">
            <option :value="0" selected>Aucun</option>
            <option :value="nb" v-for="nb in range(formInfo.nbDechetSpecifique.maxValue, 1)">{{ nb }}</option>
          </select>
        </div>
      </div>
      <div v-for="index in range(nbDechetSpecifique)">
        <dechet-specifique :num="index + 1" :content="formInfo.DechetSpecifique" @update="upValue"></dechet-specifique>
      </div>
      <button class="btn btn-primary" type="submit" @click.prevent="submission">Soumission</button>
    </form>
  </div>
</template>

<script>
import PopHelp from './PopHelp.vue'
import InputType from './InputType.vue'
import DechetSpecifique from './DechetSpecifique.vue'
import formInfo from '@/assets/json/formInfo.json'
import { latLng, icon } from "leaflet"
import { LMap, LTileLayer, LMarker, LTooltip } from 'vue2-leaflet'

export default {
  name: 'Form',
  components: {
    PopHelp,
    InputType,
    DechetSpecifique,
    LMap,
    LTileLayer,
    LMarker,
    LTooltip
  }, data () {
    return {
      formInfo,
      position: {},
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
      DechetIndicateur: '',
      nbDechetSpecifique: 0,
      sub: {
        lieu: '',
        ville: '',
        dateEvenement: '',
        dureeEvenement: '',
        nombreParticipantsWings: '',
        nombreParticipantsExterne: '',
        latitude: '',
        longitude: '',
        pays: '',
        crew: [],
        autresStructures: '',
        longueur: '',
        surface: '',
        typeLieu: '',
        typesDechet: [],
        activites: [],
        frequentation: '',
        quantiteDechet: '',
        pourquoiIlEnReste: [],
        commentaire: '',
        ValeurIndicateur: {niv1: {}, niv2: {}},
        ValeurQuantitatif: {poids: {}, volume: {}},
        nbDechetSpecifique: 0,
        nomDS: [],
        volumeDS: [],
        descDS: [],
        volEstDS: [],
        provenanceDS: [],
        commentaireDS: [],
        poidsDS: [],
        nombreDS: [],
      },
    }
  }, watch: {
    position: {
      deep: true,
      async handler(value) {
        this.mapAtt.address = await this.getAddress();
        this.sub.latitude = +(value.lat.toFixed(7))
        this.sub.longitude = +(value.lng.toFixed(7))
      }
    }, nbDechetSpecifique: {
      handler(value) {
        this.sub.nbDechetSpecifique = value
        for (let val of ["nomDS", "volumeDS", "descDS", "volEstDS", "provenanceDS", "commentaireDS", "poidsDS", "nombreDS"]) {
          if (this.sub[val].length < value) {
            while (this.sub[val].length < value) {
              if (val == "provenanceDS") {
                this.sub[val].push([])
              } else {
                this.sub[val].push("")
              }
            }
          } else if (this.sub[val].length > value) {
            this.sub[val] = this.sub[val].slice(0, value)
          }
        }
      }
    }
  }, computed: {
    tooltipContent() {
      if (this.mapAtt.dragging) return "...";
      if (this.mapAtt.loading) return "Loading...";
      return `<strong>${this.mapAtt.address.replace(
        ",",
        "<br/>")}`;
    }
  }, methods: {
    async getAddress() {
      this.mapAtt.loading = true;
      var address = "adressage impossible";
      try {
        const { lat, lng } = this.position;
        const result = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
        );
        if (result.status === 200) {
          const body = await result.json();
          if (body.display_name != undefined) {
            address = body.display_name
            this.sub.pays = body.address.country
          }
        }
      } catch (e) {
        console.error("Reverse Geocode Error->", e);
      } finally {
        this.mapAtt.loading = false;
        return address;
      }
    }, onMapClick(value) {
      // place the marker on the clicked spot
      this.position = value.latlng;
    }, upValue(value, target, dechSpe = false) {
      if (dechSpe) {
        this.sub[target][dechSpe - 1] = value
      } else {
        this.sub[target] = value
      }
    }, range(size, startAt = 0) {
    return [...Array(size).keys()].map(i => i + startAt);
    }, submission() {
      this.$http.post('api/form', this.sub).then(
        (response) => {
          this.$router.push({ name: 'FilledForm' })
        }, (response) => {
          window.alert("le formulaire n'est pas correctement rempli, veuillez vérifier les champs, sinon contactez moi : jayma")
        }
      )
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
    height: 60vh;
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .leaflet-tooltip {
    left: 15px;
  }
</style>
