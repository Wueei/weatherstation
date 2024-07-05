$(document).ready(function () {
    const tempChart = document.getElementById('temperatureGraph');

    new Chart(tempChart, {
        type: 'line',
        data: {
            labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: [{
                label: 'Temperatur',
                data: [12, 19, 3, 5, 2, 3],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    startAtZero: true
                }
            }
        }
    });
});