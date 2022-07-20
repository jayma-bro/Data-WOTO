<template>
  <div class="container" v-if="done">
    <div class="row row-eq-height mt-3">
      <div class="col-5">
        <h1>Voici la dépoll du {{ depoll.dateEvenement }} <br /></h1>
        <h2>à : {{ depoll.lieu }}</h2>

        <p>
          <em>elle à été renseigné le {{ depoll.createdAt }}</em>
        </p>
        <p>
          <router-link :to="{ name: 'Home' }">Retour à l'accueil</router-link>
        </p>
        <ul>
          <li>
            les participants sont :
            <strong>{{ depoll.crew.join(', ') }}</strong>
          </li>
          <li>
            les autres structures à participer sont :
            <strong>{{ depoll.autresStructures.join(' et ') }}</strong>
          </li>
          <li>
            il y a eu {{ depoll.nombreParticipantsWings }} participants Wings et
            {{ depoll.nombreParticipantsExterne }} participants externe
          </li>
          <li>la dépoll a duré {{ depoll.dureeEvenement }}</li>
          <li>c'était des déchets {{ depoll.typesDechet.join(' et ') }}</li>
          <li>
            les activités à proximité sont : {{ depoll.activites.join(', ') }}
          </li>
          <li>la fréquentation est : {{ depoll.frequentation }}</li>
          <li>
            il y avait {{ depoll.quantiteDechet }} des déchets restants car
            {{ depoll.pourquoiIlEnReste.join(' et ') }}
          </li>
          <li>
            le commentaire de la dépoll est :
            <p>{{ depoll.commentaire }}</p>
          </li>
        </ul>
      </div>
      <div class="col-7">
        <map-view
          class=""
          id="map-depoll"
          :config="{ show: depoll.id, edit: false, poly: true }"
        ></map-view>
      </div>
    </div>
    <div class="row mt-3">
      <div class="col-6">
        <h3>dechet indicateur</h3>
        <table class="col-12 table table-striped table-bordered">
          <thead>
            <th>dechet</th>
            <th>quantité</th>
          </thead>
          <tbody>
            <tr v-for="dechet of depoll.dechetIndicateur" :key="dechet.id">
              <td>{{ dechet[0] }}</td>
              <td>{{ dechet[1] }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="col-6">
        <h3>dechet quantitatif</h3>
        <table class="col-12 table table-striped table-bordered">
          <thead>
            <th>materiaux</th>
            <th>Poids</th>
            <th>Volume</th>
            <th>Volumineux</th>
          </thead>
          <tbody>
            <tr v-for="math of depoll.dechetQuantitatif" :key="math.id">
              <td v-for="cell of math" :key="cell.id">{{ cell }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="row">
      <h3>dechet Specifique</h3>
      <div
        class="col-4 d_specifique"
        v-for="DS of depoll.dechetSpecifique"
        :key="DS.id"
      >
        nom: {{ DS.nom }} <br />
        description: {{ DS.desc }} <br />
        nombre: {{ DS.nombre }} <br />
        poids: {{ DS.poids }} <br />
        volume: {{ DS.volume }} <br />
        estimation du volume: {{ DS.volEst }} <br />
        provenance: {{ DS.provenance.join(', ') }} <br />
        commentaire: {{ DS.commentaire }}
      </div>
    </div>
  </div>
</template>

<script>
import MapView from './MapView.vue'
export default {
  name: 'Depoll',
  components: {
    MapView,
  },
  data() {
    return {
      depoll: {},
      done: false,
    }
  },
  async mounted() {
    await this.$http
      .get('api/depolls/' + this.$route.params.depollid)
      .then((res) => {
        this.depoll.id = res.data._id
        this.depoll.lieu = res.data.lieuId.lieu
        this.depoll.dateEvenement = new Date(
          res.data.dateEvenement
        ).toLocaleDateString('fr-FR', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
        this.depoll.createdAt = new Date(res.data.createdAt).toLocaleDateString(
          'fr-FR',
          {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }
        )
        this.depoll.crew = []
        for (const crew of res.data.crewId) {
          this.depoll.crew.push(crew.crewName)
        }
        this.depoll.activites = res.data.activites
        this.depoll.autresStructures = res.data.autresStructures
        this.depoll.commentaire = res.data.commentaire
        this.depoll.dureeEvenement =
          Math.floor(res.data.dureeEvenement / 60).toString() +
          'h' +
          (res.data.dureeEvenement % 60).toString()
        this.depoll.frequentation = res.data.frequentation
        this.depoll.nombreParticipantsExterne =
          res.data.nombreParticipantsExterne
        this.depoll.nombreParticipantsWings = res.data.nombreParticipantsWings
        this.depoll.pourquoiIlEnReste = res.data.pourquoiIlEnReste
        this.depoll.quantiteDechet = res.data.quantiteDechet
        this.depoll.typesDechet = res.data.typesDechet
        this.depoll.dechetIndicateur = []
        for (const dechet in res.data.dechetIndicateur) {
          if (Object.hasOwnProperty.call(res.data.dechetIndicateur, dechet)) {
            const nbr = res.data.dechetIndicateur[dechet]
            if (nbr != null) {
              this.depoll.dechetIndicateur.push([dechet, nbr])
            }
          }
        }
        this.depoll.dechetQuantitatif = [
          [
            'Plastique non recyclable',
            'Plastique recyclable',
            'Métal',
            'Verre et Céramique',
            'Textile',
            'Papier et Carton',
            'Bois',
            'Caoutchouc',
            'Autre',
          ],
        ]
        for (const typeD of [
          'dechetQuantitatifPoids',
          'dechetQuantitatifVolume',
          'dechetQuantitatifVolumineux',
        ]) {
          if (!(res.data[typeD] === undefined)) {
            this.depoll.dechetQuantitatif.push([])
            for (const materiau in res.data[typeD]) {
              const quantite = res.data[typeD][materiau]
              if (quantite != null) {
                this.depoll.dechetQuantitatif[
                  this.depoll.dechetQuantitatif.length - 1
                ].push(quantite.toString())
              } else {
                this.depoll.dechetQuantitatif[
                  this.depoll.dechetQuantitatif.length - 1
                ].push('')
              }
            }
          } else {
            this.depoll.dechetQuantitatif.push([
              '',
              '',
              '',
              '',
              '',
              '',
              '',
              '',
              '',
            ])
          }
        }
        this.depoll.dechetQuantitatif = this.depoll.dechetQuantitatif[0].map(
          (_, colIndex) =>
            this.depoll.dechetQuantitatif.map((row) => row[colIndex])
        )
        this.depoll.dechetSpecifique = res.data.dechetSpecifiqueId
      })
    this.done = true
  },
}
</script>

<style scoped src="../assets/css/style.css">
</style>