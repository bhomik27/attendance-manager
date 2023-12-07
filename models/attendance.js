// attendance.js (Model)
const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Attendance = sequelize.define('attendance', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    date: {
        type: Sequelize.DATEONLY,
        allowNull: false
    },
    data: {
        type: Sequelize.JSON, // Assuming data holds attendance for students
        allowNull: false
    }
});

module.exports = Attendance;
