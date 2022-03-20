const mongoose = require('mongoose')

const crewSchema = mongoose.Schema({
  createdTime: {
    type: Date,
    immutable: true,
    default: () => Date.now(),
    required: true,
  },
  crewTypeId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'CrewType',
  },
  crewName: {
    type: String,
    required: true,
  },
})

module.exports = mongoose.model('Crew', crewSchema, 'crew')
