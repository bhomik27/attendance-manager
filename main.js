const students = [
    { name: 'Aman', attendance: [] },
    { name: 'Bhomik', attendance: [] },
    { name: 'chetan', attendance: [] },
    { name: 'deepak', attendance: [] },
    { name: 'gaurav', attendance: [] },
    { name: 'harsh', attendance: [] }
];


//function to check if attendance for the day and take actions accordingly
//if attedance data matches the date selected than displayStudents 
//else display the attendance result of that day 
async function getAttendance() {
    const selectedDate = document.getElementById('date').value;

    try {
        const response = await axios.get(`http://localhost:3000/attendance/attendanceData`);
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
    }
}



//function to show student attendance form on front-end
function displayStudents() {
    const attendanceContainer = document.createElement('div');
    attendanceContainer.id = 'attendance-container';

    const existingAttendanceReport = document.getElementById('attendance-report');
    const existingAttendanceContainer = document.getElementById('attendance-container');
    const existingAttendanceTable = document.getElementById('attendance-table');

    if (existingAttendanceReport) {
        existingAttendanceReport.remove();
        existingAttendanceReport.innerHTML = '';
    }

    if (existingAttendanceContainer) {
        existingAttendanceContainer.remove();
        existingAttendanceContainer.innerHTML = '';
    }
    if (existingAttendanceTable) {
        existingAttendanceTable.remove();
        existingAttendanceTable.innerHTML = '';
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

    body.appendChild(attendanceContainer);



    const existingDateMessage = document.querySelector(`p[data-date="${selectedDate}"]`);

    if (existingDateMessage) {
        existingDateMessage.remove();
    }

    attendanceContainer.appendChild(dateMessage);
}






//function to post attendanceDate to server using axios POST request 
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
        const response = await axios.post(`http://localhost:3000/attendance/attendanceData`, {
            date: selectedDate,
            data: attendanceData
        });

        console.log('Attendance data sent to the server:', response.data);

        getAttendance(); // Refresh attendance display after submission
    } catch (error) {
        console.error('Error sending attendance data:', error);
    }
}




//function to get the attendanceData from the server 
async function getAttendanceReport() {
    try {
        const response = await axios.get(`http://localhost:3000/attendance/attendanceData`);
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


//function to print attendance report on front-end in tabular form 
function displayAttendanceReport(attendanceReport) {
    const existingAttendanceReport = document.getElementById('attendance-report');
    const existingAttendanceContainer = document.getElementById('attendance-container');
    const existingAttendanceTable = document.getElementById('attendance-table');

    if (existingAttendanceReport) {
        existingAttendanceReport.remove();
        existingAttendanceReport.innerHTML = '';
    }

    if (existingAttendanceContainer) {
        existingAttendanceContainer.remove();
        existingAttendanceContainer.innerHTML = '';
    }
    if (existingAttendanceTable) {
        existingAttendanceTable.remove();
        existingAttendanceTable.innerHTML = '';
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




//function to print attendance oif the sekected date in front-end 
function displayAttendance(selectedDate, attendanceData) {
    const body = document.querySelector('body');

    const existingAttendanceReport = document.getElementById('attendance-report');
    const existingAttendanceContainer = document.getElementById('attendance-container');
    const existingAttendanceTable = document.getElementById('attendance-table');

    if (existingAttendanceReport) {
        existingAttendanceReport.remove();
        existingAttendanceReport.innerHTML = '';
    }

    if (existingAttendanceContainer) {
        existingAttendanceContainer.remove();
        existingAttendanceContainer.innerHTML = '';
    }
    if (existingAttendanceTable) {
        existingAttendanceTable.remove();
        existingAttendanceTable.innerHTML = '';
    }


    const attendanceTable = createAttendanceTable(selectedDate, attendanceData);
    attendanceTable.id = 'attendance-table';
    body.appendChild(attendanceTable);

    const existingDateMessage = document.querySelector(`p[data-date="${selectedDate}"]`);

    if (existingDateMessage) {
        existingDateMessage.remove();
    }

    const dateMessage = document.createElement('p');
    dateMessage.textContent = `Attendance for ${selectedDate}:`;
    dateMessage.setAttribute('data-date', selectedDate);
    attendanceTable.appendChild(dateMessage);
}


//utlity func to get the attendance data status if everty student 
function getStudentAttendance(studentName, selectedDate, attendanceData) {
    const studentAttendance = attendanceData.find(entry => entry.name === studentName);
    return studentAttendance ? studentAttendance.status : null;
}


//function to create attendance table 
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


