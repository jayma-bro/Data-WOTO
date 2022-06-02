const express = require('express')
const router = express.Router()
const Crew = require('../models/crew')
// eslint-disable-next-line no-unused-vars
const CrewType = require('../models/crewType')
const Auth = require('../middleware/auth')

router.get('/', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  run()
  async function run() {
    try {
      const result = await Crew.find().populate('crewTypeId')
      res.status(200).json(result)
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
      const result = await Crew.findById(req.params.Id).populate('crewTypeId')
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
      const result = await Crew.findByIdAndUpdate(req.params.Id, req.body, {
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
      const result = await Crew.findByIdAndDelete(req.params.Id)
      res.status(201).json(result)
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
