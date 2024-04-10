// Query selectors and variables and consts creation Start Here
const searchButton = document.querySelector(".searchButton");

const cityInput = document.querySelector(".city");

const cityStorage = document.querySelector(".cityStorage");

const cityFirstDay = document.querySelector(".firstDay");

const restOfDays = document.querySelector(".restOfDays");
// Finish Here the QuerySelector area

// Start Here the global variable and const that i will use 
let count = 0;

let container = [];

const cityInfo = [];

const cityList = [];

const weatherAppAPIKey = "09616a0a0b08c5d514a5544718008232"
// Finish here the variable and const area

// Just a condition to check if the count exist and theres data in the localstorage it will display the city information
if(JSON.parse(localStorage.getItem("count") !== null)){

    cityShow();

    localStorage.setItem(JSON.stringify("count", count))

}

// if the localstorage its empty it will hide the boxes and all the elements that we dont want do show
if(JSON.parse(localStorage.getItem("count") < 1)){

    document.querySelector(".hero").style.display = "none";

}

// below function to get the data from the API
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
        console.log(data2)
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
// Finish here the Function to get the API data

// function to grab the CitySearch and storage in a localstorage
searchButton.addEventListener("click", function(event){

    event.preventDefault();

    document.querySelector(".hero").style.display = "block";

    while(cityFirstDay.hasChildNodes() && restOfDays.hasChildNodes()){

        cityFirstDay.removeChild(cityFirstDay.firstChild);

        restOfDays.removeChild(restOfDays.firstChild);
    }
    while(restOfDays.hasChildNodes()){

        restOfDays.removeChild(restOfDays.firstChild);

    }

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

// below function to create the container with all the city data and to append to the html
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

        // below its some const that will receive the date without the hours and convert to the MM/DD/YYYY format
        const dateStorage = JSON.stringify(cityInformation.todayDate).substring(1, 11).replace(/-/g, "/");

        const dateSplit = dateStorage.split("/");

        const dateCorrect = dateSplit[1] + "/" + dateSplit[2] + "/" + dateSplit[0];
        // Its done here the date correction

        // below its one const to set the icons images
        const iconURL = `https://openweathermap.org/img/wn/${cityInformation.cityIcon}.png`;
      
        // here we start the set text content 
        cityTitleDocument.textContent = cityInformation.cityName + " ";

        cityTitleDocument.textContent += dateCorrect + " ";

        cityIconDocument.src = iconURL;

        let tempCelsius = (cityInformation.cityTemp - 32) * 5/9;

        tempCelsius = tempCelsius.toFixed(1);

        cityMainTempDocument.textContent = "Temp: " + cityInformation.cityTemp + "°F / " + tempCelsius + "°C";

        cityWindSpeedDocument.textContent = "Wind: " + cityInformation.cityWind + " MPH";

        cityHumidityDocument.textContent = "Humidity: " + cityInformation.cityHumidity + " %";
        //  here finish the text content section

        // Start append the childs elements to the container("div")
        container[i].appendChild(cityTitleDocument);

        container[i].appendChild(cityIconDocument);

        container[i].appendChild(cityMainTempDocument);

        container[i].appendChild(cityWindSpeedDocument);

        container[i].appendChild(cityHumidityDocument);
        // Finish the container div 

        // if i = 0 it will append to the first child, this will ber our first element to show
        if(i === 0){

            cityFirstDay.appendChild(container[i].cloneNode(true));

        // if its different than 0 it will append to the second section
        }else {

            restOfDays.appendChild(container[i].cloneNode(true));

        }     
    }
}