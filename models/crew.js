let mongoose = require('mongoose');

const crewSchema = mongoose.Schema({
  createdTime: { type: Date, required: true },
  crewType: { type: String, required: true },
  crewName: { type: String, required: true }
});

module.exports = mongoose.model('Crew', crewSchema);
