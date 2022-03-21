const mongoose = require('mongoose')

const lieuSchema = mongoose.Schema({
  createdTime: {
    type: Date,
    immutable: true,
    default: () => Date.now(),
    required: true,
  },
  lieu: { type: String, required: true },
  ville: { type: String },
  localisation: { type: [Number], required: true },
  polyline: { type: [[Number, Number]], required: true },
  polygon: { type: [[Number, Number]], required: true },
  pays: String,
  longueur: Number,
  surface: { type: Number, required: true },
  typeLieu: { type: String, required: true },
})

module.exports = mongoose.model('Lieu', lieuSchema, 'lieu')
