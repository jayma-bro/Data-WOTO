const express = require('express')
const router = express.Router()
const Depoll = require('../models/depoll')
const DechetSpecifique = require('../models/dechetSpecifique')

router.post('/', (req, res) => {
  const dateEvenement = new Date(req.body.dateEvenement)
  const dureeEvenement =
    parseInt(req.body.dureeEvenement.slice(0, 2)) * 60 +
    parseInt(req.body.dureeEvenement.slice(3, 5))
  run()
  async function run() {
    try {
      const dechetSpecifiqueId = []
      for (const dsIter of req.body.dechetSpecifique) {
        const dechetS = new DechetSpecifique({
          nom: dsIter.nomDS,
          volume: dsIter.volumeDS,
          desc: dsIter.descDS,
          volEst: dsIter.volEstDS,
          provenance: dsIter.provenanceDS,
          commentaire: dsIter.commentaireDS,
          poids: dsIter.poidsDS,
          nombre: dsIter.nombreDS,
        })
        await dechetS.save()
        dechetSpecifiqueId.push(dechetS._id)
      }

      const depoll = new Depoll({
        lieuId: req.body.lieuId,
        dateEvenement,
        dureeEvenement,
        nombreParticipantsWings: req.body.nombreParticipantsWings,
        nombreParticipantsExterne: req.body.nombreParticipantsExterne,
        crewId: req.body.crewId,
        autresStructures: req.body.autresStructures.split(','),
        typesDechet: req.body.typesDechet,
        activites: req.body.activites,
        frequentation: req.body.frequentation,
        quantiteDechet: req.body.quantiteDechet,
        pourquoiIlEnReste: req.body.pourquoiIlEnReste,
        commentaire: req.body.commentaire,
        poidsPlastiqueNonRecy:
          req.body.valeurQuantitatif.poids.PlastiqueNonRecy,
        volumePlastiqueNonRecy:
          req.body.valeurQuantitatif.volume.PlastiqueNonRecy,
        poidsPlastiqueRecy: req.body.valeurQuantitatif.poids.PlastiqueRecy,
        volumePlastiqueRecy: req.body.valeurQuantitatif.volume.PlastiqueRecy,
        poidsMetal: req.body.valeurQuantitatif.poids.Metal,
        volumeMetal: req.body.valeurQuantitatif.volume.Metal,
        poidsVerreEtCeramique:
          req.body.valeurQuantitatif.poids.VerreEtCeramique,
        volumeVerreEtCeramique:
          req.body.valeurQuantitatif.volume.VerreEtCeramique,
        poidsTextile: req.body.valeurQuantitatif.poids.Textile,
        volumeTextile: req.body.valeurQuantitatif.volume.Textile,
        poidsPapierEtCarton: req.body.valeurQuantitatif.poids.PapierEtCarton,
        volumePapierEtCarton: req.body.valeurQuantitatif.volume.PapierEtCarton,
        poidsBois: req.body.valeurQuantitatif.poids.Bois,
        volumeBois: req.body.valeurQuantitatif.volume.Bois,
        poidsCaoutchouc: req.body.valeurQuantitatif.poids.Caoutchouc,
        volumeCaoutchouc: req.body.valeurQuantitatif.volume.Caoutchouc,
        poidsAutre: req.body.valeurQuantitatif.poids.Autre,
        volumeAutre: req.body.valeurQuantitatif.volume.Autre,
        bouteilleEnPlastique:
          req.body.valeurIndicateur.niv1.bouteilleEnPlastique,
        bouteilleEnVerre: req.body.valeurIndicateur.niv1.bouteilleEnVerre,
        canetteEnMetal: req.body.valeurIndicateur.niv1.canetteEnMetal,
        masque: req.body.valeurIndicateur.niv1.masque,
        megot: req.body.valeurIndicateur.niv1.megot,
        pneu: req.body.valeurIndicateur.niv1.pneu,
        appareilMenager: req.body.valeurIndicateur.niv2.appareilMenager,
        ballonDeBaudruche: req.body.valeurIndicateur.niv2.ballonDeBaudruche,
        batonDeSucette: req.body.valeurIndicateur.niv2.batonDeSucette,
        batterie: req.body.valeurIndicateur.niv2.batterie,
        boiteDAppats: req.body.valeurIndicateur.niv2.boiteDAppats,
        boiteDeMedicaments: req.body.valeurIndicateur.niv2.boiteDeMedicaments,
        bouchonEnPlastique: req.body.valeurIndicateur.niv2.bouchonEnPlastique,
        briquet: req.body.valeurIndicateur.niv2.briquet,
        capsule: req.body.valeurIndicateur.niv2.capsule,
        cartoucheDeChasse: req.body.valeurIndicateur.niv2.cartoucheDeChasse,
        chaussure: req.body.valeurIndicateur.niv2.chaussure,
        contenantAlimentaire:
          req.body.valeurIndicateur.niv2.contenantAlimentaire,
        cordagesEmmeles: req.body.valeurIndicateur.niv2.cordagesEmmeles,
        cordageEtFicelle: req.body.valeurIndicateur.niv2.cordageEtFicelle,
        cotonTige: req.body.valeurIndicateur.niv2.cotonTige,
        filetInf50cm: req.body.valeurIndicateur.niv2.filetInf50cm,
        filetSup50cm: req.body.valeurIndicateur.niv2.filetSup50cm,
        gobelet: req.body.valeurIndicateur.niv2.gobelet,
        jouetEnPlastique: req.body.valeurIndicateur.niv2.jouetEnPlastique,
        materielDePeche: req.body.valeurIndicateur.niv2.materielDePeche,
        mediaFiltrant: req.body.valeurIndicateur.niv2.mediaFiltrant,
        mousse: req.body.valeurIndicateur.niv2.mousse,
        pailleEnPlastique: req.body.valeurIndicateur.niv2.pailleEnPlastique,
        protectionHygienique:
          req.body.valeurIndicateur.niv2.protectionHygienique,
        sacPlastique: req.body.valeurIndicateur.niv2.sacPlastique,
        vaisselleEnPlastique:
          req.body.valeurIndicateur.niv2.vaisselleEnPlastique,
        vetement: req.body.valeurIndicateur.niv2.vetement,
        dechetSpecifiqueId,
      })
      await depoll.save()
      res.status(201).json({ message: 'bien enregistré' })
    } catch (error) {
      console.log('error:', error)
      res.status(400).json({ error: error.message })
    }
  }
})

router.get('/', (req, res) => {
  Depoll.find()
    .then((depolls) => {
      const render = depolls
      return res.status(200).json(render)
    })
    .catch((error) => res.status(400).json({ error }))
})

module.exports = router
