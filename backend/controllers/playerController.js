const Player = require('../models/Player');
const Activity = require('../models/Activity');
const mongoose = require('mongoose');

// @desc    Create a new player
// @route   POST /api/players
// @access  Private
exports.createPlayer = async (req, res) => {
  try {
    const { teamId, firstName, lastName, jerseyNumber, position, parentEmail } = req.body;

    // Validate teamId
    if (!mongoose.Types.ObjectId.isValid(teamId)) {
      return res.status(400).json({ error: 'Invalid team ID' });
    }

    const player = new Player({
      teamId,
      firstName,
      lastName,
      jerseyNumber,
      position,
      parentEmail
    });

    const savedPlayer = await player.save();

    // Log activity
    const activity = new Activity({
      teamId,
      type: 'player_added',
      text: `Added player ${firstName} ${lastName}${position ? ` as ${position}` : ''}`,
      time: new Date()
    });
    await activity.save();

    res.status(201).json(savedPlayer);
  } catch (err) {
    console.error(err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ errors: err.errors });
    }
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Get all players for a team
// @route   GET /api/players/team/:teamId
// @access  Private
exports.getPlayersByTeam = async (req, res) => {
  try {
    const { teamId } = req.params;

    // Validate teamId
    if (!mongoose.Types.ObjectId.isValid(teamId)) {
      return res.status(400).json({ error: 'Invalid team ID' });
    }

    const players = await Player.find({ teamId }).sort({ lastName: 1 });
    res.json(players);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Update a player
// @route   PUT /api/players/:id
// @access  Private
exports.updatePlayer = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, jerseyNumber, position, parentEmail } = req.body;

    // Validate player ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid player ID' });
    }

    const player = await Player.findByIdAndUpdate(
      id,
      {
        firstName,
        lastName,
        jerseyNumber,
        position,
        parentEmail
      },
      { new: true, runValidators: true }
    );

    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    res.json(player);
  } catch (err) {
    console.error(err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ errors: err.errors });
    }
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Delete a player
// @route   DELETE /api/players/:id
// @access  Private
exports.deletePlayer = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate player ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid player ID' });
    }

    const player = await Player.findByIdAndDelete(id);

    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    res.json({ message: 'Player deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};