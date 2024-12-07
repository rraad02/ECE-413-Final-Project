const weeklyData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
        {
            label: 'Average Heart Rate',
            data: [72, 75, 73, 74, 71, 78, 76],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2
        }
    ]
};

const dailyHeartRateData = {
    labels: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'],
    datasets: [
        {
            label: 'Heart Rate',
            data: [70, 73, 75, 78, 76, 74, 72],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 2
        }
    ]
};

const dailyOxygenData = {
    labels: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'],
    datasets: [
        {
            label: 'Blood Oxygen Level',
            data: [95, 96, 97, 96, 95, 97, 96],
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 2
        }
    ]
};

// Weekly Heart Rate Chart
new Chart(document.getElementById('weeklyHeartRateChart'), {
    type: 'bar',
    data: weeklyData,
    options: {
        responsive: true,
        plugins: {
            legend: { position: 'top' }
        }
    }
});

// Daily Heart Rate Chart
new Chart(document.getElementById('dailyHeartRateChart'), {
    type: 'line',
    data: dailyHeartRateData,
    options: {
        responsive: true,
        plugins: {
            legend: { position: 'top' }
        },
        scales: {
            x: { title: { display: true, text: 'Time of Day' } },
            y: { title: { display: true, text: 'Heart Rate (bpm)' } }
        }
    }
});

// Daily Oxygen Level Chart
new Chart(document.getElementById('dailyOxygenChart'), {
    type: 'line',
    data: dailyOxygenData,
    options: {
        responsive: true,
        plugins: {
            legend: { position: 'top' }
        },
        scales: {
            x: { title: { display: true, text: 'Time of Day' } },
            y: { title: { display: true, text: 'Oxygen Saturation (%)' } }
        }
    }
});

// Handle Settings Form Submission
document.getElementById('settingsForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const timeRange = document.getElementById('timeRange').value;
    const frequency = document.getElementById('frequency').value;
    alert(`Settings Saved:\nTime Range: ${timeRange}\nFrequency: ${frequency} minutes`);
});