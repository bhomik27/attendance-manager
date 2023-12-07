const students = [
    { name: 'Aman', attendance: [] },
    { name: 'Bhomik', attendance: [] },
    { name: 'chetan', attendance: [] },
    { name: 'deepak', attendance: [] },
    { name: 'gaurav', attendance: [] },
    { name: 'harsh', attendance: [] }
    // { name: 'jai', attendance: [] },
    // { name: 'kirti', attendance: [] },
    // { name: 'lovesh', attendance: [] }
];

let currentAttendance = null;
let attendanceTable;


async function getAttendance() {
    const selectedDate = document.getElementById('date').value;


    try {
        const response = await axios.get('https://crudcrud.com/api/4a1cfc0b439240a09cd433c7d880719c/attendanceData');
        const attendanceData = response.data;

        let attendanceFound = false;

        for (let i = 0; i < attendanceData.length; i++) {
            if (attendanceData[i].date === selectedDate) {
                displayAttendance(selectedDate, attendanceData[i].data);
                attendanceFound = true;
                break;
            }
        }

        if (!attendanceFound) {
            console.log(`No attendance data found for ${selectedDate}`);
            displayStudents(selectedDate);
        }

    } catch (error) {
        console.error('Error fetching attendance data:', error);
        // Handle any errors that occur during the GET request
    }
}



window.addEventListener("DOMContentLoaded", async () => {
    const attendance = [
        {
            date, students
        }
    ]
})

function displayStudents() {


    const attendanceContainer = document.createElement('div');
    attendanceContainer.id = 'attendance-container';

    const existingAttendanceReport = document.getElementById('attendance-report');
    const existingattendanceContainer = document.getElementById('attendance-container');
    const existingattendanceTable = document.getElementById('attendance-table');

    if (existingAttendanceReport) {
        existingAttendanceReport.innerHTML = '';
    }

    if (existingattendanceContainer) {
        existingattendanceContainer.innerHTML = '';
    }
    if (existingattendanceTable) {
        existingattendanceTable.innerHTML = '';
    }


    students.forEach((student, index) => {
        const studentDiv = document.createElement('div');

        const nameLabel = document.createElement('label');
        nameLabel.textContent = student.name;

        const presentRadio = document.createElement('input');
        presentRadio.type = 'radio';
        presentRadio.name = `attendance-${index}`;
        presentRadio.value = 'present';

        const presentLabel = document.createElement('label');
        presentLabel.textContent = 'Present';

        const absentRadio = document.createElement('input');
        absentRadio.type = 'radio';
        absentRadio.name = `attendance-${index}`;
        absentRadio.value = 'absent';

        const absentLabel = document.createElement('label');
        absentLabel.textContent = 'Absent';

        studentDiv.appendChild(nameLabel);
        studentDiv.appendChild(presentRadio);
        studentDiv.appendChild(presentLabel);
        studentDiv.appendChild(absentRadio);
        studentDiv.appendChild(absentLabel);

        attendanceContainer.appendChild(studentDiv);
    });

    const submitButton = document.createElement('button');
    submitButton.textContent = 'Submit Attendance';
    submitButton.addEventListener('click', submitAttendance);
    attendanceContainer.appendChild(submitButton);

    const selectedDate = document.getElementById('date').value;
    const dateMessage = document.createElement('p');
    dateMessage.textContent = `Attendance for ${selectedDate}:`;
    dateMessage.setAttribute('data-date', selectedDate);

    const body = document.querySelector('body');
    const existingAttendanceContainer = document.getElementById('attendance-container');

    if (existingAttendanceContainer) {
        existingAttendanceContainer.remove();
    }

    body.appendChild(attendanceContainer);

    removeExistingDateMessage(selectedDate);


    const existingTable = document.getElementById('attendance-table');
    const existingDateMessage = document.querySelector(`p[data-date="${selectedDate}"]`);

    if (existingTable) {
        existingTable.remove();
    }
    if (existingDateMessage) {
        existingDateMessage.remove();
    }


    attendanceContainer.appendChild(dateMessage);
}



function removeExistingDateMessage(selectedDate) {
    const existingDateMessage = document.querySelector(`p[data-date="${selectedDate}"]`);
    if (existingDateMessage) {
        existingDateMessage.remove();
    }
}



async function submitAttendance() {
    const selectedDate = document.getElementById('date').value;
    const attendanceData = [];

    students.forEach((student, index) => {
        const status = Array.from(document.getElementsByName(`attendance-${index}`)).find(radio => radio.checked)?.value;
        if (status) {
            student.attendance[selectedDate] = status;
            attendanceData.push({ name: student.name, status });
        }
    });

    try {
        const response = await axios.post('https://crudcrud.com/api/4a1cfc0b439240a09cd433c7d880719c/attendanceData', {
            date: selectedDate,
            data: attendanceData
        });


        console.log('Attendance data sent to the server:', response.data);

        getAttendance(); // Refresh attendance display after submission
        removeInputElements();
    } catch (error) {
        console.error('Error sending attendance data:', error);
    }
}



function removeInputElements() {
    const attendanceContainer = document.getElementById('attendance-container');
    if (attendanceContainer) {
        attendanceContainer.remove();
    }
}

