const apiKey = 'your-api-key';
const weather = JSON.parse(localStorage.getItem('weatherData'));
const hourlyForecast = weather.forecast.forecastday[0].hour;
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
let currentTemp = document.querySelector('#currentTemperature');
let realFeel = document.querySelector('#realFeel');
let condition = document.querySelector('#condition');
let currentTime = document.querySelector('#currentTime');
let humidity = document.querySelector('#humidity');
let windSpeed = document.querySelector('#windSpeed');
let conditionImg = document.querySelector('#conditionImg');
let webTitle = document.querySelector('#navbar p');
let helpInfo = document.querySelector('#help');
let mainInfoTab = document.querySelector('#currentWeatherInfo');
let slider = document.querySelector('#hourCast input');
let displayHour;

webTitle.addEventListener('click', function () {
    window.location.href = 'weatherApp.html';
})

document.addEventListener('DOMContentLoaded', function () {
    let cityInput = document.querySelector('#cityInput');
    let cityInputForm = document.querySelector('#cityInputForm');
    let header = document.querySelector('#header');
    let forecastDiv = document.querySelector('#weatherForecast');
    const currentHour = new Date().getHours();
    console.log(weather);

    if (currentHour >= 12) {
        displayHour = 6 + (Math.floor((currentHour - 12) / 2));
    }
    else {
        displayHour = Math.floor(currentHour / 2);
    }

    slider.value = displayHour;
    header.textContent = `Weather in ${weather.location.name}, ${weather.location.country}`;
    currentTemp.textContent = `${weather.current.temp_c}°C`;
    realFeel.textContent = `Real feel: ${weather.current.feelslike_c}°C`;
    condition.textContent = `${weather.current.condition.text}`;
    humidity.textContent = `Humidity: ${weather.current.humidity}%`;
    windSpeed.textContent = `Wind: ${weather.current.wind_mph} MPH`;

    let updateTime = weather.location.localtime.slice(11);
    if (parseInt(updateTime.slice(0, 2)) > 12) {
        updateTime = `${parseInt(updateTime.slice(0, 2)) - 12}:${updateTime.slice(3)} pm`;
    }
    else {
        updateTime = `${updateTime} am`;
    }
    currentTime.textContent = `${days[(parseInt(weather.location.localtime.slice(8, 10)) % 7)]} ${weather.location.localtime.slice(8, 10)}, ${updateTime}`;
    conditionImg.src = `https:${weather.current.condition.icon}`;

    let forecast = weather.forecast.forecastday;
    console.log(forecast);
    for (let day of forecast) {
        let divider = document.createElement('div');
        let daySpan = document.createElement('span');
        let iconImg = document.createElement('img');
        let highSpan = document.createElement('span');
        let lowSpan = document.createElement('span');
        let maxWind = document.createElement('span');

        daySpan.textContent = `${days[(parseInt(weather.location.localtime.slice(8, 10)) % 7)]} ${day.date.slice(8)} `;
        highSpan.textContent = `High: ${day.day.maxtemp_c}°C `;
        lowSpan.textContent = `Low: ${day.day.mintemp_c}°C`;
        iconImg.src = `https:${day.day.condition.icon}`;
        maxWind.textContent = `Max wind: ${day.day.maxwind_mph} mph`;
        divider.append(daySpan);
        divider.append(iconImg);
        divider.append(highSpan);
        divider.append(lowSpan);
        divider.append(maxWind);
        forecastDiv.append(divider);
    }

    cityInputForm.addEventListener('submit', function (event) {
        event.preventDefault();
        axios.get(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${cityInput.value}&days=5&aqi=no&alerts=no`)
            .then((response) => {
                console.log('data fetched.');
                cityInput.value = '';
                localStorage.setItem('weatherData', JSON.stringify(response.data));
                location.reload();
            }
            )
            .catch((error) => {
                window.location.href = 'errorPage.html';
                console.error('Error:', error);
            })
    })
})

const updateValue = function (value) {
    const hourlyForecast = weather.forecast.forecastday[0].hour;
    let currentHour = parseInt(value.slice(0, 2));
    if (value.includes('AM') || value === "12 PM") {
        currentHour -= 1;
    }
    else {
        currentHour += 11;
    }

    currentTemp.textContent = `${hourlyForecast[currentHour].temp_c}°C`;
    realFeel.textContent = `Real feel: ${hourlyForecast[currentHour].feelslike_c}°C`;
    condition.textContent = `${hourlyForecast[currentHour].condition.text}`;
    humidity.textContent = `Humidity: ${hourlyForecast[currentHour].humidity}%`;
    windSpeed.textContent = `Wind: ${hourlyForecast[currentHour].wind_mph} MPH`;
    conditionImg.src = `https:${hourlyForecast[currentHour].condition.icon}`;
}
