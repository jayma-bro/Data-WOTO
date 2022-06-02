const express = require('express')
const router = express.Router()
const CrewType = require('../models/crewType')

router.get('/', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  run()
  async function run() {
    try {
      const result = await CrewType.find()
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
      const result = await CrewType.findById(req.params.Id)
      res.status(200).json(result)
    } catch (error) {
      res.status(404).json({ error })
    }
  }
})

module.exports = router
