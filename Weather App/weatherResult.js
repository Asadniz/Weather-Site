const apiKey = API_KEY;
const weather = JSON.parse(localStorage.getItem('weatherData'));
const hourlyForecast = weather.forecast.forecastday[0].hour;
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const currentTemp = document.querySelector('#currentTemperature');
const realFeel = document.querySelector('#realFeel');
const condition = document.querySelector('#condition');
const humidity = document.querySelector('#humidity');
const windSpeed = document.querySelector('#windSpeed');
const conditionImg = document.querySelector('#conditionImg');

const forecastTag = function (day, appendingDivider) {
    const divider = document.createElement('div');
    const daySpan = document.createElement('span');
    const iconImg = document.createElement('img');
    const highSpan = document.createElement('span');
    const lowSpan = document.createElement('span');
    const maxWind = document.createElement('span');

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
    appendingDivider.append(divider);
}

const webTitle = document.querySelector('#navbar p');

webTitle.addEventListener('click', function () {
    window.location.href = 'weatherApp.html';
})

document.addEventListener('DOMContentLoaded', function () {
    console.log(weather);

    const currentHour = new Date().getHours();
    let displayHour;

    if (currentHour >= 12) {
        displayHour = 6 + (Math.floor((currentHour - 12) / 2));
    }

    else {
        displayHour = Math.floor(currentHour / 2);
    }

    const slider = document.querySelector('#hourCast input');
    slider.value = displayHour;

    const header = document.querySelector('#header');
    header.textContent = `Weather in ${weather.location.name}, ${weather.location.country}`;

    updateValue(currentHour);

    let updateTime = weather.location.localtime.slice(11);
    if (parseInt(updateTime.slice(0, 2)) > 12) {
        updateTime = `${parseInt(updateTime.slice(0, 2)) - 12}:${updateTime.slice(3)} pm`;
    }
    else {
        updateTime = `${updateTime} am`;
    }

    const currentTime = document.querySelector('#currentTime');
    currentTime.textContent = `${days[(parseInt(weather.location.localtime.slice(8, 10)) % 7)]} ${weather.location.localtime.slice(8, 10)}, ${updateTime}`;

    const forecast = weather.forecast.forecastday;
    const forecastDiv = document.querySelector('#weatherForecast');
    for (let day of forecast) {
        forecastTag(day, forecastDiv);
    }

    const cityInput = document.querySelector('#cityInput');
    const cityInputForm = document.querySelector('#cityInputForm');

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
    let currentHour
    if (typeof (value) === 'string') {
        currentHour = parseInt(value.slice(0, 2));
        if (value.includes('AM') || value === "12 PM") {
            currentHour -= 1;
        }

        else {
            currentHour += 11;
        }
    }

    else {
        currentHour = value;
    }

    currentTemp.textContent = `${hourlyForecast[currentHour].temp_c}°C`;
    realFeel.textContent = `Real feel: ${hourlyForecast[currentHour].feelslike_c}°C`;
    condition.textContent = `${hourlyForecast[currentHour].condition.text}`;
    humidity.textContent = `Humidity: ${hourlyForecast[currentHour].humidity}%`;
    windSpeed.textContent = `Wind: ${hourlyForecast[currentHour].wind_mph} MPH`;
    conditionImg.src = `https:${hourlyForecast[currentHour].condition.icon}`;
}

