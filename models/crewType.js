const mongoose = require('mongoose')

const crewTypeSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
})

module.exports = mongoose.model('CrewType', crewTypeSchema, 'crew_type')
