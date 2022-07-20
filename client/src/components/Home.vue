<template>
  <div class="home container">
    <h2><router-link :to="{ name: 'Form' }">Le formulaire</router-link></h2>
    <img
      width="400"
      height="400"
      alt="Logo de wings"
      src="../assets/img/logo favicon.png"
    />
    <br />
    <router-link :to="{ name: 'DataView', params: { year: 2021 } }"
      >Visualisation des données 2021</router-link
    >
    <br />
    <router-link :to="{ name: 'DataView', params: { year: 2022 } }"
      >Visualisation des données 2022</router-link
    ><br />
    <h2>Etapes à suivre pour renseigner sa dépollution</h2>
    <br />
    <ol class="list">
      <li>
        Renseigner le lieu dépollué par
        <router-link :to="{ name: 'LieuForm' }"
          >le formulaire de lieu</router-link
        ><br />
        <strong>Uniquement s'il n'est pas déjà enregistré</strong>
      </li>
      <li>
        Renseigner la dépollution par
        <router-link :to="{ name: 'Form' }"
          >le formulaire de dépollution</router-link
        ><br />
        <strong
          >Essayer de répondre à un maximum de questions, et se relire pour ne
          pas faire d'erreur</strong
        >
      </li>
      <li>
        L'association Wings of the Ocean vous remercie de donner de votre temps
        pour collecter des données et en apprendre plus sur la problématique des
        déchets plastiques.
      </li>
    </ol>
    <div class="row">
      <h3 class="titre">
        Voici une petite vidéo tutorielle pour apprendre à utiliser le
        formulaire en cas de doute.
      </h3>
      <div class="iframe-container">
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/XN2cX25JBz8"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>
    </div>
    <div class="row">
      <h3 class="titre">
        Voici des formulaires utiles pour l'amélioration de l'outil ou revenir
        sur l'enregistrement de votre dépollution
      </h3>
      <div class="col-4">
        <a
          class="lien-form"
          target="_blank"
          href="https://forms.gle/8aWkaDX5YJv9aCfZ9"
          >Formulaire de correction</a
        ><br />
        en cas d'erreur lors du remplissage du premier formulaire
      </div>
      <div class="col-4">
        <a
          class="lien-form"
          target="_blank"
          href="https://forms.gle/TEb1XT93sSpUUHmJ6"
          >Formulaire de signalement d'un problème technique</a
        ><br />
        Si vous rencontrez un problème technique sur la plateforme, n'hésitez
        pas à le signaler ici
      </div>
      <div class="col-4">
        <a
          class="lien-form"
          target="_blank"
          href="https://forms.gle/NCAnKsPx28hohu7n9"
          >Idée d'amélioration</a
        ><br />
        Toutes sugestions ou idées d'amélioration pour l'avenir peuvent être
        proposées ici
      </div>
    </div>
    <!--
    <h2 class="titre">Nouveautés</h2>
    <div class="row news">
      <h4>Correction de la visualisation des données</h4>
      <p class="date">15/05/2022</p>
      il y a maintenant une indexation des dépollutions pour voir rapidement combien de dépollutions ont été faites par année <br>
      Les équipages de dépollution sont également visible.
    </div>
    <div class="row news">
      <h4>Changement de la liste des déchets indicateurs Niveau 3</h4>
      <p class="date">06/04/2022</p>
      Merterre a récemment changé la liste de ses déchets indicateurs de niveau 3. <br>
      donc pour rester aligner avec leur protocole j'ai actualisé cette liste
    </div>
    <div class="row vide"></div>
    -->
  </div>
</template>

<script>
export default {
  name: 'Home',
}
</script>

<style scoped src="../assets/css/style.css">
</style>