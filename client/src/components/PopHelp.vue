<template>
  <div class="d-inline">
    <img src="@/assets/img/logo question.png" alt="" height="20" @click="pop">
    <div class="popcontent d-inline" v-if="show">
      {{ content }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    content: String
  }, data () {
    return {
      show: false
    }
  },
  methods: {
    pop () {
      this.show = !this.show
    }
  }
}
</script>

<style>
.popcontent {
  position: absolute;
  max-width: 276px;
  border: 1px solid rgba(0,0,0,.2);
  border-radius: .3rem;
  padding: 0.5rem 0.8rem;
  font-size: .875rem;
  background-color: #fff;

}
</style>
