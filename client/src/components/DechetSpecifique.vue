<template>
  <div class="row d_specifique">
    <h5>Déchet spécifique </h5>
    <input-type :content="this.content.nomDS" :DS="this.num.toString()" baseclass="col-3" @update="upValue"></input-type>
    <input-type :content="this.content.volumeDS" :DS="this.num.toString()" baseclass="col-3" @update="upValue"></input-type>
    <input-type :content="this.content.descDS" :DS="this.num.toString()" baseclass="col-6" @update="upValue"></input-type>
    <input-type :content="this.content.volEstDS" :DS="this.num.toString()" baseclass="col-3" @update="upValue"></input-type>
    <input-type :content="this.content.provenanceDS" :DS="this.num.toString()" baseclass="col-3" @update="upValue"></input-type>
    <div class="col">
      <label :for="'commentaireDS' + this.num" class="form-label">Commentaire</label>
      <textarea :name="'commentaireDS' + this.num" class="form-control" :id="'commentaireDS' + this.num" v-model.lazy="commentaireDS"></textarea>
    </div>
    <input-type :content="this.content.poidsDS" :DS="this.num.toString()" baseclass="col-3" @update="upValue"></input-type>
    <input-type :content="this.content.nombreDS" :DS="this.num.toString()" baseclass="col-3" @update="upValue"></input-type>
  </div>
</template>

<script>
import InputType from './InputType.vue'

export default {
  name: 'DechetSpecifique',
  components: {
    InputType,
  }, props: {
    content: Object,
    num: Number,
  }, data () {
    return {
      nomDS: "",
      volumeDS: "",
      descDS: "",
      volEstDS: "",
      provenanceDS: [],
      commentaireDS: "",
      poidsDS: "",
      nombreDS: "",
    }
  }, watch: {
    nomDS: {
      handler(val) {
        this.$emit('update', val, "nomDS", this.num)
      }
    }, volumeDS: {
      handler(val) {
        this.$emit('update', val, "volumeDS", this.num)
      }
    }, descDS: {
      handler(val) {
        this.$emit('update', val, "descDS", this.num)
      }
    }, volEstDS: {
      handler(val) {
        this.$emit('update', val, "volEstDS", this.num)
      }
    }, provenanceDS: {
      handler(val) {
        this.$emit('update', val, "provenanceDS", this.num)
      }
    }, commentaireDS: {
      handler(val) {
        this.$emit('update', val, "commentaireDS", this.num)
      }
    }, poidsDS: {
      handler(val) {
        this.$emit('update', val, "poidsDS", this.num)
      }
    }, nombreDS: {
      handler(val) {
        this.$emit('update', val, "nombreDS", this.num)
      }
    },
  }, methods: {
    upValue(value, target) {
      this[target] = value
    }
  }
}
</script>

<style>
  .d_specifique {
    border: solid;
    border-radius: 1rem;
    border-width: thin;
    background-color: rgb(228, 228, 228);
    margin: 20px 0;
    padding: 20px;
  }
</style>
