const iconsAtmospheric = {
  781: "wi-tornado",
  771: "wi-thunderstorm",
  762: "wi-volcano",
  761: "wi-dust",
  751: "wi-sandstorm",
  741: "wi-fog",
  731: "wi-sandstorm",
  721: "wi-cloudy-gusts",
  711: "wi-smoke",
  701: "wi-cloudy-gusts",
};

const icons = [
  "wi-cloudy",
  "wi-cloud",
  "wi-day-cloudy",
  "wi-day-sunny",
  iconsAtmospheric,
  "wi-snowflake-cold",
  "wi-rain",
  "wi-showers",
  "wi-thunderstorm",
];

const windDeg = [
  "towards-0-deg",
  "towards-45-deg",
  "towards-90-deg",
  "towards-135-deg",
  "towards-180-deg",
  "towards-225-deg",
  "towards-270-deg",
  "towards-336-deg",
];
let times = [
  ["Manhã", "wi-sunrise"],
  ["Tarde", "wi-sunset"],
  ["Noite", "wi-moonrise"],
];

let options = { weekday: "short", day: "numeric" };
function transformDate(date) {
  let myDate = new Date(date * 1000);
  let day = myDate.toLocaleString("pt-br", options).replace(".", "");
  return day;
}

function myFunction(e) {
  console.log("My Function" + e);
  let input = document.getElementById("myinput");
  getWeather(input.value);
  input.value = "";
  return true;
}

function getIcon(id) {
  console.log("getIcon(id)");
  if (id >= 803) return icons[0];
  if (id >= 802) return icons[1];
  if (id >= 801) return icons[2];
  if (id >= 800) return icons[3];
  if (id >= 701) return icons[4][id];
  if (id >= 600) return icons[5];
  if (id >= 500) return icons[6];
  if (id >= 300) return icons[7];
  return icons[8];
}

function getWind(degree) {
  console.log("getWind(degree)");
  if (degree > 337.5) return ["Norte", windDeg[0]];
  if (degree > 292.5) return ["Noroeste", windDeg[7]];
  if (degree > 247.5) return ["Oeste", windDeg[6]];
  if (degree > 202.5) return ["Sudoeste", windDeg[5]];
  if (degree > 157.5) return ["Sul", windDeg[4]];
  if (degree > 122.5) return ["Sudeste", windDeg[3]];
  if (degree > 67.5) return ["Leste", windDeg[2]];
  if (degree > 22.5) {
    return ["Nordeste", windDeg[1]];
  }
  return ["Norte", windDeg[0]];
}
function setWind(wind) {
  console.log("setWind(wind)");
  let windsubtitle = document.querySelector("#windsubtitle");
  let windIcon = document.querySelector("#wind-icon");
  let windKm = document.querySelector(".windKm");

  let windDegree = getWind(wind.deg);
  let windSpeedKm = (wind.speed * 3.6).toFixed(2) + " Km/h";

  windsubtitle.textContent = windDegree[0];
  windIcon.removeAttribute("class");
  windIcon.classList.add("wi", "wi-wind", windDegree[1], "wind-icons");
  windKm.textContent = windSpeedKm;
}

function getData(url) {
  let request = new XMLHttpRequest();
  request.open("GET", url);
  request.responseType = "json";
  request.send();
  return request;
}

function getWeather(city) {
  console.log("getWeather: " + city);
  let url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&units=metric&lang=pt_br&appid=684b2307c37d8d899e824ddc04468ef9";

  let request = getData(url);

  request.onreadystatechange = function (event) {
    if (request.readyState === 4) {
      if (request.status === 200) {
        const weather = request.response;
        populateWeather(weather);
      } else {
        alert("Cidade não encontrada!")
        console.log("Error: " + request.status);
      }
    }
  };
}

function getDaylyWeather(lat, long) {
  let url =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat +
    "&lon=" +
    long +
    "&units=metric&lang=pt_br&appid=684b2307c37d8d899e824ddc04468ef9";

  let request = getData(url);

  request.onreadystatechange = function (event) {
    if (request.readyState === 4) {
      if (request.status === 200) {
        const daylyWeather = request.response;
        populateWeatherByTime(daylyWeather);
      } else {
        console.log("Error: " + request.status);
      }
    }
  };
}

