<template>
  <div>
    <div class="row d_specifique">
      <div class="col-3">
        <label
          :for="content.nomDS.name"
          class="form-label"
          :class="{ required: content.nomDS.req }"
          >{{ content.nomDS.label }}</label
        >
        <pop-help :content="content.nomDS.help"></pop-help>
        <input
          type="text"
          class="form-control"
          :name="content.nomDS.name"
          v-model="nomDS"
        />
      </div>
      <div class="col-3">
        <label
          :for="content.volumeDS.name"
          class="form-label"
          :class="{ required: content.volumeDS.req }"
          >{{ content.volumeDS.label }}</label
        >
        <pop-help :content="content.volumeDS.help"></pop-help>
        <input
          type="number"
          class="form-control"
          :name="content.volumeDS.name"
          v-model="volumeDS"
          :step="content.volumeDS.step"
        />
      </div>
      <div class="col-6">
        <label
          :for="content.descDS.name"
          class="form-label"
          :class="{ required: content.descDS.req }"
          >{{ content.descDS.label }}</label
        >
        <pop-help :content="content.descDS.help"></pop-help>
        <input
          type="text"
          class="form-control"
          :name="content.descDS.name"
          v-model="descDS"
        />
      </div>
      <div class="col-3">
        <label
          :for="content.volEstDS.name"
          class="form-label"
          :class="{ required: content.volEstDS.req }"
          >{{ content.volEstDS.label }}</label
        >
        <pop-help :content="content.volEstDS.help"></pop-help>
        <div
          class="form-check"
          v-for="val in content.volEstDS.value"
          :key="val"
        >
          <input
            class="form-check-input"
            :type="content.volEstDS.type"
            :name="content.volEstDS.name"
            :id="val"
            :value="val"
            v-model="volEstDS"
          />
          <label class="form-check-label" :for="val">{{ val }}</label>
        </div>
      </div>
      <div class="col-3">
        <label
          :for="content.provenanceDS.name"
          class="form-label"
          :class="{ required: content.provenanceDS.req }"
          >{{ content.provenanceDS.label }}</label
        >
        <pop-help :content="content.provenanceDS.help"></pop-help>
        <div
          class="form-check"
          v-for="val in content.provenanceDS.value"
          :key="val"
        >
          <input
            class="form-check-input"
            :type="content.provenanceDS.type"
            :name="content.provenanceDS.name"
            :id="val"
            :value="val"
            v-model="provenanceDS"
          />
          <label class="form-check-label" :for="val">{{ val }}</label>
        </div>
      </div>
      <div class="col">
        <label for="commentaireDS" class="form-label">Commentaire</label>
        <textarea
          name="commentaireDS"
          class="form-control"
          id="commentaireDS"
          v-model.lazy="commentaireDS"
        ></textarea>
      </div>
      <div class="col-3">
        <label
          :for="content.poidsDS.name"
          class="form-label"
          :class="{ required: content.poidsDS.req }"
          >{{ content.poidsDS.label }}</label
        >
        <pop-help :content="content.poidsDS.help"></pop-help>
        <input
          type="number"
          class="form-control"
          :name="content.poidsDS.name"
          v-model="poidsDS"
          :step="content.poidsDS.step"
        />
      </div>
      <div class="col-3">
        <label
          :for="content.nombreDS.name"
          class="form-label"
          :class="{ required: content.nombreDS.req }"
          >{{ content.nombreDS.label }}</label
        >
        <pop-help :content="content.nombreDS.help"></pop-help>
        <input
          type="number"
          class="form-control"
          :name="content.nombreDS.name"
          v-model="nombreDS"
          :step="content.nombreDS.step"
        />
      </div>
      <button type="button" class="btn btn-primary" name="dsAdd" @click="dsAdd">
        Valider
      </button>
    </div>
  </div>
</template>

<script>
import PopHelp from './PopHelp.vue'
export default {
  name: 'DechetSpecifique',
  components: {
    PopHelp,
  },
  props: {
    content: Object,
  },
  data() {
    return {
      nomDS: '',
      volumeDS: '',
      descDS: '',
      volEstDS: '',
      provenanceDS: [],
      commentaireDS: '',
      poidsDS: '',
      nombreDS: '',
    }
  },
  watch: {
    nomDS: {
      handler(val) {
        this.$emit('update', val, 'nomDS', true)
      },
    },
    volumeDS: {
      handler(val) {
        this.$emit('update', val, 'volumeDS', true)
      },
    },
    descDS: {
      handler(val) {
        this.$emit('update', val, 'descDS', true)
      },
    },
    volEstDS: {
      handler(val) {
        this.$emit('update', val, 'volEstDS', true)
      },
    },
    provenanceDS: {
      handler(val) {
        this.$emit('update', val, 'provenanceDS', true)
      },
    },
    commentaireDS: {
      handler(val) {
        this.$emit('update', val, 'commentaireDS', true)
      },
    },
    poidsDS: {
      handler(val) {
        this.$emit('update', val, 'poidsDS', true)
      },
    },
    nombreDS: {
      handler(val) {
        this.$emit('update', val, 'nombreDS', true)
      },
    },
  },
  methods: {
    dsAdd() {
      this.$emit('dsadd')
      this.nomDS = ''
      this.volumeDS = ''
      this.descDS = ''
      this.volEstDS = ''
      this.provenanceDS = []
      this.commentaireDS = ''
      this.poidsDS = ''
      this.nombreDS = ''
    },
  },
}
</script>

<style scoped src="../assets/css/style.css">
</style>