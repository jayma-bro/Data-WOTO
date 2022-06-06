const express = require('express')
const router = express.Router()
const DechetSpecifique = require('../models/dechetSpecifique')
const Auth = require('../middleware/auth')

router.get('/', (req, res) => {
  DechetSpecifique.find()
    .then((render) => {
      res.status(200).json(render)
    })
    .catch((error) => res.status(404).json({ error }))
})

router.get('/:Id', (req, res) => {
  DechetSpecifique.findById(req.params.Id)
    .then((render) => {
      res.status(200).json(render)
    })
    .catch((error) => res.status(404).json({ error }))
})

router.put('/:Id', Auth, (req, res, next) => {
  DechetSpecifique.findByIdAndUpdate(req.params.Id, req.body, {
    new: true,
  })
    .then((render) => {
      res.status(201).json(render)
    })
    .catch((error) => res.status(404).json({ error }))
})

router.delete('/:Id', Auth, (req, res, next) => {
  DechetSpecifique.findByIdAndDelete(req.params.Id)
    .then((render) => {
      res.status(200).json(render)
    })
    .catch((error) => res.status(404).json({ error }))
})

router.post('/', (req, res, next) => {
  const dechetSpecifique = new DechetSpecifique({
    ...req.body,
  })
  dechetSpecifique
    .save()
    .then(() => {
      res.status(201).json({
        message: 'Nouveau dechet specifique renseigné',
        dechetSpecifique,
      })
    })
    .catch((error) => {
      res.status(400).json({ error })
    })
})

module.exports = router
