const express = require('express')
const router = express.Router()
const Crew = require('../models/crew')
const CrewType = require('../models/crewType')

router.get('/', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  run()
  async function run() {
    try {
      const result = {}
      result.crew = await Crew.find().populate('crewTypeId')
      result.crewType = await CrewType.find()
      res.status(200).json(result)
    } catch (error) {
      res.status(404).json({ error })
    }
  }
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
