// playerRoutes.js
const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');
const auth = require('../middleware/auth');

router.post('/', auth, playerController.createPlayer);
router.get('/team/:teamId', auth, playerController.getPlayersByTeam);
router.put('/:id', auth, playerController.updatePlayer);
router.delete('/:id', auth, playerController.deletePlayer);

module.exports = router;