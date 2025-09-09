const Staff = require('../models/Staff');
const mongoose = require('mongoose');


// @desc    Create a new staff
// @route   POST /api/staff
// @access  Private
exports.createStaff = async (req, res) => {
  try {
    const { teamId, firstName, lastName,staffEmail } = req.body;

    // Validate teamId
    if (!mongoose.Types.ObjectId.isValid(teamId)) {
      return res.status(400).json({ error: 'Invalid team ID' });
    }

    const StaffMember = new Staff({
      teamId,
      firstName,
      lastName,
      staffEmail
    });

    const savedStaff = await StaffMember.save();



    res.status(201).json(savedStaff);
  } catch (err) {
    console.error(err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ errors: err.errors });
    }
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Get all staff for a team
// @route   GET /api/staff/team/:teamId
// @access  Private
exports.getStaffByTeam = async (req, res) => {
  try {
    const { teamId } = req.params;

    // Validate teamId
    if (!mongoose.Types.ObjectId.isValid(teamId)) {
      return res.status(400).json({ error: 'Invalid team ID' });
    }

    const StaffMembers = await Staff.find({ teamId }).sort({ lastName: 1 });
    res.json(StaffMembers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Update a player
// @route   PUT /api/players/:id
// @access  Private
exports.updateStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName,staffEmail } = req.body;

    // Validate player ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid Staff ID' });
    }

    const Staffmember = await Staff.findByIdAndUpdate(
      id,
      {
        firstName,
        lastName,
        staffEmail
      },
      { new: true, runValidators: true }
    );

    if (!Staffmember) {
      return res.status(404).json({ error: 'Staff not found' });
    }

    res.json(Staffmember);
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
exports.deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate player ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid staff ID' });
    }

    const Staffmember = await Staff.findByIdAndDelete(id);

    if (!Staffmember) {
      return res.status(404).json({ error: 'staff not found' });
    }

    res.json({ message: 'staff deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};