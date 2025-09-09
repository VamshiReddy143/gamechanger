const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['player_added', 'event_scheduled', 'other']
  },
  text: {
    type: String,
    required: true
  },
  time: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Activity', activitySchema);