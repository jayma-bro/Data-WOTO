<template>
  <div class="form">
    <form  action="" method="post" accept-charset="utf-8" autocomplete="on" name="formulaire depoll" class="needs-validation" novalidate>
      <h1>Formulaire</h1>
      <div class="row">
        <input-type :content="formInfo.dateEvenement" baseclass="col-xl-3 col-md-6" @update="upValue"></input-type>
        <input-type :content="formInfo.dureeEvenement" baseclass="col-xl-3 col-md-6" @update="upValue"></input-type>
        <div class="col-lg-3">
          <input-type :content="formInfo.nombreParticipantsWings" @update="upValue"></input-type>
        </div>
        <div class="col-lg-3">
          <input-type :content="formInfo.nombreParticipantsExterne" @update="upValue"></input-type>
        </div>
      </div>
      <div class="row">
        <map-view  class="col-md-9" id="mapSpace" @update="updateLieu">
        </map-view>
        <fade-loader v-if='loading' class="position-absolute top-50 start-50"></fade-loader>
        <div class="col-md-3">
          <p>
          <strong>Nom</strong> : {{ lieu.lieu }} <br>
          <strong>Type</strong> : {{ lieu.typeLieu }} <br>
          <strong>Lat</strong> : {{ lieu.localisation[0] }} <br>
          <strong>Lng</strong> : {{ lieu.localisation[1] }} <br>
          <strong>Pays</strong> : {{ lieu.pays }} <br>
          <strong>Longueur</strong> : {{ lieu.longueur }}m <br>
          <strong>Surface</strong> : {{ lieu.surface }}m² <br>
          </p>
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
                  <input type="number" class="form-control" :name="niv1[0]" v-model="sub.dechetIndicateur[niv1[0]]">
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
                  <input type="number" class="form-control" :name="niv2[0]" v-model="sub.dechetIndicateur[niv2[0]]">
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
                  <input type="number" class="form-control" :name="'poids' + material.name" v-model="sub.valeurQuantitatif.poids['poids'+material.name]" step="0.001">
                </td>
                <td>
                  <input type="number" class="form-control" :name="'volume' + material.name" v-model="sub.valeurQuantitatif.volume['volume'+material.name]" step="0.1">
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
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
import FadeLoader from 'vue-spinner/src/FadeLoader.vue'
import PopHelp from './PopHelp.vue'
import InputType from './InputType.vue'
import MapView from './MapView.vue'
import DechetSpecifique from './DechetSpecifique.vue'
import formInfo from '@/assets/json/formInfo.json'

export default {
  name: 'Form',
  components: {
    PopHelp,
    InputType,
    MapView,
    DechetSpecifique,
    FadeLoader,
  }, data () {
    return {
      formInfo,
      loading: false,
      address: null,
      addressText: null,
      dechetIndicateur: null,
      ifDS: false,
      crewType: null,
      crew: {},
      crewTypeList: [],
      crewList: {},
      crewPickList: [],
      createdCrew: {
        crewName: null,
        crewTypeId: null
      },
      ds: {
        nomDS: null,
        volumeDS: null,
        descDS: null,
        volEstDS: null,
        provenanceDS: [],
        commentaireDS: null,
        poidsDS: null,
        nombreDS: null,
      },
      lieu: {
        _id: null,
        lieu: null,
        ville: null,
        localisation: [null],
        polyline: null,
        polygon: null,
        pays: null,
        longueur: null,
        surface: null,
        typeLieu: null,

      },
      crewCreateSuccess: false,
      crewCreateError: false,
      newCrew: false,
      dis: 'disabled',
      sub: {
        dateEvenement: null,
        lieuId: null,
        dureeEvenement: null,
        nombreParticipantsWings: null,
        nombreParticipantsExterne: null,
        crewId: [],
        autresStructures: null,
        typesDechet: [],
        activites: [],
        frequentation: null,
        quantiteDechet: null,
        pourquoiIlEnReste: [],
        commentaire: null,
        dechetIndicateur: {},
        valeurQuantitatif: {poids: {}, volume: {}},
        dechetSpecifique: [],
      },
    }
  }, watch: {
    dechetIndicateur: {
      handler(value) {
        if (value == "Aucun") {
          for (let niv1 of formInfo.dechetIndicateur.value1) {
            this.sub.dechetIndicateur[niv1[0]] = null
          }
          for (let niv2 of formInfo.dechetIndicateur.value2) {
            this.sub.dechetIndicateur[niv2[0]] = null
          }
        } else if (value == "Niveau 1") {
          for (let niv2 of formInfo.dechetIndicateur.value2) {
            this.sub.dechetIndicateur[niv2[0]] = null
          }
        }
      }
    }
  }, computed: {
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
      this.sub.dechetIndicateur[niv1[0]] = null
    }
    for (let niv2 of formInfo.dechetIndicateur.value2) {
      this.sub.dechetIndicateur[niv2[0]] = null
    }
    for (let material of formInfo.dechetQuantitatif.value) {
      this.sub.valeurQuantitatif.poids['poids'+material.name] = null
      this.sub.valeurQuantitatif.volume['volume'+material.name] = null
    }
  }, methods: {
    upValue(value, target, dechSpe = false) {
      if (dechSpe) {
        this.ds[target] = value
      } else {
        this.sub[target] = value
      }
    }, updateLieu(lieu) {
      this.lieu = lieu
      this.sub.lieuId = lieu._id
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

  #mapSpace {
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
