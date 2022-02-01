<template>
  <div class="hello">
    <img src="../assets/img/logo favicon.png">
    <router-link :to="{ name: 'Form'}">Le Formulaire</router-link><br>
    <router-link :to="{ name: 'Home'}">visualisation des données</router-link>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