async function getAttendanceReport() {
    try {
        const response = await axios.get('https://crudcrud.com/api/4a1cfc0b439240a09cd433c7d880719c/attendanceData');
        const attendanceData = response.data;

        const attendanceReport = {};

        // Loop through each student
        students.forEach(student => {
            let daysPresent = 0;

            // Loop through attendance data to count days present for the current student
            attendanceData.forEach(entry => {
                const studentAttendance = entry.data.find(data => data.name === student.name);
                if (studentAttendance && studentAttendance.status === 'present') {
                    daysPresent++;
                }
            });

            // Update attendance report for the current student
            attendanceReport[student.name] = {
                daysPresent,
                totalDaysAttendance: attendanceData.length
            };
        });

        // Log or utilize attendance report data as needed
        console.log('Attendance Report:', attendanceReport);
        displayAttendanceReport(attendanceReport);
        // You can also display or utilize this data for further processing/UI update
    } catch (error) {
        console.error('Error fetching attendance data:', error);
    }
}

function displayAttendanceReport(attendanceReport) {

    const existingattendanceContainer = document.getElementById('attendance-container');
    const existingattendanceTable = document.getElementById('attendance-table');

    if (existingattendanceContainer) {
        existingattendanceContainer.innerHTML = '';
    }
    if (existingattendanceTable) {
        existingattendanceTable.innerHTML = '';
    }


    const reportContainer = document.createElement('div');
    reportContainer.id = 'attendance-report';

    const reportTitle = document.createElement('h2');
    reportTitle.textContent = 'Attendance Report';
    reportContainer.appendChild(reportTitle);

    const reportTable = document.createElement('table');
    reportTable.classList.add('attendance-table');

    // Create table headers
    const tableHeader = reportTable.createTHead();
    const headerRow = tableHeader.insertRow();
    const nameHeader = headerRow.insertCell();
    nameHeader.textContent = 'Student Name';
    const attendanceFractionHeader = headerRow.insertCell();
    attendanceFractionHeader.textContent = 'Attendance';
    const percentageHeader = headerRow.insertCell();
    percentageHeader.textContent = 'Attendance Percentage';

    // Create table body
    const tableBody = reportTable.createTBody();
    Object.keys(attendanceReport).forEach(studentName => {
        const studentReport = attendanceReport[studentName];
        const row = tableBody.insertRow();
        const nameCell = row.insertCell();
        nameCell.textContent = studentName;
        const attendanceFractionCell = row.insertCell();
        const attendanceFraction = `${studentReport.daysPresent}/${studentReport.totalDaysAttendance}`;
        attendanceFractionCell.textContent = attendanceFraction;
        const percentageCell = row.insertCell();
        const attendancePercentage = ((studentReport.daysPresent / studentReport.totalDaysAttendance) * 100).toFixed(2);
        percentageCell.textContent = `${attendancePercentage}%`;
    });

    reportContainer.appendChild(reportTable);

    const body = document.querySelector('body');
    const existingReportContainer = document.getElementById('attendance-report');

    if (existingReportContainer) {
        existingReportContainer.remove();
    }

    body.appendChild(reportContainer);
}





function displayAttendance(selectedDate, attendanceData) {
    const body = document.querySelector('body');

    const existingAttendanceReport = document.getElementById('attendance-report');
    const existingattendanceContainer = document.getElementById('attendance-container');
    const existingattendanceTable = document.getElementById('attendance-table');

    if (existingAttendanceReport) {
        existingAttendanceReport.innerHTML = '';
    }
    if (existingattendanceContainer) {
        existingattendanceContainer.innerHTML = '';
    }
    if (existingattendanceTable) {
        existingattendanceTable.innerHTML = '';
    }



    const attendanceTable = createAttendanceTable(selectedDate, attendanceData);
    attendanceTable.id = 'attendance-table';
    body.appendChild(attendanceTable);

    removeExistingDateMessage(selectedDate);

    const dateMessage = document.createElement('p');
    dateMessage.textContent = `Attendance for ${selectedDate}:`;
    dateMessage.setAttribute('data-date', selectedDate);
    attendanceTable.appendChild(dateMessage);
}



function getStudentAttendance(studentName, selectedDate, attendanceData) {
    const studentAttendance = attendanceData.find(entry => entry.name === studentName);
    return studentAttendance ? studentAttendance.status : null;
}



function createAttendanceTable(selectedDate, attendanceData) {
    const attendanceTable = document.createElement('table');
    attendanceTable.id = 'attendance-table';

    const tableHeader = attendanceTable.createTHead();
    const headerRow = tableHeader.insertRow();
    const nameHeader = headerRow.insertCell();
    nameHeader.textContent = 'Student Name';
    const statusHeader = headerRow.insertCell();
    statusHeader.textContent = 'Attendance Status';

    const tableBody = attendanceTable.createTBody();
    students.forEach(student => {
        const row = tableBody.insertRow();
        const nameCell = row.insertCell();
        nameCell.textContent = student.name;
        const statusCell = row.insertCell();
        const attendanceStatus = getStudentAttendance(student.name, selectedDate, attendanceData) || 'N/A';
        statusCell.textContent = attendanceStatus;

        // Add classes for symbols based on attendance status
        const symbol = document.createElement('span');
        symbol.classList.add('attendance-symbol');

        if (attendanceStatus === 'present') {
            symbol.textContent = '✅';
            symbol.classList.add('present');
        } else if (attendanceStatus === 'absent') {
            symbol.textContent = '❌';
            symbol.classList.add('absent');
        } else {
            symbol.textContent = '-';
        }

        statusCell.innerHTML = ''; // Clear the cell
        statusCell.appendChild(symbol); // Append the symbol span to the cell
    });

    return attendanceTable;
}



document.getElementById('search-button').addEventListener('click', getAttendance);
document.getElementById('attendance-report-button').addEventListener('click', getAttendanceReport);


document.addEventListener('DOMContentLoaded', function () {
    // Initial actions upon DOMContentLoaded
});
