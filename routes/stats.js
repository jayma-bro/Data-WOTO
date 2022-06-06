const express = require('express')
const router = express.Router()
const Depoll = require('../models/depoll')

router.get('/general', (req, res) => {
  Depoll.find()
    .then((depolls) => {
      const render = { poidsTotal: 0, volumeTotal: 0, surfaceTotal: 0 }
      for (const depoll of depolls) {
        render.poidsTotal +=
          depoll.poidsPlastiqueNonRecy +
          depoll.poidsPlastiqueRecy +
          depoll.poidsMetal +
          depoll.poidsVerreEtCeramique +
          depoll.poidsTextile +
          depoll.poidsPapierEtCarton +
          depoll.poidsBois +
          depoll.poidsCaoutchouc +
          depoll.poidsAutre
        render.volumeTotal +=
          depoll.volumePlastiqueNonRecy +
          depoll.volumePlastiqueRecy +
          depoll.volumeMetal +
          depoll.volumeVerreEtCeramique +
          depoll.volumeTextile +
          depoll.volumePapierEtCarton +
          depoll.volumeBois +
          depoll.volumeCaoutchouc +
          depoll.volumeAutre
        render.surfaceTotal += depoll.surface
      }
      render.surfaceTotal = Math.round(render.surfaceTotal)
      return res.status(200).json(render)
    })
    .catch((error) => res.status(400).json({ error }))
})

module.exports = router
