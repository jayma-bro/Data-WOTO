<template>
  <div class="hello">
    <img src="../assets/img/logo favicon.png">
    <router-link :to="{ name: 'Form'}">Le Formulaire</router-link><br>
    <router-link :to="{ name: 'DataView', params: {year: 2021}}">visualisation des données 2021</router-link> <br>
    <router-link :to="{ name: 'DataView', params: {year: 2022}}">visualisation des données 2022</router-link>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
