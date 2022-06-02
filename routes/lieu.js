const express = require('express')
const router = express.Router()
const Lieu = require('../models/lieu')
const Auth = require('../middleware/auth')

router.get('/', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  run()
  async function run() {
    try {
      const lieu = await Lieu.find()
      res.status(200).json(lieu)
    } catch (error) {
      res.status(404).json({ error })
    }
  }
})

router.get('/:Id', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  run()
  async function run() {
    try {
      const result = await Lieu.findById(req.params.Id)
      res.status(200).json(result)
    } catch (error) {
      res.status(404).json({ error })
    }
  }
})

router.put('/:Id', Auth, (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  run()
  async function run() {
    try {
      const result = await Lieu.findByIdAndUpdate(req.params.Id, req.body, {
        new: true,
      })
      res.status(201).json(result)
    } catch (error) {
      res.status(404).json({ error })
    }
  }
})

router.delete('/:Id', Auth, (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  run()
  async function run() {
    try {
      const result = await Lieu.findByIdAndDelete(req.params.Id)
      res.status(201).json(result)
    } catch (error) {
      res.status(404).json({ error })
    }
  }
})

router.post('/', (req, res, next) => {
  const lieu = new Lieu({
    ...req.body,
  })
  lieu
    .save()
    .then(() => {
      res.status(201).json({ message: 'Nouveau Lieu renseigné' })
    })
    .catch((error) => {
      res.status(400).json({ error })
    })
})

module.exports = router
