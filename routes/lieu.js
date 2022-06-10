const express = require('express')
const router = express.Router()
const Lieu = require('../models/lieu')
const Auth = require('../middleware/auth')

router.get('/', (req, res) => {
  Lieu.find()
    .then((render) => {
      res.status(200).json(render)
    })
    .catch((error) => res.status(404).json({ error }))
})

router.get('/:Id', (req, res) => {
  Lieu.findById(req.params.Id)
    .then((render) => {
      res.status(200).json(render)
    })
    .catch((error) => res.status(404).json({ error }))
})

router.put('/:Id', Auth, (req, res, next) => {
  Lieu.findByIdAndUpdate(req.params.Id, req.body, {
    new: true,
  })
    .then((render) => {
      res.status(201).json(render)
    })
    .catch((error) => res.status(404).json({ error }))
})

router.delete('/:Id', Auth, (req, res, next) => {
  Lieu.findByIdAndDelete(req.params.Id)
    .then((render) => {
      res.status(200).json(render)
    })
    .catch((error) => res.status(404).json({ error }))
})

router.post('/', (req, res, next) => {
  const lieu = new Lieu({
    ...req.body,
  })
  lieu
    .save()
    .then(() => {
      res.status(201).json({ message: 'Nouveau Lieu renseigné', lieu })
    })
    .catch((error) => {
      res.status(400).json({ error })
    })
})
module.exports = router
