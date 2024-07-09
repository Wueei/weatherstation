const apiKey = "e19eee6a386c3adf695c299157baea76";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?&units=metric&q=";
let city = "bern";

let wind = 0;
let humidity = 0;
let temperature = 0;

function updateCity() {
    if (document.getElementById("cityInput").value === "") {
        city = "bern";
    } else {
        city = document.getElementById("cityInput").value;
        document.getElementById("cityInput").value = "";
    }
    updateWeather();
}

function handleKeyPress(event) {
    if (event.keyCode === 13) {
        if (document.getElementById("cityInput").value === "") {
            city = "bern";
        } else {
            city = document.getElementById("cityInput").value;
            document.getElementById("cityInput").value = "";
        }
        updateWeather();
    }
}


function updateWeather(data) {
    $.getJSON(
        apiUrl + city + `&appid=${apiKey}`,
        function update(data) {

            wind = (data.wind['speed'] * 3.6);
            temperature = data.main['temp'];

            let timecode = data['dt'];
            let currentDate = new Date(timecode * 1000);

            function pad(num) {
                return num < 10 ? '0' + num : num;
            }

            let year = currentDate.getUTCFullYear();
            let month = pad(currentDate.getUTCMonth() + 1);
            let day = pad(currentDate.getUTCDate());
            let hours = pad(currentDate.getUTCHours());
            let minutes = pad(currentDate.getUTCMinutes());
            let seconds = pad(currentDate.getUTCSeconds());

            let formattedDate = `${day}-${month}-${year}`;
            let formattedTime = `${hours}:${minutes}:${seconds}`;

            $('#location').text(data['name']);
            $('#humidity').text(data.main['humidity'] + " %");
            $('#wind').text(Math.round(data.wind['speed'] * 3.6 * 100) /100 + " km/h");
            $('#temperature').text(Math.round(data.main['temp']) + "°C");
            $('#timestamp').text("Aktualisiert am " + formattedDate + " um " + formattedTime);

            let blobElements = document.querySelectorAll(".blobFill");

            blobElements.forEach(blobElement => {
                if (temperature >= 30) {
                    blobElement.setAttribute("fill", "url(#gradient30)")
                }
                if (temperature < 30 && temperature > 20) {
                    blobElement.setAttribute("fill", "url(#gradient20)")
                }
                if (temperature < 20 && temperature > 9) {
                    blobElement.setAttribute("fill", "url(#gradient10)")
                }
                if (temperature < 9) {
                    blobElement.setAttribute("fill", "url(#gradient00)")
                }
            });

            blobElements.forEach(blobElement => {
            })
        }
    );
}

function loadChart() {
    let dates = [];
    let temps = [];
    let humidities = [];
    let winds = [];

    let chartContainer = document.getElementById('weatherChart');

    fetch("https://weather.hauri.dev/api/v1/weather").then(response => response.json()).then(data => {
        data.forEach(el => {
            let date = new Date(el.timestamp);
            dates.push(date.toLocaleDateString('de-DE') + ' / ' + date.toLocaleTimeString('de-DE'));
            temps.push(el.temperature.temperature);
            humidities.push(el.humidity);
            winds.push(((el.wind.speed)* 3.6 * 100) /100);
        })

        const chartData = {
            labels: dates.reverse(),
            datasets: [
                {
                    label: 'Temperatur',
                    backgroundColor: 'rgb(209,66,97)',
                    borderColor: 'rgb(255, 99, 132)',
                    data: temps.reverse(),
                },
                {
                    label: 'Wind',
                    backgroundColor: 'rgb(193,0,130)',
                    borderColor: 'rgb(241,0,162)',
                    data: winds.reverse(),
                },
                {
                    label: 'Luftfeuchtigkeit',
                    backgroundColor: 'rgb(115,0,255)',
                    borderColor: 'rgb(140,0,255)',
                    data: humidities.reverse(),
                },
            ]
        };

        const config = {
            type: 'line',
            data: chartData,
            options: {}
        };

        new Chart(
            chartContainer,
            config
        );
    })
}

