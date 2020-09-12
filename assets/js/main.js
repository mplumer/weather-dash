// fetch('http://api.openweathermap.org/data/2.5/forecast?id=524901&APPID=43fd1cdd770e5cf56daf2f9d5cdc1037')
// .then(response => response.json())
// .then(data => console.log(data));

// fetch('api.openweathermap.org/data/2.5/weather?q={city name}&appid=524901&APPID=43fd1cdd770e5cf56daf2f9d5cdc1037')
// .then(response => response.json())
// .then(data => console.log(data));
var searchFormEl = document.querySelector("#form-input");
var cityInputEl = document.querySelector("#searchTerm");
var cityDisplayName = document.querySelector("#city");
var tempEl = document.querySelector("#temp");
var humidityContainer = document.querySelector("#humidity");

var formSubmitHandler = function (event) {
    event.preventDefault();

    // GET VALUE FROM INPUT ELEMENT
    var cityName = cityInputEl.value.trim();

    if (cityName) {
        citySearch(cityName);
        cityInputEl.value = "";
    } else {
        alert("Please enter a city name.");
    }
};

var citySearch = function (city) {
    var apiUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=43fd1cdd770e5cf56daf2f9d5cdc1037";
    console.log(apiUrl);

    fetch(apiUrl).then(function (response) {
        response.json().then(function (data) {
            displayWeather(data, city);

        })

    });

};

var displayWeather = function (data, city) {
    cityDisplayName.textContent = city;
    tempEl.textContent = "Temperature:";

    // for (var i = 0; i < data.length; i++) {

    // }
    var humidityEL = document.createElement("span");
    humidityEL.textContent = " " + data.main.humidity;
    humidityContainer.appendChild(humidityEL);

    console.log(data);
    console.log(city);
    console.log(data.main.humidity);

};

searchFormEl.addEventListener("submit", formSubmitHandler);



// http://api.openweathermap.org/data/2.5/weather?q=London&appid=43fd1cdd770e5cf56daf2f9d5cdc1037