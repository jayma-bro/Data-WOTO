<template>
  <div class="home">
    <h2><router-link :to="{ name: 'Form'}">Le Formulaire</router-link></h2>
    <img width="400" height="400" alt='Logo de wings' src="../assets/img/logo favicon.png"> <br>
    <router-link :to="{ name: 'DataView', params: {year: 2021}}">visualisation des données 2021</router-link> <br>
    <router-link :to="{ name: 'DataView', params: {year: 2022}}">visualisation des données 2022</router-link><br>
    <h2>Etapes à suivre pour renseigner sa dépoll</h2><br>
    <ol class="list">
      <li>
        Renseigner le lieu dépollué par <router-link :to="{ name: 'LieuForm'}">Le formulaire de Lieu</router-link><br>
        <strong>Uniquement s'il n'est pas déjà enregistré</strong>
      </li>
      <li>
        Renseigner la dépollution par <router-link :to="{ name: 'Form'}">Le formulaire de Depoll</router-link><br>
        <strong>essayez de répondre au maximum de questions, et de bien vous relire pour par faire d'erreur</strong>
      </li>
      <li>
        Je vous remercie d'investir votre temps pour nous aider à mettre le doigt <br>
        sur cette problématique de fond que sont les déchets plastiques la surconsommation etc.
      </li>
    </ol>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>

<style>
.home {
  text-align: center;
}
.list {
  font-size: 1.5em;
  text-align: left;
}
</style>