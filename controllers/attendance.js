// attendanceController.js (Controller)
const Attendance = require('../models/attendance');

exports.getAttendanceData = async (req, res, next) => {
    try {
        const attendanceData = await Attendance.findAll();
        res.json(attendanceData);
    } catch (error) {
        console.error('Error fetching attendance data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.postAttendanceData = async (req, res, next) => {
    const { date, data } = req.body;
    try {
        const createdAttendance = await Attendance.create({ date, data });
        res.status(201).json(createdAttendance);
    } catch (error) {
        console.error('Error creating attendance data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

