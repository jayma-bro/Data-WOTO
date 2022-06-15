const mongoose = require('mongoose')

const depollSchema = mongoose.Schema({
  createdAt: {
    type: Date,
    immutable: true,
    required: true,
    default: () => Date.now(),
  },
  updatedAt: {
    type: Date,
    required: true,
    default: () => Date.now(),
  },
  relecture: { type: Boolean, required: true, default: false },
  lieuId: { type: mongoose.Types.ObjectId, required: true, ref: 'Lieu' },
  dateEvenement: { type: Date, required: true },
  dureeEvenement: { type: Number, required: true },
  nombreParticipantsWings: Number,
  nombreParticipantsExterne: Number,
  crewId: [
    {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'Crew',
    },
  ],
  autresStructures: [String],
  typesDechet: [String],
  activites: [String],
  frequentation: String,
  quantiteDechet: String,
  pourquoiIlEnReste: [String],
  commentaire: String,
  dechetQuantitatifPoids: {
    poidsPlastiqueNonRecy: Number,
    poidsPlastiqueRecy: Number,
    poidsMetal: Number,
    poidsVerreEtCeramique: Number,
    poidsTextile: Number,
    poidsPapierEtCarton: Number,
    poidsBois: Number,
    poidsCaoutchouc: Number,
    poidsAutre: Number,
  },
  dechetQuantitatifVolume: {
    volumePlastiqueNonRecy: Number,
    volumePlastiqueRecy: Number,
    volumeMetal: Number,
    volumeVerreEtCeramique: Number,
    volumeTextile: Number,
    volumePapierEtCarton: Number,
    volumeBois: Number,
    volumeCaoutchouc: Number,
    volumeAutre: Number,
  },
  dechetQuantitatifVolumineux: {
    volumineuxPlastiqueNonRecy: Number,
    volumineuxPlastiqueRecy: Number,
    volumineuxMetal: Number,
    volumineuxVerreEtCeramique: Number,
    volumineuxTextile: Number,
    volumineuxPapierEtCarton: Number,
    volumineuxBois: Number,
    volumineuxCaoutchouc: Number,
    volumineuxAutre: Number,
  },
  dechetIndicateur: { type: Map, of: Number },
  dechetSpecifiqueId: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'DechetSpecifique',
    },
  ],
  polyline: [[Number, Number]],
  polygon: [[Number, Number]],
  longueur: Number,
  surface: Number,
})

depollSchema.pre('save', function (next) {
  this.updatedAt = Date.now()
  next()
})

module.exports = mongoose.model('Depoll', depollSchema, 'depoll')