function populateWeather(weather) {
  console.log("populateWeather(weather)");
  let icone = document.querySelector(".info-icon");
  let temperature = document.querySelector(".temperature");
  let cardTitle = document.querySelector(".card-title");
  let weathernow = document.querySelector(".weathernow");
  let cardInfoSub = document.querySelector(".card-info-subtitle");
  let feelsLike = document.querySelector(".feelsLike");
  let h6 = document.querySelector("#info-icon-h6");

  let name = weather.name;
  let icon = getIcon(weather.weather[0].id);
  let description = weather.weather[0].description;
  let tempMin = weather.main.temp_min.toFixed(1);
  let tempMax = weather.main.temp_max.toFixed(1);
  let temp = weather.main.temp.toFixed(1);
  let feels = weather.main.feels_like.toFixed(1);
  let lat = weather.coord.lat;
  let long = weather.coord.lon;

  cardTitle.textContent = "Clima em " + name;
  weathernow.textContent = "Previsão para hoje para " + name;

  cardInfoSub.textContent =
    description.charAt(0).toUpperCase() + description.substring(1);
  temperature.textContent = temp + "°";
  feelsLike.textContent = "Sensação Térmica: " + feels + " °";
  icone.removeAttribute("class");
  icone.classList.add("wi", icon, "info-icon");
  h6.textContent = tempMin + "° / " + tempMax + "°";

  setWind(weather.wind);
  getDaylyWeather(lat, long);
}

function populateWeatherByTime(daylyWeather) {
  console.log("populateDaylyWeather(daylyWeather): ");
  let ul = document.querySelector(".card-info-bytime");
  ul.innerHTML = "";

  for (var i = 0; i < 3; i++) {
    var obj = daylyWeather.daily[i];
    var li = document.createElement("li");
    var hour = document.createElement("p");
    var icon = document.createElement("i");
    var degree = document.createElement("h1");

    hour.appendChild(document.createTextNode(times[i][0]));

    if (times[i][0] === "Manhã") {
      degree.appendChild(
        document.createTextNode(obj.temp.morn.toFixed(1) + "°")
      );
      icon.classList.add("wi", times[i][1]);
    } else if (times[i][0] === "Tarde") {
      degree.appendChild(
        document.createTextNode(obj.temp.eve.toFixed(1) + "°")
      );
      icon.classList.add("wi", times[i][1]);
    } else {
      degree.appendChild(
        document.createTextNode(obj.temp.night.toFixed(1) + "°")
      );
      icon.classList.add("wi", times[i][1]);
    }

    li.appendChild(hour);
    li.appendChild(icon);
    li.appendChild(degree);
    ul.appendChild(li);
  }

  populateDaylyWeather(daylyWeather);
}

function transformDate(date) {
  let myDate = new Date(date * 1000);
  let day = myDate.toLocaleString("pt-br", options).replace(".", "");
  return day;
}

function populateDaylyWeather(daylyWeather) {
  let ul = document.querySelector(".card-info-dayly");
  ul.innerHTML = "";

  for (i = 0; i < 5; i++) {
    var obj = daylyWeather.daily[i];
    var li = document.createElement("li");
    var day = document.createElement("p");
    var icon = document.createElement("i");
    var degree = document.createElement("p");

    console.log("Icon Id: " + obj.weather[0].id);
    
    icon.classList.add("wi", getIcon(obj.weather[0].id));

    if (i == 0) day.appendChild(document.createTextNode("Hoje"));
    else day.appendChild(document.createTextNode(transformDate(obj.dt)));

    degree.appendChild(document.createTextNode(obj.temp.day + "°"));
    li.appendChild(day);
    li.appendChild(icon);
    li.appendChild(degree);
    ul.appendChild(li);
  }

  populateAlerts(daylyWeather);
}

function populateAlerts(daylyWeather) {
  console.log("populateAlerts(daylyWeather)");

  let alertEvent = document.querySelector(".alert-event");
  let alertSender = document.querySelector(".alert-sender");
  let alertText = document.querySelector(".alert-text");

  if (daylyWeather.alerts) {
    let alerts = daylyWeather.alerts[0];
    alertSender.style.display = "block";
    alertEvent.textContent = alerts.event;
    alertSender.textContent = alerts.sender_name;
    alertText.textContent = alerts.description;
  } else {
    alertEvent.textContent = "Sem alertas";
    alertSender.style.display = "none";
    alertText.textContent = "Nenhum alerta para exibir!";
  }
}

window.onload = function () {
  console.log("window.onload");
  getWeather("Manaus");
  document.getElementById("send").addEventListener("click", function (event) {
    event.preventDefault();
    let input = document.getElementById("myinput");

    if (input.value == "") return;
    getWeather(input.value);
    input.value = "";
  });
};
