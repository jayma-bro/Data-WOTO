<template>
  <div id="app">
    <img src="./assets/logo.png">
    <router-view/>
    <p>{{ info }}</p>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      info: []
    }
  },
  mounted () {
    this.$http.get('/api/stat-general').then((response) => {
      response.json().then((data) => {
        this.info = data
      })
    }, (response) => {
      console.log('erreur', response)
    })
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
