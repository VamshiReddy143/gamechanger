const Stream = require('../models/Stream');
const Activity = require('../models/Activity');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

// @desc    Create a new stream
// @route   POST /api/streams
// @access  Private
exports.createStream = async (req, res) => {
  try {
    const { teamId, title } = req.body;
    if (!mongoose.Types.ObjectId.isValid(teamId)) {
      return res.status(400).json({ error: 'Invalid team ID' });
    }
    const roomId = uuidv4();
    const stream = new Stream({
      teamId,
      title,
      streamerId: req.user._id,
      roomId,
      status: 'active',
    });
    const savedStream = await stream.save();

    // Log activity
    const activity = new Activity({
      teamId,
      type: 'stream_started',
      text: `Started live stream: ${title}`,
      time: new Date(),
    });
    await activity.save();

    res.status(201).json(savedStream);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Get active streams for a team
// @route   GET /api/streams/team/:teamId
// @access  Private
exports.getStreamsByTeam = async (req, res) => {
  try {
    const { teamId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(teamId)) {
      return res.status(400).json({ error: 'Invalid team ID' });
    }
    const streams = await Stream.find({ teamId, status: 'active' });
    res.json(streams);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    End a stream
// @route   PUT /api/streams/:id/end
// @access  Private
exports.endStream = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid stream ID' });
    }
    const stream = await Stream.findByIdAndUpdate(
      id,
      { status: 'ended' },
      { new: true }
    );
    if (!stream) {
      return res.status(404).json({ error: 'Stream not found' });
    }
    res.json(stream);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};