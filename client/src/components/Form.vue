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
            <div class="form-check" v-for="val of crewTypeList" :key="val.id">
              <input class="form-check-input" type="radio" name="crewType" :id="val.value" :value="val.value" v-model="crewType" @click="resetCrewName">
              <label class="form-check-label" :for="val.value">{{ val.name }}</label>
            </div>
          </div>
          <div class="">
            <label for="crewName">Nom</label>
            <select class="form-select" name="crewName" id="crewName" v-model="crew">
              <option value="none" selected disabled hidden>Aucun</option>
              <option :value="crew" v-for="crew of crewList[crewType]"  :key="crew.id">{{ crew.name }}</option>
            </select>
          </div>
          <button type="button" class="btn btn-primary" name="crewAdd" @click="crewAdd">Valider</button>
        </div>
        <div class="col-xl-3 col-md-6">
          <button type="button" class="btn btn-success" name="newCrew" v-if="!newCrew" @click="crewFormDisplay">Nouveau Crew</button>
          <div class="" v-else>
            <div class="">
              <label for="crewTypeNew">Type</label>
              <div class="form-check" v-for="val of crewTypeList"  :key="val.id">
                <input class="form-check-input" type="radio" name="crewTypeNew" :id="val.value + 'New'" :value="val._id" v-model="createdCrew.crewTypeId">
                <label class="form-check-label" :for="val.value + 'New'">{{ val.name }}</label>
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
        <div class="crewItem col-2" v-for="crew of crewPickList"  :key="crew.id">
          <p><em>{{ crew.type }}</em> <br> <strong>{{ crew.name }}</strong></p>
          <button type="button" class="btn btn-warning" name="newCrew" @click="removeCrew(crew)">Retirer</button>
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
          <label :for="formInfo.dechetIndicateur.name" class="form-label">{{ formInfo.dechetIndicateur.label }}</label>
          <pop-help :content="formInfo.dechetIndicateur.help"></pop-help>
          <select class="form-select" :name="formInfo.dechetIndicateur.name" id="indicateur" v-model="dechetIndicateur">
            <option :value="sel.value" selected v-for="sel in formInfo.dechetIndicateur.valueSel"  :key="sel.id"> {{ sel.label }} </option>
          </select>
        </div>
        <div class="col-lg-6" v-if="dechetIndicateur == 'reMed2' || dechetIndicateur == 'reMed3'">
          <table class="table">
            <thead>
              <tr>
                <th></th>
                <th width=120> Quantité </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="niv1 in formInfo.dechetIndicateur.value1" :key="niv1.id">
                <th>{{ niv1[1] }}</th>
                <td>
                  <input type="number" class="form-control" :name="niv1[0]" v-model="sub.valeurIndicateur.niv1[niv1[0]]">
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="col-lg-6" v-if="dechetIndicateur == 'reMed3'">
          <table class="table">
            <thead>
              <tr>
                <th></th>
                <th width=120> Quantité </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="niv2 in formInfo.dechetIndicateur.value2" :key="niv2.id">
                <th>{{ niv2[1] }}</th>
                <td>
                  <input type="number" class="form-control" :name="niv2[0]" v-model="sub.valeurIndicateur.niv2[niv2[0]]">
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
              <tr v-for="material in formInfo.dechetQuantitatif.value" :key="material.id">
                <th>{{ material.label }} <pop-help :content="material.help"></pop-help></th>
                <td>
                  <input type="number" class="form-control" :name="'poids' + material.name" v-model="sub.valeurQuantitatif.poids[material.name]" step="0.001">
                </td>
                <td>
                  <input type="number" class="form-control" :name="'volume' + material.name" v-model="sub.valeurQuantitatif.volume[material.name]" step="0.1">
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- <div class="row">
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
        <dechet-specifique :num="index + 1" :content="formInfo.dechetSpecifique" @update="upValue"></dechet-specifique>
      </div> -->
      <h3>Déchets Spécifiques</h3>
      <div class="form-check">
        <input class="form-check-input" type="checkbox" name="ifDS" id="ifDS" v-model="ifDS">
        <label class="form-check-label" for="ifDS"> enregistrer des déchets spécifique ?</label>
        <pop-help :content="formInfo.nbDechetSpecifique.help"></pop-help>
      </div>
      <div class="row" v-if="ifDS">
        <dechet-specifique :content="formInfo.dechetSpecifique" @update="upValue" @dsadd="dsAdd"></dechet-specifique>
        <div class="col-6 d_specifique" v-for="dsItem in sub.dechetSpecifique" :key="dsItem.id">
          <strong>{{ dsItem.nomDS }}</strong> avec un volume de {{ dsItem.volumeDS }}<br>
          <em>{{ dsItem.descDS }}</em><br>
          <p>{{ dsItem.volEstDS }} {{ dsItem.provenanceDS }}</p><br>
          {{ dsItem.commentaireDS }}<br>
          {{ dsItem.poidsDS }}
          <button type="button" class="btn btn-warning" name="newCrew" @click="removeDS(dsItem.nomDS)">Retirer</button>
        </div>
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
      dechetIndicateur: '',
      ifDS: false,
      crewType: '',
      crew: {},
      crewTypeList: [],
      crewList: {},
      crewPickList: [],
      createdCrew: {
        crewName: '',
        crewTypeId: ''
      },
      ds: {
        nomDS: '',
        volumeDS: '',
        descDS: '',
        volEstDS: '',
        provenanceDS: [],
        commentaireDS: '',
        poidsDS: '',
        nombreDS: '',
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
        crewId: [],
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
        valeurIndicateur: {niv1: {}, niv2: {}},
        valeurQuantitatif: {poids: {}, volume: {}},
        dechetSpecifique: [],
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
    }, dechetIndicateur: {
      handler(value) {
        if (value == "Aucun") {
          for (let niv1 of formInfo.dechetIndicateur.value1) {
            this.sub.valeurIndicateur.niv1[niv1[0]] = null
          }
          for (let niv2 of formInfo.dechetIndicateur.value2) {
            this.sub.valeurIndicateur.niv2[niv2[0]] = null
          }
        } else if (value == "Niveau 1") {
          for (let niv2 of formInfo.dechetIndicateur.value2) {
            this.sub.valeurIndicateur.niv2[niv2[0]] = null
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
      this.crewTypeList = res.data.crewType
      const crewList = {}
      for (let crewType of res.data.crewType) {
        crewList[crewType.value] = []
      }
      for (let crew of res.data.crew) {
        crewList[crew.crewTypeId.value].push({name: crew.crewName, type: crew.crewTypeId.name, _id: crew._id})
      }
      this.crewList = crewList
    }, (res) => {
      console.log(res)
    })
    for (let niv1 of formInfo.dechetIndicateur.value1) {
      this.sub.valeurIndicateur.niv1[niv1[0]] = null
    }
    for (let niv2 of formInfo.dechetIndicateur.value2) {
      this.sub.valeurIndicateur.niv2[niv2[0]] = null
    }
    for (let material of formInfo.dechetQuantitatif.value) {
      this.sub.valeurQuantitatif.poids[material.name] = null
      this.sub.valeurQuantitatif.volume[material.name] = null
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
        this.ds[target] = value
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
        (res) => {
          const index = this.crewTypeList.findIndex((value) => value._id == res.body.crew.crewTypeId)
          this.crew = { name: res.body.crew.crewName, type: this.crewTypeList[index].name, _id: res.body.crew._id}
          
          this.crewAdd()
          this.crewCreateSuccess = true
          this.crewFormDisplay()
          this.$http.get('api/crew').then((res) => {
          const crewList = {}
          for (let crewType of res.data.crewType) {
            crewList[crewType.value] = []
          }
          for (let crew of res.data.crew) {
            crewList[crew.crewTypeId.value].push({name: crew.crewName, type: crew.crewTypeId.name, _id: crew._id})
          }
          this.crewList = crewList
          }, (res) => {
            console.log(res)
          })
        }, (error) => {
          console.log(error)
          this.crewCreateError = true
        }
      )
      this.createdCrew = {crewName: '', crewTypeId: ''}
    }, crewFormDisplay() {
      this.newCrew = !this.newCrew
      this.dis = ''
    }, close(valClose) {
      this[valClose] = false
    }, resetCrewName() {
      this.crew = {}
    }, crewAdd() {
      this.sub.crewId.unshift(this.crew._id)
      this.crewPickList.unshift(this.crew)
      this.crew = {}
      this.crewType = ''
    }, removeCrew(crew) {
      const index = this.crewPickList.indexOf(crew)
      if (index !== -1) {
        this.sub.crewId.splice(index, 1)
        this.crewPickList.splice(index, 1)
      }
    }, removeDS(nomDS) {
      const index = this.sub.dechetSpecifique.findIndex((value) => value.nomDS == nomDS)
      if (index !== -1) {
        this.sub.dechetSpecifique.splice(index, 1)
      }
    }, dsAdd() {
      this.sub.dechetSpecifique.unshift(this.ds)
      this.ds = {
        nomDS: '',
        volumeDS: '',
        descDS: '',
        volEstDS: '',
        provenanceDS: [],
        commentaireDS: '',
        poidsDS: '',
        nombreDS: '',
      }
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

  .d_specifique {
    border: solid;
    border-radius: 1rem;
    border-width: thin;
    background-color: rgb(228, 228, 228);
    margin: 20px 0;
    padding: 20px;
  }
</style>
