// fetch('http://api.openweathermap.org/data/2.5/forecast?id=524901&APPID=43fd1cdd770e5cf56daf2f9d5cdc1037')
// .then(response => response.json())
// .then(data => console.log(data));

// fetch('api.openweathermap.org/data/2.5/weather?q={city name}&appid=524901&APPID=43fd1cdd770e5cf56daf2f9d5cdc1037')
// .then(response => response.json())
// .then(data => console.log(data));

// DISPLAY CURRENT DATE IN HEADER
// var showTime = function () {
//     $("#year").text(moment().format('YYYY'));
//     $("#date").text(moment().format('dddd, MM/DD/YYYY'));
//     $("#time").text(moment().format('hh:mm a'));
// }
// setInterval(showTime, 1000); 

var searchFormEl = document.querySelector("#form-input");
var cityInputEl = document.querySelector("#searchTerm");
var cityDisplayName = document.querySelector("#city");
var iconEl = document.querySelector("#icon");
var temp = document.querySelector("#temp");
var humidity = document.querySelector("#humidity");
var windSpeed = document.querySelector("#wind");
var uvIndex = document.querySelector("#uv");
var currentDate = document.querySelector("#date");
var lat = "lat";
var fiveDay = {
    date: "05/24/1993",
    icon: "none",
    temp: "980",
    humidity: "500"
}
var fiveDayArr = [];

console.log(fiveDay);

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
    var apiUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=43fd1cdd770e5cf56daf2f9d5cdc1037";

    fetch(apiUrl).then(function (response) {
        response.json().then(function (data) {
            displayWeather(data, city);

            var apiFiveUrl = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=43fd1cdd770e5cf56daf2f9d5cdc1037";
            fetch(apiFiveUrl).then(function (fiveResponse) {
                fiveResponse.json().then(function (fiveData) {
                    fiveDayCompiler(fiveData);

                })
            })

        })
    });
};

var displayWeather = function (data, city) {
    cityDisplayName.textContent = city;
    iconEl.setAttribute("src", "http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png");
    temp.textContent = "Temperature: " + data.main.temp + " ℉";
    humidity.textContent = "Humidity: " + data.main.humidity + "%";
    windSpeed.textContent = "Wind Speed: " + data.wind.speed + " mph";

    // Convert UTC code to current date
    var milliseconds = data.dt * 1000;
    var dateObject = new Date(milliseconds);
    var dateToday = dateObject.toLocaleDateString('en-US');
    currentDate.textContent = dateToday

    var lat = data.coord.lat
    var lon = data.coord.lon
    var uvUrl = "http://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=43fd1cdd770e5cf56daf2f9d5cdc1037";
    uvIndex.textContent = "UV Index: " + lat + lon;

    fetch(uvUrl).then(function (response) {
        response.json().then(function (data) {
            displayUV(data);
        })
    })
};

var displayUV = function (data) {
    uvIndex.textContent = "UV Index: " + data.value
};

var fiveDayCompiler = function (data) {
    for (var i = 0; i < data.list.length; i++) {
        if (data.list[i].dt_txt[11] == 1 && data.list[i].dt_txt[12] == 2) {
            var fiveDay = {
                date: data.list[i].dt,
                icon: data.list[i].weather[0].icon,
                temp: data.list[i].main.temp,
                humidity: data.list[i].main.humidity
            }
            // Convert UTC code to current date
            var milliseconds = data.list[i].dt * 1000;
            var dateObject = new Date(milliseconds);
            var newDate = dateObject.toLocaleDateString('en-US');
            fiveDay.date = newDate;
            fiveDayArr.push(fiveDay);
        }
    }
    console.log(fiveDayArr);
    displayFiveDay(fiveDayArr);
};

var displayFiveDay = function (data) {
    console.log(data);


    for (var i = 0; i < data.length; i++) {

        // console.log(date.toLocaleDateString('en-US'));

        var day = document.getElementById("day" + i);
        day.innerHTML = '<h5 class="card-title">' + data[i].date + '</h5><span>' + data[i].icon + '</span><p>Temp: ' + data[i].temp + ' ℉</p><p>Humidity: ' + data[i].humidity + '%</p>';
    }
}

var formatDates = function (date) { }





searchFormEl.addEventListener("submit", formSubmitHandler);
// showTime()



// http://api.openweathermap.org/data/2.5/weather?q=London&appid=43fd1cdd770e5cf56daf2f9d5cdc1037

// http://openweathermap.org/img/wn/" + value + "@2x.png

// "http://api.openweathermap.org/data/2.5/uvi?lat=30.27&lon=-97.74&appid=43fd1cdd770e5cf56daf2f9d5cdc1037"
