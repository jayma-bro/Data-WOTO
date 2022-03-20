const mongoose = require('mongoose')

const testSchema = mongoose.Schema({
  testText: String,
  crewId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'Crew',
  },
})

module.exports = mongoose.model('test', testSchema, 'test')
