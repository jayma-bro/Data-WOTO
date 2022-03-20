const express = require('express')
const Mongoose = require('mongoose')
const router = express.Router()
const Test = require('../models/test')

router.get('/', (req, res, next) => {
  Test.find()
    .populate('crewId')
    .then((ressult) => {
      res.status(200).json(ressult)
    })
    .catch((error) => {
      res.status(404).json({ error })
    })
})
router.post('/', (req, res, next) => {
  const test = new Test({
    testText: req.body.text2,
    crewId: Mongoose.Types.ObjectId(req.body.crewId),
  })
  test
    .save()
    .then(() => {
      res.status(201).json({ message: 'Nouveau Crew renseigné' })
    })
    .catch((error) => {
      res.status(400).json({ error })
    })
})

module.exports = router
