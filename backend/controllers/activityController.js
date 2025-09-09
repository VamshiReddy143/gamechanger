const Activity = require('../models/Activity');
const mongoose = require('mongoose');

// @desc    Get recent activities for a team
// @route   GET /api/teams/:teamId/activities
// @access  Private
exports.getRecentActivities = async (req, res) => {
  try {
    const { teamId } = req.params;

    // Validate teamId
    if (!mongoose.Types.ObjectId.isValid(teamId)) {
      return res.status(400).json({ error: 'Invalid team ID' });
    }

    const activities = await Activity.find({ teamId })
      .sort({ createdAt: -1 }) // Sort by most recent first
      .limit(10); // Limit to 10 activities for performance

    res.json(activities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};