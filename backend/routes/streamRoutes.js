const express = require('express');
const router = express.Router();
const streamController = require('../controllers/streamController');
const auth = require('../middleware/auth');

router.post('/', auth, streamController.createStream);
router.get('/team/:teamId', auth, streamController.getStreamsByTeam);
router.put('/:id/end', auth, streamController.endStream);

module.exports = router;