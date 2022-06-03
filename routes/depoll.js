const express = require('express')
const router = express.Router()
const Depoll = require('../models/depoll')
const Auth = require('../middleware/auth')

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
    .then((render) => {
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

router.get('/:Id', (req, res) => {
  Depoll.findById(req.params.Id)
    .populate({
      path: 'crewId',
      populate: {
        path: 'crewTypeId',
      },
    })
    .populate('lieuId')
    .populate('dechetSpecifiqueId')
    .then((render) => {
      return res.status(200).json(render)
    })
    .catch((error) => res.status(400).json({ error }))
})

router.put('/:Id', Auth, (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  Depoll.findByIdAndUpdate(req.params.Id, req.body, {
    new: true,
  })
    .then((render) => {
      res.status(201).json(render)
    })
    .catch((error) => res.status(404).json({ error }))
})

router.delete('/:Id', Auth, (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  Depoll.findByIdAndDelete(req.params.Id)
    .then((render) => {
      res.status(200).json(render)
    })
    .catch((error) => res.status(404).json({ error }))
})

router.post('/', (req, res, next) => {
  const depoll = new Depoll({
    ...req.body,
  })
  depoll
    .save()
    .then(() => {
      res.status(201).json({ message: 'dépollution bien enregistré' })
    })
    .catch((error) => {
      res.status(400).json({ error })
    })
})

module.exports = router
