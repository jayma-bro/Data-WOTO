const express = require('express')
const router = express.Router()
const Depoll = require('../models/depoll')


router.post('/', (req, res) => {
  let volEstDS = null
  let provenanceDS = null
  let nomDS = null
  let volumeDS = null
  let descDS = null
  let commentaireDS = null
  let poidsDS = null
  let nombreDS = null
  if (parseInt(req.body.nbDechetSpecifique) > 0) {
    let volEstDSL = []
    let provenanceDSL = []
    for(let i = 0; i < parseInt(req.body.nbDechetSpecifique); i++) {
      provenanceDSL[i] = req.body.provenanceDS[i].join(',')
    }
    volEstDS = req.body.volEstDS.join(';')
    provenanceDS = provenanceDSL.join(';')
    nomDS = req.body.nomDS.join(';')
    volumeDS = req.body.volumeDS.join(';')
    descDS = req.body.descDS.join(';')
    commentaireDS = req.body.commentaireDS.join(';')
    poidsDS = req.body.poidsDS.join(';')
    nombreDS = req.body.nombreDS.join(';')
  }
  let dateEvenement = new Date(req.body.dateEvenement)
  let createdTime = new Date(Date.now())
  let dureeEvenement = parseInt(req.body.dureeEvenement.slice(0,2))*60 + parseInt(req.body.dureeEvenement.slice(3,5))
  let crew = req.body.crew === undefined ? null : (typeof(req.body.crew) == 'string' ? req.body.crew : req.body.crew.join(';'))
  let typesDechet = req.body.typesDechet === undefined ? null : (typeof(req.body.typesDechet) == 'string' ? req.body.typesDechet : req.body.typesDechet.join(';'))
  let activites = req.body.activites === undefined ? null : (typeof(req.body.activites) == 'string' ? req.body.activites : req.body.activites.join(';'))
  let pourquoiIlEnReste = req.body.pourquoiIlEnReste === undefined ? null : (typeof(req.body.pourquoiIlEnReste) == 'string' ? req.body.pourquoiIlEnReste : req.body.pourquoiIlEnReste.join(';'))
  let depoll = new Depoll({
    createdTime,
    relecture: false,
    lieu: req.body.lieu,
    ville: req.body.ville,
    dateEvenement,
    dureeEvenement,
    nombreParticipantsWings: req.body.nombreParticipantsWings,
    nombreParticipantsExterne: req.body.nombreParticipantsExterne,
    crew,
    autresStructures: req.body.autresStructures,
    longueur: req.body.longueur,
    surface: req.body.surface,
    typeLieu: req.body.typeLieu,
    typesDechet,
    activites,
    frequentation: req.body.frequentation,
    quantiteDechet: req.body.quantiteDechet,
    pourquoiIlEnReste,
    commentaire: req.body.commentaire,
    poidsPlastiqueNonRecy: req.body.poidsPlastiqueNonRecy,
    volumePlastiqueNonRecy: req.body.volumePlastiqueNonRecy,
    poidsPlastiqueRecy: req.body.poidsPlastiqueRecy,
    volumePlastiqueRecy: req.body.volumePlastiqueRecy,
    poidsMetal: req.body.poidsMetal,
    volumeMetal: req.body.volumeMetal,
    poidsVerreEtCeramique: req.body.poidsVerreEtCeramique,
    volumeVerreEtCeramique: req.body.volumeVerreEtCeramique,
    poidsTextile: req.body.poidsTextile,
    volumeTextile: req.body.volumeTextile,
    poidsPapierEtCarton: req.body.poidsPapierEtCarton,
    volumePapierEtCarton: req.body.volumePapierEtCarton,
    poidsBois: req.body.poidsBois,
    volumeBois: req.body.volumeBois,
    poidsCaoutchouc: req.body.poidsCaoutchouc,
    volumeCaoutchouc: req.body.volumeCaoutchouc,
    poidsAutre: req.body.poidsAutre,
    volumeAutre: req.body.volumeAutre,
    bouteilleEnPlastique: req.body.bouteilleEnPlastique,
    bouteilleEnVerre: req.body.bouteilleEnVerre,
    canetteEnMetal: req.body.canetteEnMetal,
    masque: req.body.masque,
    megot: req.body.megot,
    pneu: req.body.pneu,
    appareilMenager: req.body.appareilMenager,
    ballonDeBaudruche: req.body.ballonDeBaudruche,
    batonDeSucette: req.body.batonDeSucette,
    batterie: req.body.batterie,
    boiteDAppats: req.body.boiteDAppats,
    boiteDeMedicaments: req.body.boiteDeMedicaments,
    bouchonEnPlastique: req.body.bouchonEnPlastique,
    briquet: req.body.briquet,
    capsule: req.body.capsule,
    cartoucheDeChasse: req.body.cartoucheDeChasse,
    chaussure: req.body.chaussure,
    contenantAlimentaire: req.body.contenantAlimentaire,
    cordagesEmmeles: req.body.cordagesEmmeles,
    cordageEtFicelle: req.body.cordageEtFicelle,
    cotonTige: req.body.cotonTige,
    filetInf50cm: req.body.filetInf50cm,
    filetSup50cm: req.body.filetSup50cm,
    gobelet: req.body.gobelet,
    jouetEnPlastique: req.body.jouetEnPlastique,
    materielDePeche: req.body.materielDePeche,
    mediaFiltrant: req.body.mediaFiltrant,
    mousse: req.body.mousse,
    pailleEnPlastique: req.body.pailleEnPlastique,
    protectionHygienique: req.body.protectionHygienique,
    sacPlastique: req.body.sacPlastique,
    vaisselleEnPlastique: req.body.vaisselleEnPlastique,
    vetement: req.body.vetement,
    nomDS,
    volumeDS,
    descDS,
    volEstDS,
    provenanceDS,
    commentaireDS,
    poidsDS,
    nombreDS
  })
  depoll.save()
    .then(() => {
      res.status(201)
      res.render('pages/retour')
    })
    .catch(error => {
      // res.status(400).render('pages/index', {help, popHelp})
      res.status(400).json({error})
    });
})

module.exports = router
