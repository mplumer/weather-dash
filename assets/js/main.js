var historyArr = [];
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
    date: "",
    icon: "",
    temp: "980",
    humidity: "500"
}
var fiveDayArr = [];
var listItemEl = document.querySelectorAll(".list-item");
console.log(listItemEl);


var hxListSearch = function (index) {
    listItemEl.forEach(function (city) {
        console.log(city.textContent);
        console.log(index);
        console.log(city.id);

        for (var i = 0; i < 8; i++) {
            if (city.id == "hxItem" + index) {
                citySearch(city.textContent);
            }
        }

    })
};



var formSubmitHandler = function (event) {
    event.preventDefault();


    // GET VALUE FROM INPUT ELEMENT
    var cityName = cityInputEl.value.trim().charAt(0).toUpperCase() + cityInputEl.value.slice(1);

    if (cityName) {
        storeHistory(cityName);
        getHistory();
        citySearch(cityName);
        cityInputEl.value = "";
    } else {
        alert("Please enter a city name.");
    }
};

var storeHistory = function (cityName) {
    historyArr.unshift(cityName);
    localStorage.setItem('Cities', historyArr);

};

var getHistory = function (cityName) {
    if (localStorage.getItem('Cities') === null) {
        return false;

    } else {
        historyArr = [];
        historyArr.push(localStorage.getItem('Cities'));
        newHistoryArr = historyArr[0].split(',');

        for (var i = 0; i < 8; i++) {
            var hxItemEl = document.querySelector("#hxItem" + i);

            if (hxItemEl.textContent = "") {
                // hxItemEl.parentElement.removeChild(hxItemEl);
            } else {
                hxItemEl.textContent = newHistoryArr[i];
            }

        }
    }

}

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
    // GET ICON
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
    var fiveDayArr = [];
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
    // console.log(fiveDayArr);
    displayFiveDay(fiveDayArr);
};

var displayFiveDay = function (data) {

    for (var i = 0; i < data.length; i++) {

        var day = document.getElementById("day" + i);
        day.innerHTML = '<h4 class="card-title">' + data[i].date + '</h4><img id="icon' + i + '"class="col-10" alt="weather-conditions-icon" src="http://openweathermap.org/img/wn/' + data[i].icon + '@2x.png"></img><p>Temp: ' + data[i].temp + ' ℉</p><p>Humidity: ' + data[i].humidity + '%</p>';

    }
    return
};

getHistory();

searchFormEl.addEventListener("submit", formSubmitHandler);
// listItemEl.addEventListener("click", hxlistSearch);
