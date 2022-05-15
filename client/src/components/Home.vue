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
    <div class="row">
      <h3 class="titre">Voici une petite vidéo pour vous présenter comment utiliser le formulaire en cas de doute.</h3>
      <div class="iframe-container">
        <iframe width="560" height="315" src="https://www.youtube.com/embed/XN2cX25JBz8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </div>
    </div>
    <div class="row">
      <h3 class="titre">Voici des petits formulaire pour me partager des informations</h3>
      <div class="col-4">
        <a class="lien-form" target="_blank" href="https://forms.gle/8aWkaDX5YJv9aCfZ9">Correction Formulaire de dépollution</a><br>
        dans le cas où vous avez fait une erreur lors du remplissage du formulaire
      </div>
      <div class="col-4">
        <a class="lien-form" target="_blank" href="https://forms.gle/TEb1XT93sSpUUHmJ6">Bug ou problème technique</a><br>
        pour signaler d'un bug
      </div>
      <div class="col-4">
        <a class="lien-form" target="_blank" href="https://forms.gle/NCAnKsPx28hohu7n9">Idée d'amélioration</a><br>
        pour faire des sugestions de chose à changer ou d'idées d'amélioration pour l'avenir
      </div>
    </div>
    <h2 class="titre">Nouveautées</h2>
    <div class="row news">
      <h4>Correction de la visualisation des données</h4>
      <p class="date">15/05/2022</p>
      il y a maintenant une indexation des dépollutions pour voir rapidement combien de dépollutions ont été fait par années <br>
      les crew de dépoll sont aussi visible maintenant.
    </div>
    <div class="row news">
      <h4>Changement de la liste des déchets indicateurs Niveau 3</h4>
      <p class="date">06/04/2022</p>
      Merterre à récemment changé la liste de ses déchets indicateurs de niveau 3. <br>
      donc pour rester aligner avec leur protocole j'ai actualisé cette liste
    </div>
    <div class="row vide"></div>
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
.iframe-container{
  position: relative;
  width: 100%;
  padding-bottom: 56.25%; 
  height: 0;
}
.iframe-container iframe{
  position: absolute;
  top:0;
  left: 0;
  width: 100%;
  height: 100%;
}
.titre {
  margin: 30px 0;
}
.lien-form {
  font-size: 1.5em;
}
.vide {
  margin: 200px;
}
.news {
  text-align: left;
  font-size: 1.1em;
}
.date {
  font-size: 0.8em;
  font-style: italic;
  margin: 0;
}
</style>