const express = require('express')
const router = express.Router()
const Lieu = require('../models/lieu')

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
