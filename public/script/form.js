
var indicateur = document.querySelector('#indicateur')
var nbDS = document.querySelector('#nbDechetSpecifique')
var dechetSpecifique = document.querySelector('#dechetSpecifique')
var niv1 = document.querySelector('#niv1')
var niv2 = document.querySelector('#niv2')
var niv3 = document.querySelector('#niv3')
var autreCrew = document.querySelector('#AutreCrew')
var autreActivite = document.querySelector('#AutreActivite')
var autreEncore = document.querySelector('#AutreEncore')
var autreCrewInput = document.querySelector('#autreCrewInput')
var autreActiviteInput = document.querySelector('#autreActiviteInput')
var autreEncoreInput = document.querySelector('#autreEncoreInput')

var dechSpeN = function(n) {
  var numDS = '<h5>Déchet spécifique '+ n +'</h5>' +
      '<div class="col-6">' +
        '<div class="col">' +
          '<label for="nomDS" class="form-label required">Nom du Dechet</label>' +
          '<input type="text" class="form-control" name="nomDS" required>' +
        '</div>' +
        '<div class="col">' +
          '<label for="volumeDS" class="form-label required">Volume du Dechet</label>' +
          '<input type="number" class="form-control" name="volumeDS" step="0.001" required>' +
        '</div>' +
      '</div>' +
      '<div class="col-6">' +
        '<label for="descDS" class="form-label">Description du Dechet</label>' +
        '<input type="text" class="form-control" name="descDS">' +
      '</div>' +
      '<div class="col">' +
        '<label for="volEstDS'+ n +'" class="form-label">Volume Estimé</label>' +
        '<div class="form-check">' +
          '<input class="form-check-input" type="radio" name="volEstDS'+ n +'" id="aLOeil'+ n +'" value="aLOeil">' +
          '<label class="form-check-label" for="aLOeil'+ n +'">A l’œil</label>' +
        '</div>' +
        '<div class="form-check">' +
          '<input class="form-check-input" type="radio" name="volEstDS'+ n +'" id="estimationSac'+ n +'" value="estimationSac">' +
          '<label class="form-check-label" for="estimationSac'+ n +'">Estimation des sac</label>' +
        '</div>' +
        '<div class="form-check">' +
          '<input class="form-check-input" type="radio" name="volEstDS'+ n +'" id="precisement'+ n +'" value="precisement">' +
          '<label class="form-check-label" for="precisement'+ n +'">Précisément</label>' +
        '</div>' +
      '</div>' +
      '<div class="col-6">' +
        '<label for="provenanceDS'+ n +'" class="form-label">Provenance principal du déchet</label>' +
        '<div class="form-check">' +
          '<input class="form-check-input" type="checkbox" name="provenanceDS'+ n +'" id="poseAuSol'+ n +'" value="poseAuSol">' +
          '<label class="form-check-label" for="poseAuSol'+ n +'">Posé au sol</label>' +
        '</div>' +
        '<div class="form-check">' +
          '<input class="form-check-input" type="checkbox" name="provenanceDS'+ n +'" id="deLaMer'+ n +'" value="deLaMer">' +
          '<label class="form-check-label" for="deLaMer'+ n +'">De la mer</label>' +
        '</div>' +
        '<div class="form-check">' +
          '<input class="form-check-input" type="checkbox" name="provenanceDS'+ n +'" id="crueDeRiviere'+ n +'" value="crueDeRiviere">' +
          '<label class="form-check-label" for="crueDeRiviere'+ n +'">Crue de rivière</label>' +
        '</div>' +
        '<div class="form-check">' +
          '<input class="form-check-input" type="checkbox" name="provenanceDS'+ n +'" id="autreProv'+ n +'" value="autreProv">' +
          '<label class="form-check-label" for="autreProv'+ n +'">Autre</label>' +
        '</div>' +
      '</div>' +
      '<div class="col">' +
        '<label for="commentaireDS" class="form-label">Commentaire</label>' +
        '<textarea name="commentaireDS" class="form-control" id="commentaireDS"></textarea>' +
      '</div>' +
      '<div class="col-6">' +
        '<label for="poidsDS" class="form-label">Poids</label>' +
        '<input type="number" class="form-control" name="poidsDS" step="0.0001">' +
      '</div>' +
      '<div class="col-6">' +
        '<label for="nombreDS" class="form-label">Nombre d\'objet</label>' +
        '<input type="number" class="form-control" name="nombreDS">' +
      '</div>'
      return numDS
}


var nivIndicateur = function(e) {
  switch (e.target.value) {
    case "Niveau1":
      niv1.className = "col-lg-6 show"
      niv2.className = "col-lg-6 hide"
      niv3.className = "col-lg-6 hide"
      break;
    case "Niveau2":
      niv1.className = "col-lg-6 show"
      niv2.className = "col-lg-6 show"
      niv3.className = "col-lg-6 hide"
      break;
    case "Niveau3":
      niv1.className = "col-lg-6 show"
      niv2.className = "col-lg-6 show"
      niv3.className = "col-lg-6 show"
      break;
    default:
      niv1.className = "col-lg-6 hide"
      niv2.className = "col-lg-6 hide"
      niv3.className = "col-lg-6 hide"
  }
}

var showAutreCrew = function(e) {
  if(e.explicitOriginalTarget.checked) {
      autreCrewInput.className = "show"
  } else {
      autreCrewInput.className = "hide"
  }
}

var showAutreActivite = function(e) {
  if(e.explicitOriginalTarget.checked) {
      autreActiviteInput.className = "show"
  } else {
      autreActiviteInput.className = "hide"
  }
}

var showAutreEncore = function(e) {
  if(e.explicitOriginalTarget.checked) {
      autreEncoreInput.className = "show"
  } else {
      autreEncoreInput.className = "hide"
  }
}

var showDS = function(e) {
  var cumDS = ""
  for(var i = 1; i < parseInt(e.target.value) + 1; i++) {
    cumDS += dechSpeN(i)
  }
  dechetSpecifique.innerHTML = cumDS
}

autreCrew.addEventListener('change', showAutreCrew)
autreActivite.addEventListener('change', showAutreActivite)
autreEncore.addEventListener('change', showAutreEncore)
indicateur.addEventListener('input', nivIndicateur)
nbDS.addEventListener('input', showDS)
