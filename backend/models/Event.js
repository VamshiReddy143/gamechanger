const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Team'
  },
  eventType: {
    type: String,
    required: true,
    enum: ['game', 'practice', 'other']
  },
  title: {
    type: String,
    required: function() {
      return this.eventType === 'other';
    }
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: function() {
      return this.eventType !== 'other';
    }
  },
  allDay: {
    type: Boolean,
    default: false
  },
  duration: {
    hours: Number,
    minutes: Number
  },
  arriveTime: Date,
  repeats: {
    type: String,
    enum: ['Never', 'Daily', 'Weekly', 'Monthly'],
    default: 'Never'
  },
  location: {
    type: String,
    required: true
  },
  locationCoords: {
    lat: Number,
    lng: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Event', EventSchema);