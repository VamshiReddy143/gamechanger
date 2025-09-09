const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const auth = require('../middleware/auth');

router.get('/:teamId/activities', auth, activityController.getRecentActivities);

module.exports = router;