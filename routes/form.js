const express = require('express')
const router = express.Router()
const Depoll = require('../models/depoll')


router.post('/', (req, res) => {
  let volEstDS = null
  let crewName = null
  let crewType = null
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
  crewName = req.body.crewName.join(';')
  crewType = req.body.crewType.join(';')
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
    crewName,
    crewType,
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
    poidsPlastiqueNonRecy: req.body.ValeurQuantitatif.poids.PlastiqueNonRecy,
    volumePlastiqueNonRecy: req.body.ValeurQuantitatif.volume.PlastiqueNonRecy,
    poidsPlastiqueRecy: req.body.ValeurQuantitatif.poids.PlastiqueRecy,
    volumePlastiqueRecy: req.body.ValeurQuantitatif.volume.PlastiqueRecy,
    poidsMetal: req.body.ValeurQuantitatif.poids.Metal,
    volumeMetal: req.body.ValeurQuantitatif.volume.Metal,
    poidsVerreEtCeramique: req.body.ValeurQuantitatif.poids.VerreEtCeramique,
    volumeVerreEtCeramique: req.body.ValeurQuantitatif.volume.VerreEtCeramique,
    poidsTextile: req.body.ValeurQuantitatif.poids.Textile,
    volumeTextile: req.body.ValeurQuantitatif.volume.Textile,
    poidsPapierEtCarton: req.body.ValeurQuantitatif.poids.PapierEtCarton,
    volumePapierEtCarton: req.body.ValeurQuantitatif.volume.PapierEtCarton,
    poidsBois: req.body.ValeurQuantitatif.poids.Bois,
    volumeBois: req.body.ValeurQuantitatif.volume.Bois,
    poidsCaoutchouc: req.body.ValeurQuantitatif.poids.Caoutchouc,
    volumeCaoutchouc: req.body.ValeurQuantitatif.volume.Caoutchouc,
    poidsAutre: req.body.ValeurQuantitatif.poids.Autre,
    volumeAutre: req.body.ValeurQuantitatif.volume.Autre,
    bouteilleEnPlastique: req.body.ValeurIndicateur.niv1.bouteilleEnPlastique,
    bouteilleEnVerre: req.body.ValeurIndicateur.niv1.bouteilleEnVerre,
    canetteEnMetal: req.body.ValeurIndicateur.niv1.canetteEnMetal,
    masque: req.body.ValeurIndicateur.niv1.masque,
    megot: req.body.ValeurIndicateur.niv1.megot,
    pneu: req.body.ValeurIndicateur.niv1.pneu,
    appareilMenager: req.body.ValeurIndicateur.niv2.appareilMenager,
    ballonDeBaudruche: req.body.ValeurIndicateur.niv2.ballonDeBaudruche,
    batonDeSucette: req.body.ValeurIndicateur.niv2.batonDeSucette,
    batterie: req.body.ValeurIndicateur.niv2.batterie,
    boiteDAppats: req.body.ValeurIndicateur.niv2.boiteDAppats,
    boiteDeMedicaments: req.body.ValeurIndicateur.niv2.boiteDeMedicaments,
    bouchonEnPlastique: req.body.ValeurIndicateur.niv2.bouchonEnPlastique,
    briquet: req.body.ValeurIndicateur.niv2.briquet,
    capsule: req.body.ValeurIndicateur.niv2.capsule,
    cartoucheDeChasse: req.body.ValeurIndicateur.niv2.cartoucheDeChasse,
    chaussure: req.body.ValeurIndicateur.niv2.chaussure,
    contenantAlimentaire: req.body.ValeurIndicateur.niv2.contenantAlimentaire,
    cordagesEmmeles: req.body.ValeurIndicateur.niv2.cordagesEmmeles,
    cordageEtFicelle: req.body.ValeurIndicateur.niv2.cordageEtFicelle,
    cotonTige: req.body.ValeurIndicateur.niv2.cotonTige,
    filetInf50cm: req.body.ValeurIndicateur.niv2.filetInf50cm,
    filetSup50cm: req.body.ValeurIndicateur.niv2.filetSup50cm,
    gobelet: req.body.ValeurIndicateur.niv2.gobelet,
    jouetEnPlastique: req.body.ValeurIndicateur.niv2.jouetEnPlastique,
    materielDePeche: req.body.ValeurIndicateur.niv2.materielDePeche,
    mediaFiltrant: req.body.ValeurIndicateur.niv2.mediaFiltrant,
    mousse: req.body.ValeurIndicateur.niv2.mousse,
    pailleEnPlastique: req.body.ValeurIndicateur.niv2.pailleEnPlastique,
    protectionHygienique: req.body.ValeurIndicateur.niv2.protectionHygienique,
    sacPlastique: req.body.ValeurIndicateur.niv2.sacPlastique,
    vaisselleEnPlastique: req.body.ValeurIndicateur.niv2.vaisselleEnPlastique,
    vetement: req.body.ValeurIndicateur.niv2.vetement,
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
    .then(response => {
      res.status(201).json({"message": "bien enregistré"})
    })
    .catch(error => {
      res.status(400).json({error, depoll})
    });
})

router.get('/', (req, res) => {
  Depoll.find()
  .then(depolls => {
    let render = depolls
    return res.status(200).json(render)
  })
  .catch(error => res.status(400).json({ error }));
})

module.exports = router
