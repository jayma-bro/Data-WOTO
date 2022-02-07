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
      </div>
      <div class="row bigblock d-flex justify-content-between">
        <div class="col-xl-3 col-md-6">
          <h5>{{ formInfo.crew.label }}</h5>
          <pop-help :content="formInfo.crew.help"></pop-help>
          <div class="">
            <label for="crewType">Type</label>
            <div class="form-check" v-for="val of formInfo.crew.crewType" :key="val.id">
              <input class="form-check-input" type="radio" name="crewType" :id="val.crewValue" :value="val.crewValue" v-model="crewType" @click="resetCrewName">
              <label class="form-check-label" :for="val.crewValue">{{ val.name }}</label>
            </div>
          </div>
          <div class="">
            <label for="crewName">Nom</label>
            <select class="form-select" name="crewName" id="crewName" v-model="crewName">
              <option value="none" selected disabled hidden>Aucun</option>
              <option :value="crew" v-for="crew of crewList[crewType]"  :key="crew.id">{{ crew }}</option>
            </select>
          </div>
          <button type="button" class="btn btn-primary" name="crewAdd" @click="crewAdd">Valider</button>
        </div>
        <div class="col-xl-3 col-md-6">
          <button type="button" class="btn btn-success" name="newCrew" v-if="!newCrew" @click="crewFormDisplay">Nouveau Crew</button>
          <div class="" v-else>
            <div class="">
              <label for="crewTypeNew">Type</label>
              <div class="form-check" v-for="val of formInfo.crew.crewType"  :key="val.id">
                <input class="form-check-input" type="radio" name="crewTypeNew" :id="val.crewValue + 'New'" :value="val.crewValue" v-model="createdCrew.crewType">
                <label class="form-check-label" :for="val.crewValue + 'New'">{{ val.name }}</label>
              </div>
            </div>
            <div class="">
              <label for="crewNameNew">Nom</label>
              <input type="text" class="form-control" name="crewNameNew" v-model="createdCrew.crewName">
            </div>
            <button type="button" class="btn btn-success" name="createCrew" @click="createCrew">Valider</button>
            <button type="button" class="btn btn-warning" name="newCrew" @click="crewFormDisplay">Annuler</button>
          </div>
          <div class="alert alert-success" v-if="crewCreateSuccess">
            <img class="position-absolute top-0 end-0" src="@/assets/img/ui-close.svg" alt="" height="15" @click="close('crewCreateSuccess')">
            le nouveau crew a bien été enregistré
          </div>
          <div class="alert alert-danger" v-if="crewCreateError">
            <img class="position-absolute top-0 end-0" src="@/assets/img/ui-close.svg" alt="" height="15" @click="close('crewCreateError')">
            le nouveau crew n'a pas pu être enregistré
          </div>
        </div>
      </div>
      <div class="row d-flex justify-content-around">
        <div class="crewItem col-2" v-for="crewInd of range(nbCrew)"  :key="crewInd.id">
          <p><em>{{ formInfo.crew.crewType.find(elem => elem.crewValue == sub.crewType[crewInd]).name }}</em> <br> <strong>{{ sub.crewName[crewInd] }}</strong></p>
          <button type="button" class="btn btn-warning" name="newCrew" @click="removeCrew(crewInd)">Retirer</button>
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
            <optgroup :label="group" v-for="group in formInfo.typeLieu.groups"  :key="group.id">
              <option :value="value" v-for="value in formInfo.typeLieu.values[group]"  :key="value.id"> {{ value }} </option>
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
          <textarea name="commentaire" class="form-control" id="commentaire" v-model="sub.commentaire"></textarea>
        </div>
        <h3>Caractérisation des Déchets</h3>
        <div class="col-lg-6">
          <label :for="formInfo.DechetIndicateur.name" class="form-label">{{ formInfo.DechetIndicateur.label }}</label>
          <pop-help :content="formInfo.DechetIndicateur.help"></pop-help>
          <select class="form-select" :name="formInfo.DechetIndicateur.name" id="indicateur" v-model="DechetIndicateur">
            <option :value="sel" selected v-for="sel in formInfo.DechetIndicateur.valueSel"  :key="sel.id"> {{ sel }} </option>
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
              <tr v-for="niv1 in formInfo.DechetIndicateur.value1" :key="niv1.id">
                <th>{{ niv1[1] }}</th>
                <td>
                  <input type="number" class="form-control" :name="niv1[0]" v-model="sub.ValeurIndicateur.niv1[niv1[0]]">
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
              <tr v-for="niv2 in formInfo.DechetIndicateur.value2" :key="niv2.id">
                <th>{{ niv2[1] }}</th>
                <td>
                  <input type="number" class="form-control" :name="niv2[0]" v-model="sub.ValeurIndicateur.niv2[niv2[0]]">
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
              <tr v-for="material in formInfo.DechetQuantitatif.value" :key="material.id">
                <th>{{ material.label }} <pop-help :content="material.help"></pop-help></th>
                <td>
                  <input type="number" class="form-control" :name="'poids' + material.name" v-model="sub.ValeurQuantitatif.poids[material.name]" step="0.001">
                </td>
                <td>
                  <input type="number" class="form-control" :name="'volume' + material.name" v-model="sub.ValeurQuantitatif.volume[material.name]" step="0.1">
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
            <option :value="nb" v-for="nb in range(formInfo.nbDechetSpecifique.maxValue, 1)" :key="nb.id">{{ nb }}</option>
          </select>
        </div>
      </div>
      <div v-for="index in range(nbDechetSpecifique)" :key="index.id">
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
      crewType: '',
      crewName: '',
      nbCrew: 0,
      crewList: {
        antenneLocal: [],
        missions: [],
        labels: []
      },
      createdCrew: {
        crewName: '',
        crewType: ''
      },
      crewCreateSuccess: false,
      crewCreateError: false,
      newCrew: false,
      dis: 'disabled',
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
        crewName: [],
        crewType: [],
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
    }, DechetIndicateur: {
      handler(value) {
        if (value == "Aucun") {
          for (let niv1 of formInfo.DechetIndicateur.value1) {
            this.sub.ValeurIndicateur.niv1[niv1[0]] = null
          }
          for (let niv2 of formInfo.DechetIndicateur.value2) {
            this.sub.ValeurIndicateur.niv2[niv2[0]] = null
          }
        } else if (value == "Niveau 1") {
          for (let niv2 of formInfo.DechetIndicateur.value2) {
            this.sub.ValeurIndicateur.niv2[niv2[0]] = null
          }
        }
      }
    }
  }, computed: {
    tooltipContent() {
      if (this.mapAtt.dragging) return "..."
      if (this.mapAtt.loading) return "Loading..."
      return `<strong>${this.mapAtt.address.replace(
        ",",
        "<br/>")}`
    }
  }, mounted () {
    this.$http.get('api/crew').then((res) => {
      for (var crew of res.data) {
        this.crewList[crew.crewType].push(crew.crewName)
      }
    }, (res) => {
      console.log(res)
    })
    for (let niv1 of formInfo.DechetIndicateur.value1) {
      this.sub.ValeurIndicateur.niv1[niv1[0]] = null
    }
    for (let niv2 of formInfo.DechetIndicateur.value2) {
      this.sub.ValeurIndicateur.niv2[niv2[0]] = null
    }
    for (let material of formInfo.DechetQuantitatif.value) {
      this.sub.ValeurQuantitatif.poids[material.name] = null
      this.sub.ValeurQuantitatif.volume[material.name] = null
    }
  }, methods: {
    async getAddress() {
      this.mapAtt.loading = true
      let address = "adressage impossible"
      let pays = ""
      try {
        const { lat, lng } = this.position;
        const result = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
        );
        if (result.status === 200) {
          const body = await result.json()
          if (body.display_name != undefined) {
            address = body.display_name
            pays = body.address.country
          }
        }
      } catch (e) {
        console.error("Reverse Geocode Error->", e)
      }
      this.mapAtt.loading = false
      this.sub.pays = pays
      return address
    }, onMapClick(value) {
      // place the marker on the clicked spot
      this.position = value.latlng
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
        () => {
          this.$router.push({ name: 'FilledForm' })
        }, () => {
          window.alert("le formulaire n'est pas correctement rempli, veuillez vérifier les champs, sinon contactez moi : jayma")
        }
      )
    }, createCrew() {
      this.$http.post('api/crew', this.createdCrew).then(
        () => {
          this.crewCreateSuccess = true
          this.createdCrew = {crewName: '', crewType: ''}
          this.crewFormDisplay()
          this.crewList = {antenneLocal: [], missions: [], labels: []}
          this.$http.get('api/crew').then((res) => {
            for (var crew of res.data) {
              this.crewList[crew.crewType].push(crew.crewName)
            }
          }, (res) => {
            console.log(res)
          })
        }, (error) => {
          console.log(error)
          this.crewCreateError = true
        }
      )
    }, crewFormDisplay() {
      this.newCrew = !this.newCrew
      this.dis = ''
    }, close(valClose) {
      this[valClose] = false
    }, resetCrewName() {
      this.crewName = ''
    }, crewAdd() {
      this.sub.crewName.unshift(this.crewName)
      this.sub.crewType.unshift(this.crewType)
      this.crewName = ''
      this.crewType = ''
      this.nbCrew++
    }, removeCrew(crewInd) {
      this.sub.crewName.splice(crewInd, 1)
      this.sub.crewType.splice(crewInd, 1)
      this.nbCrew--
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

  .crewItem {
    border: solid;
    border-radius: 1rem;
    border-width: thin;
    background-color: rgb(228, 228, 228);
    margin: 10px;
    padding: 15px;
  }

  .bigblock {
    border: solid;
    border-radius: 1rem;
    border-width: thin;
    padding: 15px;
  }
</style>
