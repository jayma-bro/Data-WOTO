<template>
  <div class="d-inline">
    <img src="@/assets/img/logo question.png" alt="" height="20" @click="pop" />
    <div class="popcontent d-inline" v-if="show">
      {{ content }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    content: String,
  },
  data() {
    return {
      show: false,
    }
  },
  methods: {
    pop() {
      this.show = !this.show
    },
  },
}
</script>

<style scoped src="../assets/css/style.css">
</style>
