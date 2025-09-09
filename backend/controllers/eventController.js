const Event = require('../models/Event');
const Activity = require('../models/Activity');
const mongoose = require('mongoose');

// @desc    Create a new event
// @route   POST /api/events
// @access  Private
exports.createEvent = async (req, res) => {
  try {
    const { teamId, eventType, title, startDate, endDate, allDay, duration, arriveTime, repeats, location, locationCoords } = req.body;

    // Validate teamId
    if (!mongoose.Types.ObjectId.isValid(teamId)) {
      return res.status(400).json({ error: 'Invalid team ID' });
    }

    const event = new Event({
      teamId,
      eventType,
      title,
      startDate,
      endDate,
      allDay,
      duration,
      arriveTime,
      repeats,
      location,
      locationCoords
    });

    const savedEvent = await event.save();

    // Log activity
    const activity = new Activity({
      teamId,
      type: 'event_scheduled',
      text: `Scheduled ${eventType}${title ? `: ${title}` : ''} at ${location}`,
      time: new Date()
    });
    await activity.save();

    res.status(201).json(savedEvent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Get all events for a team
// @route   GET /api/events/team/:teamId
// @access  Private
exports.getEventsByTeam = async (req, res) => {
  try {
    const { teamId } = req.params;

    // Validate teamId
    if (!mongoose.Types.ObjectId.isValid(teamId)) {
      return res.status(400).json({ error: 'Invalid team ID' });
    }

    const events = await Event.find({ teamId }).sort({ startDate: 1 });
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private
exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { eventType, title, startDate, endDate, allDay, duration, arriveTime, repeats, location, locationCoords } = req.body;

    // Validate event ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid event ID' });
    }

    const event = await Event.findByIdAndUpdate(
      id,
      {
        eventType,
        title,
        startDate,
        endDate,
        allDay,
        duration,
        arriveTime,
        repeats,
        location,
        locationCoords
      },
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate event ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid event ID' });
    }

    const event = await Event.findByIdAndDelete(id);

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};