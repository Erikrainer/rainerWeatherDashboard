// Query selectors and variables and consts creation Start Here

const searchButton = document.querySelector(".searchButton");

const cityInput = document.querySelector(".city");

const cityStorage = document.querySelector(".cityStorage");

const cityFirstDay = document.querySelector(".firstDay");

const restOfDays = document.querySelector(".restOfDays");

let count = 0;

let container = [];

const cityInfo = [];

const cityList = [];

const cityHero = [];

const weatherIcons = {
    "01d": "wi-day-sunny",
    "01n": "wi-night-clear",
    "02d": "wi-day-cloudy",
    "02n": "wi-night-cloudy",
};

const weatherAppAPIKey = "09616a0a0b08c5d514a5544718008232"

if(JSON.parse(localStorage.getItem("count") !== null)){
    cityShow();
}

async function fetchData() {
    const city = localStorage.getItem("citySearch");
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${weatherAppAPIKey}`;

    try {

        const response = await fetch(url);

        const data = await response.json();
        
        const latitude = data[0].lat;
        const longitude = data[0].lon;
        
        const url2 = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=imperial&appid=${weatherAppAPIKey}`;
        
        const response2 = await fetch(url2);

        const data2 = await response2.json();

        let index = 0;
        for (let i = 0; i <= 32; i += 8) {
            let storageKey = "cityList" + index++;
            cityList[i] = {
                cityName: cityInput.value.trim(),
                todayDate: data2.list[i].dt_txt,
                cityIcon: data2.list[i].weather[0].icon,
                cityTemp: data2.list[i].main.temp,
                cityWind: data2.list[i].wind.speed,
                cityHumidity: data2.list[i].main.humidity
            };
            localStorage.setItem(storageKey, JSON.stringify(cityList[i]));
        }

        cityInput.value = "";
    } catch (error) {
        console.error('There was a problem with your fetch operation:', error);
    }
    cityShow();
}


// function to grab the CitySearch and storage in a localstorage
searchButton.addEventListener("click", function(event){

    event.preventDefault();

    count = JSON.parse(localStorage.getItem("count"));

    if(!count){

        count = 0;
        
    }

    let cityDisplay = document.createElement("h3")

    cityInfo[count] = {

        cityName: cityInput.value.trim(),

    }

    localStorage.setItem("citySearch", JSON.stringify(cityInfo[count].cityName));

    count++;

    localStorage.setItem("count", JSON.stringify(count));
    
    for(let i = 0; i < cityInfo.length; i++){

        cityDisplay.textContent = cityInfo[i].cityName;

        cityStorage.appendChild(cityDisplay);
    }

    fetchData();
})

function cityShow(){

    const cityTitleDocument =  document.createElement("h2");

    const cityIconDocument =  document.createElement("img");
        
    const cityMainTempDocument =  document.createElement("h3");

    const cityWindSpeedDocument =  document.createElement("h3");

    const  cityHumidityDocument =  document.createElement("h3");


    for(let i = 0; i < 5; i++){

        container[i] = document.createElement("div");

        let storageKey = "cityList" + i;
        
        let cityInformation = JSON.parse(localStorage.getItem(storageKey));

        console.log(cityInformation);

        // const todayDate = cityInformation.todayDate.substring(0, 10);

        const dateStorage = JSON.stringify(cityInformation.todayDate).substring(1, 11).replace(/-/g, "/");

        const dateSplit = dateStorage.split("/");

        const dateCorrect = dateSplit[1] + "/" + dateSplit[2] + "/" + dateSplit[0];

        const iconURL = `https://openweathermap.org/img/wn/${cityInformation.cityIcon}.png`;

        
        cityTitleDocument.textContent = cityInformation.cityName + " ";

        cityTitleDocument.textContent += dateCorrect + " ";

        cityIconDocument.src = iconURL;

        cityMainTempDocument.textContent = "Temp: " + cityInformation.cityTemp + "°F";

        cityWindSpeedDocument.textContent = "Wind: " + cityInformation.cityWind + " MPH";

        cityHumidityDocument.textContent = "Humidity: " + cityInformation.cityHumidity + " %";


        container[i].appendChild(cityTitleDocument);

        container[i].appendChild(cityIconDocument);

        container[i].appendChild(cityMainTempDocument);

        container[i].appendChild(cityWindSpeedDocument);

        container[i].appendChild(cityHumidityDocument);

        console.log(container[i]);

        if(i === 0){

            cityFirstDay.appendChild(container[i].cloneNode(true));

        }else {

            restOfDays.appendChild(container[i].cloneNode(true));

        }     
    }
}