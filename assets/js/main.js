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
    date: "05/24/1993",
    icon: "max",
    temp: "880",
    humidity: "550"
}
var fiveDayArr = [];
var listItemEl = document.querySelectorAll(".list-item");

// MAKE SEARCH HISTORY CLICKABLE
var hxListSearch = function (index) {
    listItemEl.forEach(function (city) {

        // for (var i = 0; i < 8; i++) {
        if (city.id == "hxItem" + index) {
            citySearch(city.textContent);
        }
        // }

    })
};

// ENABLE SEARCH TEXT INPUT
var formSubmitHandler = function (event) {
    event.preventDefault();


    // GET VALUE FROM INPUT ELEMENT
    var cityName = cityInputEl.value.trim().charAt(0).toUpperCase() + cityInputEl.value.slice(1);

    if (cityName) {
        citySearch(cityName);
        // storeHistory(cityName);
        // getHistory();
        // citySearch(cityName);
        cityInputEl.value = "";
    } else {
        alert("Please enter a city name.");
    }
};

// SAVE SEARCH TERM IN LOCAL STORAGE
var storeHistory = function (cityName) {
    if (localStorage.getItem('Cities') === null) {
        historyArr.unshift(cityName);
        localStorage.setItem('Cities', historyArr);
        return false;

    } else {
        historyArr = [];
        historyArr.push(localStorage.getItem('Cities'));
        newHistoryArr = historyArr[0].split(',');
        if (newHistoryArr.includes(cityName)) {
            return false;
        } else {
            historyArr.unshift(cityName);
            localStorage.setItem('Cities', historyArr);
        }
    }
};

// RETRIEVE SEARCH HISTORY FROM LOCAL STORAGE
var getHistory = function (cityName) {
    if (localStorage.getItem('Cities') === null) {
        return false;

    } else {
        historyArr = [];
        historyArr.push(localStorage.getItem('Cities'));
        newHistoryArr = historyArr[0].split(',');


        for (var i = 0; i < 8; i++) {
            var hxItemEl = document.querySelector("#hxItem" + i);
            hxItemEl.textContent = newHistoryArr[i];

            if (hxItemEl.textContent === "" || hxItemEl.textContent === null) {
                hxItemEl.setAttribute("class", "searchTerm invisible list-item list-group-item list-group-item-action border pt-2 pb-2");
            } else {
                hxItemEl.setAttribute("class", "searchTerm list-item list-group-item list-group-item-action border pt-2 pb-2");
            }
        }
    }
}

// SEARCH API FOR CURRENT AND FIVE-DAY WEATHER DATA
var citySearch = function (city) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=c888bc87519e878c5cbb608278ea9713";

    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            storeHistory(city);
            getHistory();
            response.json().then(function (data) {
                displayWeather(data, city);

                var apiFiveUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=c888bc87519e878c5cbb608278ea9713";
                fetch(apiFiveUrl).then(function (fiveResponse) {
                    fiveResponse.json().then(function (fiveData) {
                        fiveDayCompiler(fiveData);

                    })
                })

            })
        } else {
            alert("City not found. Try again!");
            return false;
        }

    })

};

// DISPLAY CURRENT WEATHER DATA ON PAGE
var displayWeather = function (data, city) {
    cityDisplayName.textContent = city;
    var tempRound = Math.round(data.main.temp);
    var windRound = Math.round(data.wind.speed);
    // GET ICON
    iconEl.setAttribute("src", "https://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png");

    temp.textContent = "Temperature: " + tempRound + "℉";
    humidity.textContent = "Humidity: " + data.main.humidity + "%";
    windSpeed.textContent = "Wind Speed: " + windRound + "mph";

    // Convert UTC code to current date
    var milliseconds = data.dt * 1000;
    var dateObject = new Date(milliseconds);
    var dateToday = dateObject.toLocaleDateString('en-US');
    currentDate.textContent = dateToday

    // Get UV Index 
    var lat = data.coord.lat
    var lon = data.coord.lon
    var uvUrl = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=c888bc87519e878c5cbb608278ea9713";


    fetch(uvUrl).then(function (response) {
        response.json().then(function (data) {
            displayUV(data);
        })
    })
};

// DISPLAY COLOR-CODED UV-INDEX
var displayUV = function (data) {
    var uvRound = Math.round(data.value);
    uvIndex.textContent = "UV Index: " + uvRound;
    if (data.value < 3) {
        uvIndex.setAttribute("class", 'forecast-data bg-success text-white rounded text-center');
    } else if (data.value >= 3 && data.value < 8) {
        uvIndex.setAttribute("class", 'forecast-data bg-warning text-white rounded text-center');
    } else {
        uvIndex.setAttribute("class", 'forecast-data bg-danger text-white rounded text-center');
    }
};

// COMPILE 5-DAY DATA INTO OBJECTS
var fiveDayCompiler = function (data) {
    console.log(data);
    var fiveDayArr = [];
    for (var i = 0; i < data.list.length; i++) {
        if (data.list[i].dt_txt[11] == 1 && data.list[i].dt_txt[12] == 2) {
            var fiveDay = {
                date: data.list[i].dt,
                icon: data.list[i].weather[0].icon,
                temp: data.list[i].main.temp,
                humidity: data.list[i].main.humidity
            }
            console.log(fiveDay);
            // Round temperature to nearest integer
            var roundTemp = Math.round(data.list[i].main.temp);
            fiveDay.temp = roundTemp;
            // Convert UTC code to current date
            var milliseconds = data.list[i].dt * 1000;
            var dateObject = new Date(milliseconds);
            var options = { month: 'numeric', day: 'numeric' };
            var newDate = dateObject.toLocaleDateString('en-US', options);
            fiveDay.date = newDate;
            fiveDayArr.push(fiveDay);
        }
    }

    displayFiveDay(fiveDayArr);
};

// DISPLAY 5-DAY FORECAST DATA
var displayFiveDay = function (data) {
    var fiveTitle = document.getElementById("fiveTitle");
    fiveTitle.setAttribute("class", "col-12 ml-1 pl-2");
    for (var i = 0; i < data.length; i++) {

        var day = document.getElementById("day" + i);
        day.setAttribute('class', 'future bg-primary rounded text-white col-md m-1 w-100');
        day.innerHTML = '<p class="h4 text-center pt-3">' + data[i].date + '</p><img id="icon' + i + '"class="w-100" src="https://openweathermap.org/img/wn/' + data[i].icon + '@2x.png"></img><p>Temp: ' + data[i].temp + '℉</p><p>Humidity: ' + data[i].humidity + '%</p>';

    }
    return
};

getHistory();

searchFormEl.addEventListener("submit", formSubmitHandler);