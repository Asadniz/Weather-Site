const apiKey = API_KEY;
let cityInput = document.querySelector('#cityInput');
let submitForm = document.querySelector('#cityInputForm');
submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    axios.get(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${cityInput.value}&days=5&aqi=no&alerts=no`)
        .then((response) => {
            localStorage.setItem('weatherData', JSON.stringify(response.data));
            window.location.href = 'weatherResult.html';
        })
        .catch((error) => {
            location.reload();
            console.log('error');
            console.error('Error:', error);
        })
})

