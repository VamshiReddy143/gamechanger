const express = require('express');
const { createTeam, getTeams, getTeamById } = require('../controllers/createTeam.controller');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Only coaches can create teams
router.post('/create', authMiddleware, createTeam);

// Both coaches and users can view teams
router.get('/', authMiddleware, getTeams);

// Both coaches and users can view a specific team
router.get('/:id', authMiddleware, getTeamById);

module.exports = router;