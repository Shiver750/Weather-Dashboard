$(document).ready(function () {
    var cityName = "";
    
    var lat = " ";
    var lon = "";

function getWeatherOneAPI(a,b) {
    var queryURL2 = "https://api.openweathermap.org/data/2.5/onecall?lat=" + a + "&lon=" + b + "&exclude=minutely,hourly&appid=d1e5356fa27fb39adf0e22b0c2218ba7&units=imperial";

    
    $.ajax({
        url: queryURL2,
        method: "GET"
    }).then(function (response) {
        console.log(response);

        
        $(".card-deck").empty();

        
    var icon = response.current.weather[0].icon;
    var iconImg = $("<img>");
       iconImg.addClass("img-fluid");
    iconImg.attr("src", "https://openweathermap.org/img/wn/" + icon + "@2x.png")
        $("#city").append(iconImg);

        $("#temp").text("Temperature: " + response.current.temp + "° F");
        $("#humidity").text("Humidity: " + response.current.humidity + "%");
        $("#wind").text("Wind Speed: " + response.current.wind_speed + " MPH");
        $(".color").text(response.current.uvi);

        
        $("#current").css({"display":"block"});

        
        var daily = response.daily;

        
        for (i = 1; i < daily.length - 2; i++) {
            
            var dailyDate = moment.unix(daily[i].dt).format("dddd MM/DD/YYYY");
            var dailyTemp = daily[i].temp.day;
            var dailyHum = daily[i].humidity;
            var dailyIcon = daily[i].weather[0].icon;

            
            var dailyDiv = $("<div class='card text-white bg-primary p-2'>")
            var pTemp = $("<p>");
            var pHum = $("<p>");
            var imgIcon = $("<img>");
            var hDate = $("<h6>");

            
            hDate.text(dailyDate);
            imgIcon.attr("src", "https://openweathermap.org/img/wn/" + dailyIcon + "@2x.png")
            imgIcon.addClass("img-fluid");
            imgIcon.css({"width": "100%"});
            pTemp.text("Temp: " + dailyTemp + "° F");
            pHum.text("Humidity: " + dailyHum + "%");

            dailyDiv.append(hDate);
            dailyDiv.append(imgIcon);
            dailyDiv.append(pTemp);
            dailyDiv.append(pHum);
            $(".card-deck").append(dailyDiv);

            
            $("#five-day").css({"display":"block"});
        }

    })
}


function getWeather() {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&lang=en&appid=d1e5356fa27fb39adf0e22b0c2218ba7";

    
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        
        lat = response.coord.lat;
        lon = response.coord.lon;

        
        $("#city").text(response.name);
        $("#date").text(moment.unix(response.dt).format("dddd, MM/DD/YYYY"));
                    
  
        localStorage.setItem("cityname", response.name);
        
        
        getWeatherOneAPI(lat,lon);

    })
}


function init(){
    cityName = localStorage.getItem("cityname");
    if (cityName !== null) {

        var cityList = $("<button>");
        cityList.addClass("list-group-item list-group-item-action");
        cityList.text(cityName);
        $("ul").prepend(cityList);
        getWeather()
    }
}

function searchButton() {
    cityName = $("input").val().trim();

   
    var cityList = $("<button>");
    cityList.addClass("list-group-item list-group-item-action");
    cityList.text(cityName);

    $("ul").prepend(cityList);
    

    getWeather();
}

init();


$("#city-form").submit(function (event) {
    event.preventDefault();
    searchButton();
})

$("#form-submit").click(function (event) {
    event.preventDefault();
    searchButton();
})


$("ul").on("click", "button", function () {
    cityName = $(this).text();
    console.log(cityName);

    getWeather();
})


$( document ).ajaxError(function() {

var error = $("<p>");
error.addClass("error");
error.css({"color": "red"});
    error.text("Please try again with a valid city");
    
    $("ul").prepend(error);
    
    var p = $(this).find("button");
    
    p[1].remove();
    
    setTimeout(function () {
        error.remove();
        }, 2000);
  });

});
