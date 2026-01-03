const apiKey = 0a82d3be7cfa4fc0b8c134250241507;
let cityInput = document.querySelector('#cityInput');
let submitForm = document.querySelector('#cityInputForm');
let suggestions = document.querySelector('#suggestions');
let title = document.querySelector('#headerContainer h1');

title.addEventListener('click', function () {
    location.reload();
})

submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    axios.get(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${cityInput.value}&days=5&aqi=no&alerts=no`)
        .then((response) => {
            cityInput.value = ''
            localStorage.setItem('weatherData', JSON.stringify(response.data));
            window.location.href = 'weatherResult.html';
        })
        .catch((error) => {
            window.location.href = 'errorPage.html';
            console.log('error');
            console.error('Error:', error);
        })
})


// https://api.weatherapi.com/v1/search.json?key=0a82d3be7cfa4fc0b8c134250241507&q=${cityInput.value}&days=5&aqi=no&alerts=no


