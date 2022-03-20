const mongoose = require('mongoose')

const dechetSpecifiqueSchema = mongoose.Schema({
  nom: { type: String, required: true },
  volume: { type: Number, required: true },
  desc: String,
  volEst: { type: String, required: true },
  provenance: [String],
  commentaire: String,
  poids: Number,
  nombre: Number,
})

module.exports = mongoose.model(
  'DechetSpecifique',
  dechetSpecifiqueSchema,
  'dechet_specifique'
)
