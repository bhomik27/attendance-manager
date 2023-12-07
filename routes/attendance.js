// attendanceRoutes.js (Routes)
const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendance');

router.get('/attendanceData', attendanceController.getAttendanceData);
router.post('/attendanceData', attendanceController.postAttendanceData);
// Define other routes for updating,

module.exports = router;                                        