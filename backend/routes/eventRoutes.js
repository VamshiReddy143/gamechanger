// eventRoutes.js
const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const auth = require('../middleware/auth');

router.post('/', auth, eventController.createEvent);
router.get('/team/:teamId', auth, eventController.getEventsByTeam);
router.put('/:id', auth, eventController.updateEvent);
router.delete('/:id', auth, eventController.deleteEvent);

module.exports = router;