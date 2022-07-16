<template>
  <div class="form container">
    <form  action="" method="post" accept-charset="utf-8" autocomplete="on" name="formulaire depoll" class="needs-validation" novalidate>
      <h1>Formulaire</h1><br>
      <router-link :to="{ name: 'Home'}">Retour à l'acceuil</router-link>
      <div class="row">
        <input-type :content="formInfo.dateEvenement" baseclass="col-xl-3 col-md-6" @update="upValue"></input-type>
        <input-type :content="formInfo.dureeEvenement" baseclass="col-xl-3 col-md-6" @update="upValue"></input-type>
        <div class="col-xl-3 col-md-6">
          <input-type :content="formInfo.nombreParticipantsWings" @update="upValue"></input-type>
        </div>
        <div class="col-xl-3 col-md-6">
          <input-type :content="formInfo.nombreParticipantsExterne" @update="upValue"></input-type>
        </div>
      </div>
      <div class="row">
        <p>
          Selectionnez sur le lieu de dépollution sur la carte, s'il n'y est pas renseigné le par <router-link :to="{ name: 'LieuForm'}">ce formulaire !</router-link>
        </p>
      </div>
      <div class="row">
        <map-view  class="col-md-9" id="mapSpace" :config="{
          show: 'lieux',
          edit: false,
          poly: true,
          modif: changeSurface
        }" @update="updateLieu" @uppoly="updatePoly">
        </map-view>
        <fade-loader v-if='loading' class="position-absolute top-50 start-50"></fade-loader>
        <div class="col-md-3">
          <p>
            <H3>Information sur le lieu selectioné</H3>
            <strong>Nom</strong> : {{ lieu.lieu }} <br>
            <strong>Type</strong> : {{ lieu.typeLieu }} <br>
            <strong>Lat</strong> : {{ lieu.localisation[0] }} <br>
            <strong>Lng</strong> : {{ lieu.localisation[1] }} <br>
            <strong>Pays</strong> : {{ lieu.pays }} <br>
            <strong>Longueur</strong> : {{ lieu.longueur }}m <br>
            <strong>Surface</strong> : {{ lieu.surface }}m² <br>
          </p>
        </div>
        <div class="col-md-3">
          <label class="form-check-label" for="changeSurface">Modifier la zone dépolluée et/ou surface</label>
          <input type="checkbox" name="changeSurface" id="changeSurface" v-model="changeSurface">
          <div v-if="changeSurface">
            <label class="form-check-label" for="newLongueur">Longueur ajusté à la dépoll</label>
            <input type="number" name="newLongueur" id="newLongueur" step="0.1" v-model="sub.longueur">
            <label class="form-check-label" for="newSurface">Surface ajusté à la dépoll</label>
            <input type="number" name="newSurface" id="newSurface" step="0.1" v-model="sub.surface">
          </div>
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
          <div v-if="!newCrew">
            <p>
              si votre label n'est pas présent dans la liste, <br>
              renseignez-le par ce petit formulaire.
            </p>
            <button type="button" class="btn btn-success" name="newCrew" @click="crewFormDisplay">Nouveau Label</button>
          </div>
          <div class="" v-else>
            <div class="">
              <label for="crewNameNew">Nom</label>
              <p>
                renseignez le nom que vous vous donnez (nom du bateau, de l'équipe, de l'organisme...)
              </p>
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
        <p>
          Chaque section de la caractérisation des déchets se fait indépendamment. <br>
          Les déchets qui sont caractérisés dans une partie ne se substituent pas aux autres. <br>
          ex : quand j'ai compté le nombre de bouteilles en plastique dans les déchets indicateurs, <br>
          je vais également mesurer leurs poids et volume (et je peux les renseigner en déchets <br>
          spécifique en plus dans le cas d'une marque prédominante par exemple)
        </p>
        <p>
          pensez bien dans cette partie du formulaire, qu'un '0' est différents d'une valeur null <br>
          '0' => je sais qu'il n'y a pas eu cette chose <br>
          (une valeur null) => je ne sais pas si elle y était ou non, et ni dans quelle proportion.
        </p>
        <div class="col-lg-6">
          <label :for="formInfo.dechetIndicateur.name" class="form-label"><h5>{{ formInfo.dechetIndicateur.label }}</h5></label>
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
          <h5>Déchets Quantitatif</h5>
          <p>
            même si la valeur est approximative, essayez de renseigner le plus d'information possible dans les déchets quantitatifs
          </p>
          <input-type :content="formInfo.selecDechetQuantitatif" baseclass="" @update="upQuanti"></input-type>
          <table class="table" v-if="dQ.volume">
            <thead>
              <th></th>
              <th  v-if="dQ.poid" width=100>Poids (Kg) </th>
              <th width=100>Volume (L) </th>
              <th width=100>Volumineux (L) <pop-help content="à y renseigner tous les déchets qui ne rentrent pas dans un sac"></pop-help></th>
            </thead>
            <tbody>
              <tr v-for="material in formInfo.dechetQuantitatif.value" :key="material.id">
                <th>{{ material.label }} <pop-help :content="material.help"></pop-help></th>
                <td v-if="dQ.poid">
                  <input type="number" class="form-control" :name="'poids' + material.name" v-model="sub.valeurQuantitatif.poids['poids'+material.name]" step="0.001">
                </td>
                <td>
                  <input type="number" class="form-control" :name="'volume' + material.name" v-model="sub.valeurQuantitatif.volume['volume'+material.name]" step="0.1">
                </td>
                <td>
                  <input type="number" class="form-control" :name="'volumineux' + material.name" v-model="sub.valeurQuantitatif.volumineux['volumineux'+material.name]" step="1">
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <h5>Déchets Spécifiques</h5>
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
      <button v-if="!submit" class="btn btn-primary" type="submit" @click.prevent="submission">Soumission</button>
      <button v-if="submit" class="btn btn-primary" disabled >Soumission en cour</button>

    </form>
  </div>
</template>

<script>
import FadeLoader from 'vue-spinner/src/FadeLoader.vue'
import PopHelp from './PopHelp.vue'
import InputType from './InputType.vue'
import DechetSpecifique from './DechetSpecifique.vue'
import formInfo from '@/assets/json/formInfo.json'
import MapView from './MapView.vue'
import * as turf from '@turf/turf'

export default {
  name: 'Form',
  components: {
    PopHelp,
    InputType,
    DechetSpecifique,
    FadeLoader,
    MapView,
  }, data () {
    return {
      formInfo,
      loading: false,
      submit: false,
      // cette variable (par une checkbox) permet d'activer ou désactiver la redéfinition de la surface
      changeSurface: false,
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
        crewTypeId: '6235c992fb2a4d3758e4f32d',
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
      dQ: {
        volume: true,
        poid: true,
      },
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
        valeurQuantitatif: {poids: {}, volume: {}, volumineux: {}},
        dechetSpecifique: [],
        // Les variable de la surface et longueur qui seront envoyer pour la soumition du formulaire
        // seulement quand elle à été retouché
        polyline: null,
        polygon: null,
        longueur: null,
        surface: null,
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
    }, changeSurface: {
      handler(value) {
        if (!value) {
          this.sub.polyline = null
          this.sub.polygon = null
          this.sub.longueur = null
          this.sub.surface = null
        }
      }
    }
  }, computed: {
  }, mounted () {
    this.$http.get('api/crew_types').then((res) => {
      this.crewTypeList = res.data
      const crewList = {}
      for (let crewType of res.data) {
        crewList[crewType.value] = []
      }
      this.crewList = crewList
    }, (res) => {
      console.log(res)
    })
    this.$http.get('api/crews').then((res) => {
      const crewList = this.crewList
      for (let crew of res.data) {
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
    }, upQuanti(value) {
      if (value === 'Aucun') {
        this.dQ.volume = false
        this.dQ.poid = false
        for (let material of formInfo.dechetQuantitatif.value) {
          this.sub.valeurQuantitatif.poids['poids'+material.name] = null
          this.sub.valeurQuantitatif.volume['volume'+material.name] = null
          this.sub.valeurQuantitatif.volumineux['volumineux'+material.name] = null
        }
      } else if (value === 'Volume et Volumineux') {
        this.dQ.volume = true
        this.dQ.poid = false
        for (let material of formInfo.dechetQuantitatif.value) {
          this.sub.valeurQuantitatif.poids['poids'+material.name] = null
        }
      } else if (value === 'Poids, Volume et Volumineux') {
        this.dQ.volume = true
        this.dQ.poid = true
      }
    }, updateLieu(lieu) {
      this.lieu = lieu
      this.sub.lieuId = lieu._id
      this.sub.polyline = lieu.polyline
      this.sub.polygon = lieu.polygon
      this.sub.longueur = lieu.longueur
      this.sub.surface = lieu.surface
    }, updatePoly(shape, elem) {
      if (shape === 'Line') {
        const polylineObj = elem.layer.getLatLngs()
        let polyline = []
        for (let index = 0; index < polylineObj.length; index++) {
          polyline.push([polylineObj[index].lat, polylineObj[index].lng])
        }
        const turfPolyline = turf.lineString(polyline)
        this.sub.polyline = polyline
        this.sub.longueur = Math.round(turf.length(turfPolyline)*1000)
      } else if (shape === 'Polygon') {
        const polygonObj = elem.layer.getLatLngs()[0]
        let polygon = []
        for (let index = 0; index < polygonObj.length; index++) {
          polygon.push([polygonObj[index].lat, polygonObj[index].lng])
        }
        polygon.push(polygon[0])
        const turfPolygon = turf.polygon([polygon])
        this.sub.polygon = polygon
        this.sub.surface = Math.round(turf.area(turfPolygon))
      }
    }, submission() {
      let run = async () => {
        this.submit = true
        const dechetSpecifiqueId = []
        const dateEvenement = new Date(this.sub.dateEvenement)
        const dureeEvenement = parseInt(this.sub.dureeEvenement.slice(0, 2)) * 60 + parseInt(this.sub.dureeEvenement.slice(3, 5))
        for (const dsIter of this.sub.dechetSpecifique) {
          const sendDS = {
            nom: dsIter.nomDS.trim(),
            volume: dsIter.volumeDS,
            desc: dsIter.descDS ? dsIter.descDS.trim() : null,
            volEst: dsIter.volEstDS,
            provenance: dsIter.provenanceDS,
            commentaire: dsIter.commentaireDS
              ? dsIter.commentaireDS.trim()
              : null,
            poids: dsIter.poidsDS,
            nombre: dsIter.nombreDS,
          }
          await this.$http.post('api/dechet_specifiques', sendDS).then(
          (res) => {
            dechetSpecifiqueId.push(res.data.dechetSpecifique._id)
          }, () => {
            window.alert("un des déchet specifique est mal renseigner, vérifiez bien tout, si le souci persiste contactez moi, jayma")
            this.submit = false
            return
          })
        }
        const sendDepoll = {
          lieuId: this.sub.lieuId,
          dateEvenement,
          dureeEvenement,
          nombreParticipantsWings: this.sub.nombreParticipantsWings,
          nombreParticipantsExterne: this.sub.nombreParticipantsExterne,
          crewId: this.sub.crewId,
          autresStructures: this.sub.autresStructures
            ? this.sub.autresStructures.trim().split(',')
            : [],
          typesDechet: this.sub.typesDechet,
          activites: this.sub.activites,
          frequentation: this.sub.frequentation,
          quantiteDechet: this.sub.quantiteDechet,
          pourquoiIlEnReste: this.sub.pourquoiIlEnReste,
          commentaire: this.sub.commentaire ? this.sub.commentaire.trim() : null,
          dechetQuantitatifPoids: this.sub.valeurQuantitatif.poids,
          dechetQuantitatifVolume: this.sub.valeurQuantitatif.volume,
          dechetQuantitatifVolumineux: this.sub.valeurQuantitatif.volumineux,
          dechetIndicateur: this.sub.dechetIndicateur,
          dechetSpecifiqueId,
          polyline: this.sub.polyline,
          polygon: this.sub.polygon,
          longueur: this.sub.longueur,
          surface: this.sub.surface,
        }
        await this.$http.post('api/depolls', sendDepoll).then(
          () => {
            this.$router.push({ name: 'FilledForm' })
          }, () => {
            window.alert("le formulaire n'est pas correctement rempli, veuillez vérifier les champs, sinon contactez moi : jayma")
            this.submit = false
          }
        )
      }
      run()
    }, createCrew() {
      this.$http.post('api/crews', this.createdCrew).then(
        (res) => {
          const index = this.crewTypeList.findIndex((value) => value._id == res.body.crew.crewTypeId)
          this.crew = { name: res.body.crew.crewName, type: this.crewTypeList[index].name, _id: res.body.crew._id}
          
          this.crewAdd()
          this.crewCreateSuccess = true
          this.crewFormDisplay()
          this.$http.get('api/crew_types').then((res) => {
            this.crewTypeList = res.data
            const crewList = {}
            for (let crewType of res.data) {
              crewList[crewType.value] = []
            }
            this.crewList = crewList
          }, (res) => {
            console.log(res)
          })
          this.$http.get('api/crews').then((res) => {
            const crewList = {}
            for (let crew of res.data) {
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
      this.createdCrew.crewName = ''
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

  #mapEdit {
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
