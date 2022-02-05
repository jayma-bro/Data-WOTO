const express = require('express')
const router = express.Router()
const Crew = require('../models/crew')

router.get('/', (req, res) => {
  Crew.find()
  .then((crews) => {
    res.status(200).json(crews)
  })
  .catch((error) => {
    res.status(404).json({error})
  })
})

router.post('/', (req, res, next) => {
  const crew = new Crew({
    createdTime: new Date(Date.now()),
    crewType: req.body.crewType,
    crewName: req.body.crewName
  });
  crew.save()
  .then(() => {
    res.status(201).json({message: 'Nouveau Crew renseigné'})
  })
  .catch((error) => {
    res.status(400).json({error})
  })
})


module.exports = router
