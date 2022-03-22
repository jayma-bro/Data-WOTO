const express = require('express')
const router = express.Router()
const Depoll = require('../models/depoll')
const DechetSpecifique = require('../models/dechetSpecifique')

router.post('/', (req, res) => {
  const dateEvenement = new Date(req.body.dateEvenement)
  let dureeEvenement = null
  if (req.body.dureeEvenement) {
    dureeEvenement =
      parseInt(req.body.dureeEvenement.slice(0, 2)) * 60 +
      parseInt(req.body.dureeEvenement.slice(3, 5))
  }
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
        autresStructures: req.body.autresStructures
          ? req.body.autresStructures.split(',')
          : null,
        typesDechet: req.body.typesDechet,
        activites: req.body.activites,
        frequentation: req.body.frequentation,
        quantiteDechet: req.body.quantiteDechet,
        pourquoiIlEnReste: req.body.pourquoiIlEnReste,
        commentaire: req.body.commentaire,
        dechetQuantitatifPoids: req.body.valeurQuantitatif.poids,
        dechetQuantitatifVolume: req.body.valeurQuantitatif.volume,
        dechetIndicateur: req.body.dechetIndicateur,
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
    .populate({
      path: 'crewId',
      populate: {
        path: 'crewTypeId',
      },
    })
    .populate('lieuId')
    .populate('dechetSpecifiqueId')
    .then((depolls) => {
      const render = depolls
      return res.status(200).json(render)
    })
    .catch((error) => res.status(400).json({ error }))
})

module.exports = router
