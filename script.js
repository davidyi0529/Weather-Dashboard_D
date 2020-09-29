$(document).ready(function () {

    var city;

//use moment.js library to display day of week and date
const currentTime = document.querySelector(display);
    let renderClock = function() {
        document.querySelector("#currentDay").innerHTML =
    `${moment().format('dddd MMMM Do YYYY, h:mm:ss a')}
    `;
   }   
   
    var nMoment = moment().format('dddd MMMM Do YYYY, h:mm:ss a');
    var display = $("#currentDay");
    display.text(nMoment);

    renderClock();
    setInterval(renderClock, 1000);
  
    var searchedCities = [];
  
    displayHistory();
    defaultDisplay();
  
    //show last searched city or use user location as default city
    function defaultDisplay() {
      let historyCities = JSON.parse(localStorage.getItem("searchedCities"));
      //if there are searches before display last searched city
      if (historyCities != undefined) {
        city = historyCities[historyCities.length - 1];
        historyTab(city);
      } //if there are no searches yet, use user location to display as default city
      else {
        getLocation();
        function getLocation() {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
          } else {
            console.log("Geolocation is not supported by this browser.");
          }
        }
        $(".main-city").css("margin-top", "15px");
        $("#city-name").text("Checking the weather of your current city...").css("font-size", "1.5em");
  
        function showPosition(position) {
          let lat = position.coords.latitude.toFixed(2);
          let lon = position.coords.longitude.toFixed(2);
  
          queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=8bfee9511cf714d86c2407e20816ac9e";
          $.ajax({
            url: queryURL,
            method: "GET"
          })
            .then(function (response) {
              var uvIndex = response.current.uvi;
              $("#uv-container").text("UV Index: ");
              $("#uv-index").text(uvIndex);
              if (uvIndex < 2.9) {
                $("#uv-index").css("background-color", "#a5db45");
              } else if (uvIndex > 3 && uvIndex < 5.9) {
                $("#uv-index").css("background-color", "#ffd33e");
              } else if (uvIndex > 6 && uvIndex < 7.9) {
                $("#uv-index").css("background-color", "#fa8829");
              }else if (uvIndex > 8 && uvIndex < 10.9) {
                $("#uv-index").css("background-color", "#f93a2f");
              }else if (uvIndex >= 11) {
                $("#uv-index").css("background-color", "#d756d3");
              } 
  
              $(".five-day-forecast").empty();
              for (i = 1; i <= 5; i++) {
                var timeStamp = response.daily[i].dt * 1000;
                var dateLine = new Date(timeStamp);
                var options = { year: 'numeric', month: 'numeric', day: 'numeric' };
                var dateForecast = dateLine.toLocaleString("en-US", options);
                var forecastDiv = $("<div>").css({
                  "background-color": "#93dded",
                  "margin": "20px",
                  "padding": "15px",
                  "float": "left",
                  "border-radius": "10px",
                });
                var dateElm = $("<p>").text(dateForecast);
                forecastDiv.append(dateElm);
                $(".five-day-forecast").append(forecastDiv);
                var iconUrl = "http://openweathermap.org/img/wn/" + response.daily[i].weather[0].icon + "@2x.png";
                var logo = $("<img>").attr("src", iconUrl)
                forecastDiv.append(logo);
                var temp = ((response.daily[i].temp.day - 273.15) * 1.80 + 32).toFixed(2) + " °F";
                var tempElm = $("<p>").text("Temp: " + temp);
                forecastDiv.append(tempElm);
                var humidityElm = $("<p>").text("Humidity: " + response.daily[i].humidity + " %");
                forecastDiv.append(humidityElm);
              }
            });
  
          secondQueryURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=8bfee9511cf714d86c2407e20816ac9e";
          $.ajax({
            url: secondQueryURL,
            method: "GET"
          })
            .then(function (response) {
              $(".main-city").css("margin-top", "0");
              $("#city-name").text(response.name);
              $("#city-name").css("font-size", "1.5em");
              var weatherIconURL = "http://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png";
              $("#weather-icon").attr("src", weatherIconURL);
              var tempMax = "Highest Temperature: " + ((response.main.temp_max - 273.15) * 1.80 + 32).toFixed(1) + " °F";
              $("#temperature-max").text(tempMax);
              var tempMin = "Lowest Temperature: " + ((response.main.temp_min - 273.15) * 1.80 + 32).toFixed(1) + " °F";
              $("#temperature-min").text(tempMin);
              $("#humidity").text("Humidity: " + response.main.humidity + " %");
              $("#wind-speed").text("Wind Speed: " + response.wind.speed + " MPH");
            })
        }
      }
    }
  
  
    //this function uses the open weather api to generate dynamic weather info based on user input
    function getWeather(city) {
  
      queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=8bfee9511cf714d86c2407e20816ac9e";
      $.ajax({
        url: queryURL,
        method: "GET",
        success: function (response) {
          $("#city-name").text(response.name);
          $("#city-name").css("font-size", "1.5em");
          if (JSON.parse(localStorage.getItem("searchedCities")) != null) {
            searchedCities = JSON.parse(localStorage.getItem("searchedCities"));
            searchedCities.push(response.name);
          } else {
            searchedCities.push(response.name)
          }
          localStorage.setItem("searchedCities", JSON.stringify(searchedCities));
          var weatherIconURL = "http://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png";
          $("#weather-icon").attr("src", weatherIconURL);
          var tempMax = "Highest Temperature: " + ((response.main.temp_max - 273.15) * 1.80 + 32).toFixed(1) + " °F";
          $("#temperature-max").text(tempMax);
          var tempMin = "Lowest Temperature: " + ((response.main.temp_min - 273.15) * 1.80 + 32).toFixed(1) + " °F";
          $("#temperature-min").text(tempMin);
          $("#humidity").text("Humidity: " + response.main.humidity + " %");
          $("#wind-speed").text("Wind Speed: " + response.wind.speed + " MPH");
          var lat = response.coord.lat;
          var lon = response.coord.lon;
  
  
  
          secondQueryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=8bfee9511cf714d86c2407e20816ac9e";
          $.ajax({
            url: secondQueryURL,
            method: "GET"
          })
            .then(function (response) {
              var uvIndex = response.current.uvi;
              $("#uv-container").text("UV Index: ");
              $("#uv-index").text(uvIndex);
              if (uvIndex < 2.9) {
                $("#uv-index").css("background-color", "#a5db45");
              } else if (uvIndex > 3 && uvIndex < 5.9) {
                $("#uv-index").css("background-color", "#ffd33e");
              } else if (uvIndex > 6 && uvIndex < 7.9) {
                $("#uv-index").css("background-color", "#fa8829");
              }else if (uvIndex > 8 && uvIndex < 10.9) {
                $("#uv-index").css("background-color", "#f93a2f");
              }else if (uvIndex >= 11) {
                $("#uv-index").css("background-color", "#d756d3");
              }   
  
              $(".five-day-forecast").empty();
              for (i = 1; i <= 5; i++) {
                var timeStamp = response.daily[i].dt * 1000;
                var dateLine = new Date(timeStamp);
                var options = { year: 'numeric', month: 'numeric', day: 'numeric' };
                var dateForecast = dateLine.toLocaleString("en-US", options);
                var forecastDiv = $("<div>").css({
                  "background-color": "#93dded",
                  "margin": "20px",
                  "padding": "15px",
                  "float": "left",
                  "border-radius": "10px"
                });
                var dateElm = $("<p>").text(dateForecast);
                forecastDiv.append(dateElm);
                $(".five-day-forecast").append(forecastDiv);
                var iconUrl = "http://openweathermap.org/img/wn/" + response.daily[i].weather[0].icon + "@2x.png";
                var logo = $("<img>").attr("src", iconUrl)
                forecastDiv.append(logo);
                var temp = ((response.daily[i].temp.day - 273.15) * 1.80 + 32).toFixed(2) + " °F";
                var tempElm = $("<p>").text("Temp: " + temp);
                forecastDiv.append(tempElm);
                var humidityElm = $("<p>").text("Humidity: " + response.daily[i].humidity + " %");
                forecastDiv.append(humidityElm);
              }
            });
          displayHistory();
        },
        error: function () {
          $("#error-message").text("Sorry, we cannot find that city.")
        }
      })
    }
  
  
    function historyTab(city) {
  
      queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=8bfee9511cf714d86c2407e20816ac9e";
      $.ajax({
        url: queryURL,
        method: "GET",
        success: function (response) {
          $("#city-name").text(response.name);
          $("#city-name").css("font-size", "1.5em");
          var weatherIconURL = "http://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png";
          $("#weather-icon").attr("src", weatherIconURL);
          var tempMax = "Highest Temperature: " + ((response.main.temp_max - 273.15) * 1.80 + 32).toFixed(1) + " °F";
          $("#temperature-max").text(tempMax);
          var tempMin = "Lowest Temperature: " + ((response.main.temp_min - 273.15) * 1.80 + 32).toFixed(1) + " °F";
          $("#temperature-min").text(tempMin);
          $("#humidity").text("Humidity: " + response.main.humidity + " %");
          $("#wind-speed").text("Wind Speed: " + response.wind.speed + " MPH");
          var lat = response.coord.lat;
          var lon = response.coord.lon;
  
  
          secondQueryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=8bfee9511cf714d86c2407e20816ac9e";
          $.ajax({
            url: secondQueryURL,
            method: "GET"
          })
            .then(function (response) {
              var uvIndex = response.current.uvi;
              $("#uv-container").text("UV Index: ");
              $("#uv-index").text(uvIndex);
              if (uvIndex < 2.9) {
                $("#uv-index").css("background-color", "#a5db45");
              } else if (uvIndex > 3 && uvIndex < 5.9) {
                $("#uv-index").css("background-color", "#ffd33e");
              }else if (uvIndex > 6 && uvIndex < 7.9) {
                $("#uv-index").css("background-color", "#fa8829");  
              }else if (uvIndex > 8 && uvIndex < 10.9) {
                $("#uv-index").css("background-color", "#f93a2f");
              }else if (uvIndex >= 11) {
                $("#uv-index").css("background-color", "#d756d3");
              }
  
              $(".five-day-forecast").empty();
              for (i = 1; i <= 5; i++) {
                var timeStamp = response.daily[i].dt * 1000;
                var dateLine = new Date(timeStamp);
                var options = { year: 'numeric', month: 'numeric', day: 'numeric' };
                var dateForecast = dateLine.toLocaleString("en-US", options);
                var forecastDiv = $("<div>").css({
                  "background-color": "#93dded",
                  "margin": "20px",
                  "padding": "15px",
                  "float": "left",
                  "border-radius": "10px"
                });
                var dateElm = $("<p>").text(dateForecast);
                forecastDiv.append(dateElm);
                $(".five-day-forecast").append(forecastDiv);
                var iconUrl = "http://openweathermap.org/img/wn/" + response.daily[i].weather[0].icon + "@2x.png";
                var logo = $("<img>").attr("src", iconUrl)
                forecastDiv.append(logo);
                var temp = ((response.daily[i].temp.day - 273.15) * 1.80 + 32).toFixed(2) + " °F";
                var tempElm = $("<p>").text("Temp: " + temp);
                forecastDiv.append(tempElm);
                var humidityElm = $("<p>").text("Humidity: " + response.daily[i].humidity + " %");
                forecastDiv.append(humidityElm);
              }
            });
          displayHistory();
        },
        error: function () {
          console.log("City name does not exist")
        }
      })
    }
  
  
  
    // Event listener when search button is clicked, or when user presses the "enter" key
    $("#search").click(function () {
      event.preventDefault();
      $("#error-message").text("");
      //grab user input
      city = $("#city").val();
      //get weather
      getWeather(city);
      //clear up input box
      $("form").trigger("reset");
    })
  
    // display the newly added city in history when a search is performed
    $("#search").click(function () {
      displayHistory();
    })
  
    //get weather when a city is clicked in history tab
    $(".list-group").on("click", ".list-group-item", function () {
      city = $(this).text();
      historyTab(city);
    })
  
    //clear all local storage when "clear" button is clicked on "Your Favorite Cities"
    $(".clear").on("click", function () {
      localStorage.clear();
      //clear search history on html
      displayHistory();
    })
  
    //this function is used to show all searched history
    function displayHistory() {
      $(".list-group").empty();
      //get history from local storage
      let showCities = JSON.parse(localStorage.getItem("searchedCities"));
      if (showCities != undefined) {
        for (i = 0; i < showCities.length; i++) {
          var liElm = $("<li>").text(showCities[i]);
          liElm.addClass("list-group-item");
          $(".list-group").append(liElm);
        }
      }
    }
  
  });

