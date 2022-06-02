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
          nom: dsIter.nomDS.trim(),
          volume: dsIter.volumeDS,
          desc: dsIter.descDS ? dsIter.descDS.trim() : null,
          volEst: dsIter.volEstDS,
          provenance: dsIter.provenanceDS,
          commentaire: dsIter.commentaireDS
            ? dsIter.commentaireDS.trim()
            : null,
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
          ? req.body.autresStructures.trim().split(',')
          : [],
        typesDechet: req.body.typesDechet,
        activites: req.body.activites,
        frequentation: req.body.frequentation,
        quantiteDechet: req.body.quantiteDechet,
        pourquoiIlEnReste: req.body.pourquoiIlEnReste,
        commentaire: req.body.commentaire ? req.body.commentaire.trim() : null,
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

router.get('/array', (req, res) => {
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
      const render = []
      for (const depoll in depolls) {
        const el = depolls[depoll]
        render.push({
          id: el._id,
          createdAt: el.createdAt,
          relecture: el.relecture,
          dateEvenement: el.dateEvenement,
          dureeEvenement: el.dureeEvenement,
          lieu: el.lieuId.lieu,
          localisation: el.lieuId.localisation.join(', '),
          ville: el.lieuId.ville,
          pays: el.lieuId.pays,
          longueur: el.lieuId.longueur,
          surface: el.lieuId.surface,
          typeLieu: el.lieuId.typeLieu,
          nombreParticipantsWings: el.nombreParticipantsWings,
          nombreParticipantsExterne: el.nombreParticipantsExterne,
          autresStructures: el.autresStructures.join(', '),
          typesDechet: el.typesDechet.join(', '),
          activites: el.activites.join(', '),
          frequentation: el.frequentation,
          quantiteDechet: el.quantiteDechet,
          pourquoiIlEnReste: el.pourquoiIlEnReste.join(', '),
          commentaire: el.commentaire,
          ...el.dechetQuantitatifPoids,
          ...el.dechetQuantitatifVolume,
        })
        const crewName = []
        const crewType = []
        for (const crew of el.crewId) {
          crewName.push(crew.crewName)
          crewType.push(crew.crewTypeId.name)
        }
        render[depoll].crewName = crewName.join('; ')
        render[depoll].crewType = crewType.join('; ')

        const DIobj = Object.fromEntries(el.dechetIndicateur)
        for (const DIId in DIobj) {
          render[depoll][DIId] = DIobj[DIId]
        }
        const DSnom = []
        const DSvolume = []
        const DSdesc = []
        const DSvolEst = []
        const DSprovenance = []
        const DScommentaire = []
        const DSpoids = []
        const DSnombre = []
        for (const ds of el.dechetSpecifiqueId) {
          DSnom.push(ds.nom)
          DSvolume.push(ds.volume)
          DSdesc.push(ds.desc)
          DSvolEst.push(ds.volEst)
          DSprovenance.push(ds.provenance.join(', '))
          DScommentaire.push(ds.commentaire)
          DSpoids.push(ds.poids)
          DSnombre.push(ds.nombre)
        }
        render[depoll].DSnom = DSnom.join('; ')
        render[depoll].DSvolume = DSvolume.join('; ')
        render[depoll].DSdesc = DSdesc.join('; ')
        render[depoll].DSvolEst = DSvolEst.join('; ')
        render[depoll].DSprovenance = DSprovenance.join('; ')
        render[depoll].DScommentaire = DScommentaire.join('; ')
        render[depoll].DSpoids = DSpoids.join('; ')
        render[depoll].DSnombre = DSnombre.join('; ')
      }
      return res.status(200).json(render)
    })
    .catch((error) => res.status(400).json({ error }))
})

router.get('/array/:crewId', (req, res) => {
  Depoll.find({ crewId: req.params.crewId })
    .populate({
      path: 'crewId',
      populate: {
        path: 'crewTypeId',
      },
    })
    .populate('lieuId')
    .populate('dechetSpecifiqueId')
    .then((depolls) => {
      const render = []
      for (const depoll in depolls) {
        const el = depolls[depoll]
        render.push({
          id: el._id,
          createdAt: el.createdAt,
          relecture: el.relecture,
          dateEvenement: el.dateEvenement,
          dureeEvenement: el.dureeEvenement,
          lieu: el.lieuId.lieu,
          localisation: el.lieuId.localisation.join(', '),
          ville: el.lieuId.ville,
          pays: el.lieuId.pays,
          longueur: el.lieuId.longueur,
          surface: el.lieuId.surface,
          typeLieu: el.lieuId.typeLieu,
          nombreParticipantsWings: el.nombreParticipantsWings,
          nombreParticipantsExterne: el.nombreParticipantsExterne,
          autresStructures: el.autresStructures.join(', '),
          typesDechet: el.typesDechet.join(', '),
          activites: el.activites.join(', '),
          frequentation: el.frequentation,
          quantiteDechet: el.quantiteDechet,
          pourquoiIlEnReste: el.pourquoiIlEnReste.join(', '),
          commentaire: el.commentaire,
          ...el.dechetQuantitatifPoids,
          ...el.dechetQuantitatifVolume,
        })
        const crewName = []
        const crewType = []
        for (const crew of el.crewId) {
          crewName.push(crew.crewName)
          crewType.push(crew.crewTypeId.name)
        }
        render[depoll].crewName = crewName.join('; ')
        render[depoll].crewType = crewType.join('; ')

        const DIobj = Object.fromEntries(el.dechetIndicateur)
        for (const DIId in DIobj) {
          render[depoll][DIId] = DIobj[DIId]
        }
        const DSnom = []
        const DSvolume = []
        const DSdesc = []
        const DSvolEst = []
        const DSprovenance = []
        const DScommentaire = []
        const DSpoids = []
        const DSnombre = []
        for (const ds of el.dechetSpecifiqueId) {
          DSnom.push(ds.nom)
          DSvolume.push(ds.volume)
          DSdesc.push(ds.desc)
          DSvolEst.push(ds.volEst)
          DSprovenance.push(ds.provenance.join(', '))
          DScommentaire.push(ds.commentaire)
          DSpoids.push(ds.poids)
          DSnombre.push(ds.nombre)
        }
        render[depoll].DSnom = DSnom.join('; ')
        render[depoll].DSvolume = DSvolume.join('; ')
        render[depoll].DSdesc = DSdesc.join('; ')
        render[depoll].DSvolEst = DSvolEst.join('; ')
        render[depoll].DSprovenance = DSprovenance.join('; ')
        render[depoll].DScommentaire = DScommentaire.join('; ')
        render[depoll].DSpoids = DSpoids.join('; ')
        render[depoll].DSnombre = DSnombre.join('; ')
      }
      return res.status(200).json(render)
    })
    .catch((error) => res.status(400).json({ error }))
})

module.exports = router
