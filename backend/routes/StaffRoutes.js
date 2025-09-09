// playerRoutes.js
const express = require('express');
const router = express.Router();
const staffController = require('../controllers/StaffController');
const auth = require('../middleware/auth');

router.post('/', auth, staffController.createStaff);
router.get('/team/:teamId', auth, staffController.getStaffByTeam);
router.put('/:id', auth, staffController.updateStaff);
router.delete('/:id', auth, staffController.deleteStaff);

module.exports = router;