const express = require('express')
const router = express.Router()
const Crew = require('../models/crew')
const Auth = require('../middleware/auth')

router.get('/', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  Crew.find()
    .populate('crewTypeId')
    .then((render) => {
      res.status(200).json(render)
    })
    .catch((error) => res.status(404).json({ error }))
})

router.get('/:Id', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  Crew.findById(req.params.Id)
    .populate('crewTypeId')
    .then((render) => {
      res.status(200).json(render)
    })
    .catch((error) => res.status(404).json({ error }))
})

router.put('/:Id', Auth, (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  Crew.findByIdAndUpdate(req.params.Id, req.body, {
    new: true,
  })
    .then((render) => {
      res.status(201).json(render)
    })
    .catch((error) => res.status(404).json({ error }))
})

router.delete('/:Id', Auth, (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  Crew.findByIdAndDelete(req.params.Id)
    .then((render) => {
      res.status(200).json(render)
    })
    .catch((error) => res.status(404).json({ error }))
})

router.post('/', (req, res, next) => {
  const crew = new Crew({
    ...req.body,
  })
  crew
    .save()
    .then(() => {
      res.status(201).json({ message: 'Nouveau Crew renseigné', crew })
    })
    .catch((error) => {
      res.status(400).json({ error })
    })
})

module.exports = router
