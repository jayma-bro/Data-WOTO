<template>
  <div class="form container">
    <form action="" accept-charset="utf-8" autocomplete="on" name="formulaire lieu" class="needs-validation" novalidate>
      <h1>Formulaire du lieu dépollué</h1>
      <div class="row">
        <ol>
          <li>
            Utilisez le marqueur <img src="../assets/img/Marker_icon.svg"> pour localiser le lieu de dépollution (ex : le centre de caractérisation et de tri) <br>
          </li>
          <li>
          Utilisez l'icône <img src="../assets/img/Polygon_icon.svg"> pour dessiner la surface dépolluée <br>
          </li>
          <li>
          Utilisez l'icône <img src="../assets/img/Polyline_icon.svg"> pour mesurer la longueur du terrain dépollué
          </li>
        </ol>
        <ul>
          <li>
            <em>Maintenez la touche Alt pour désactiver le magnétisme des points</em>
          </li>
          <li>
            <router-link :to="{ name: 'Home'}">Retour à l'accueil</router-link>
          </li>
        </ul>
        <p>
        </p>
      </div>
      <div class="row">
        <map-form  class="col-md-9" id="mapSpace" :content="formInfo.carte"  @update="updateMap">
        </map-form>
        <fade-loader v-if='loading' class="position-absolute top-50 start-50"></fade-loader>
        <div class="col-md-3">
          <p>
          <strong>Latitude</strong> : {{ sub.localisation[0] }} <br>
          <strong>Longitude</strong> : {{ sub.localisation[1] }} <br>
          <strong>Pays</strong> : {{ sub.pays }} <br>
          <strong>Longueur</strong> : {{ sub.longueur }}m <br>
          <strong>Surface</strong> : {{ sub.surface }}m² <br>
          <strong>Suggestion de nom de lieu</strong> : <br>
          <span v-html="addressText"></span><br>
          </p>
        </div>
      </div>
      <div class="row">
        <input-type :content="formInfo.lieu" baseclass="col-xl-3 col-md-6" @update="upValue"></input-type>
        <input-type :content="formInfo.ville" baseclass="col-xl-3 col-md-6" @update="upValue"></input-type>
        <div class="col-lg-6">
          <label :for="formInfo.typeLieu.name" class="form-label" :class="{required: formInfo.typeLieu.req}">{{ formInfo.typeLieu.label }}</label>
          <pop-help :content="formInfo.typeLieu.help"></pop-help>
          <select class="form-select" name="typeLieu" v-model="sub.typeLieu" required>
              <option value="none" selected disabled hidden>Sélectionnez une option</option>
            <optgroup :label="group" v-for="group in formInfo.typeLieu.groups"  :key="group.id">
              <option :value="value" v-for="value in formInfo.typeLieu.values[group]"  :key="value.id"> {{ value }} </option>
            </optgroup>
          </select>
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
import MapForm from './MapForm.vue'
import formInfo from '@/assets/json/formInfo.json'
import * as turf from '@turf/turf'

export default {
  name: 'LieuForm',
  components: {
    PopHelp,
    InputType,
    MapForm,
    FadeLoader,
  }, data () {
    return {
      formInfo,
      loading: false,
      address: null,
      addressText: null,
      sub: {
        lieu: null,
        ville: null,
        localisation: [null, null],
        polyline: null,
        polygon: null,
        pays: null,
        longueur: null,
        surface: null,
        typeLieu: null,
      }
    }
  }, methods: {
    async getAddress() {
      this.loading = true
      let address = {address: "adressage impossible"}
      let addressText = "adressage impossible"
      let pays = ""
      try {
        const lat = this.sub.localisation[0]
        const lng = this.sub.localisation[1]
        const result = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
        )
        if (result.status === 200) {
          const body = await result.json()
          if (body.display_name != undefined) {
            address = body.address
            addressText = Object.values(address).reverse().join('<br>')
            pays = body.address.country
          }
        }
      } catch (e) {
        console.error("Reverse Geocode Error->", e)
      }
      this.loading = false
      this.sub.pays = pays
      this.address = address
      this.addressText = addressText
    }, updateMap(shape, elem) {
      if (shape === this.formInfo.carte.value.marker.name) {
        if (elem.type === 'pm:remove') {
          this.sub.localisation = null
          this.address = ''
        } else {
          const marker = elem.layer.getLatLng()
          this.sub.localisation = [marker.lat, marker.lng]
          this.getAddress()
        }
      } else if (shape === this.formInfo.carte.value.polyline.name) {
        if (elem.type === 'pm:remove') {
          this.sub.polyline = null
          this.sub.longueur = null
        } else {
          const polylineObj = elem.layer.getLatLngs()
          let polyline = []
          for (let index = 0; index < polylineObj.length; index++) {
            polyline.push([polylineObj[index].lat, polylineObj[index].lng])
          }
          const turfPolyline = turf.lineString(polyline)
          this.sub.polyline = polyline
          this.sub.longueur = Math.round(turf.length(turfPolyline)*1000)
        }
      } else if (shape === this.formInfo.carte.value.polygon.name) {
        if (elem.type === 'pm:remove') {
          this.sub.polygon = null
        } else {
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
      }
    }, upValue(value, target) {
      this.sub[target] = value.trim()
    }, submission() {
      this.$http.post('api/lieux', this.sub).then(
        () => {
          this.$router.push({ name: 'FilledForm' })
        }, () => {
          window.alert("Le formulaire n'est pas correctement rempli, veuillez vérifier les champs, sinon contactez moi : jayma")
        }
      )
    },
  }
}
</script>

<style>
  #mapSpace {
    height: 60vh;
    margin-top: 10px;
    margin-bottom: 10px;
  }
</style>