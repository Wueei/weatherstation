const apiKey = "e19eee6a386c3adf695c299157baea76";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?&units=metric&q=";

let wind = 0;
let humidity = 0;
let temperature = 0;

if(!localStorage.getItem('citySet')) {
    console.log("1. time")
    localStorage.setItem("city", "bern");
    localStorage.setItem("citySet", "true");
}

function updateCity() {
    if (document.getElementById("cityInput").value === "") {
        localStorage.removeItem("city");
        localStorage.setItem("city", "bern");
        localStorage.setItem("citySet", "true");
    } else {
        localStorage.removeItem("city");
        localStorage.setItem("city", document.getElementById("cityInput").value);
        localStorage.setItem("citySet", "true");
        document.getElementById("cityInput").value = "";
    }
    updateWeather();
}

function handleKeyPress(event) {
    if (event.keyCode === 13) {
        if (document.getElementById("cityInput").value === "") {
            localStorage.removeItem("city");
            localStorage.setItem("city", "bern");
            localStorage.setItem("citySet", "true");
        } else {
            localStorage.removeItem("city");
            localStorage.setItem("city", document.getElementById("cityInput").value);
            localStorage.setItem("citySet", "true");
            document.getElementById("cityInput").value = "";
        }
        updateWeather();
    }
}


function updateWeather(data) {
    let city = localStorage.getItem("city");
    $.getJSON(
        apiUrl + city + `&appid=${apiKey}`,
        function update(data) {

            wind = (data.wind['speed'] * 3.6);
            temperature = Math.round(data.main['temp'] * 100) / 100;

            let timecode = data['dt'];
            let currentDate = new Date(timecode * 1000);

            let dateOptions = {
                year: 'numeric', month: '2-digit', day: '2-digit'
            };

            let timeOptions = {
                hour: '2-digit', minute: '2-digit', second: '2-digit',
                hour12: false
            };

            // Formatierte lokale Zeit und Datum
            let localDate = currentDate.toLocaleDateString('de-CH', dateOptions);
            let localTime = currentDate.toLocaleTimeString('de-CH', timeOptions);


            $('.location').text(data['name']);
            $('#humidity').text(data.main['humidity'] + " %");
            $('#wind').text(Math.round(data.wind['speed'] * 3.6 * 100) / 100 + " km/h");
            $('#temperature').text(Math.round(data.main['temp'] * 100) / 100 + "°C");
            $('#timestamp').text("Updated on " + localDate + " at " + localTime);

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
            dates.push(date.toLocaleDateString('de-CH') + ' / ' + date.toLocaleTimeString('de-CH'));
            temps.push(el.temperature.temperature);
            humidities.push(el.humidity);
            winds.push(((el.wind.speed) * 3.6 * 100) / 100);
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

function loadDetails() {
    let city = localStorage.getItem("city");
    $.getJSON(
        apiUrl + city + `&appid=${apiKey}`,
        function updateDetails(data) {
            $('.item2').text(data['name']);
            $('.item4').text(Math.round(data.main['temp'] * 100) / 100 + "°C");
            $('.item6').text(Math.round(data.main['feels_like'] * 100) / 100 + "°C");
            $('.item8').text((new Date(data.sys['sunrise'] * 1000)).toLocaleTimeString('de-CH') + " Uhr");
            $('.item10').text((new Date(data.sys['sunset'] * 1000)).toLocaleTimeString('de-CH') + " Uhr");

            let lon = data.coord['lon'];
            let lat = data.coord['lat'];

            if(marker) {
                map.removeLayer(marker)
            }
            marker = L.marker([lat, lon]);
            marker.addTo(map);

            map.panTo([lat, lon]);

        }
    );
}
