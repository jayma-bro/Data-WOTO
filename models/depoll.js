let mongoose = require('mongoose');

const depollSchema = mongoose.Schema({
  lieu: { type: String, required: true },
  ville: { type: String, required: true },
  dateEvenement: { type: Date, required: true },
  dureeEvenement: String,
  nombreParticipantsWings: Number,
});

module.exports = mongoose.model('Depoll', depollSchema);
