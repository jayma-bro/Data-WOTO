const express = require('express')
const router = express.Router()
const CrewType = require('../models/crewType')

router.get('/', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  CrewType.find()
    .then((render) => {
      res.status(200).json(render)
    })
    .catch((error) => res.status(404).json({ error }))
})

router.get('/:Id', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  CrewType.findById(req.params.Id)
    .then((render) => {
      res.status(200).json(render)
    })
    .catch((error) => res.status(404).json({ error }))
})

module.exports = router
