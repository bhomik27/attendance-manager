const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./util/database');

const attendanceRoutes = require('./routes/attendance');

const app = express();

var cors = require('cors');

app.use(cors());

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/attendance', attendanceRoutes);

sequelize.sync()
    .then(result => {
        console.log('Database synced');
        app.listen(3000);
    })
    .catch(err => console.log(err));
