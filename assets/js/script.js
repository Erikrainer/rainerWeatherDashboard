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

let cityInfo = [];

const cityList = [];

const weatherAppAPIKey = "09616a0a0b08c5d514a5544718008232"
// Finish here the variable and const area

// Just a condition to check if the count exist and theres data in the localstorage it will display the city information
if(JSON.parse(localStorage.getItem("count") !== null)){

    citySearchInit();

    cityShow(); 

}

// if the localstorage its empty it will hide the boxes and all the elements that we dont want do show
if(JSON.parse(localStorage.getItem("count") < 1)){

    document.querySelector(".hero").style.display = "none";

}

// below function to get the data from the API
async function fetchData() {

    let city;

    if(localStorage.getItem("cityHistory") !== null){

    city = localStorage.getItem("cityHistory");

    cityInput.value = JSON.parse(localStorage.getItem("cityHistory"));

    localStorage.setItem("citySearch", city);

    localStorage.removeItem("cityHistory")

    }else{
        
    city = localStorage.getItem("citySearch");

    }

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
        count = JSON.parse(localStorage.getItem("count"));

        if(count === null){
            count = 0;
        }

        let citySearchStorage = "cityInput" + count;
        
        localStorage.setItem(citySearchStorage, JSON.stringify(cityInput.value));

        cityInput.value = "";

    } catch (error) {

        console.error('There was a problem with your fetch operation:', error);

    }

    cityShow();

    citySearchInit();

}

// Finish here the Function to get the API data

// function to grab the CitySearch and storage in a localstorage
searchButton.addEventListener("click", function(event){

    event.preventDefault();

    document.querySelector(".hero").style.display = "block";

    while(cityFirstDay.hasChildNodes()){

        cityFirstDay.removeChild(cityFirstDay.firstChild);

    }
    while(restOfDays.hasChildNodes()){

        restOfDays.removeChild(restOfDays.firstChild);

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

    localStorage.setItem("count", JSON.stringify(count));

    count++;

    localStorage.setItem("count", JSON.stringify(count));

}

function citySearchInit(event){

    let countSearch = JSON.parse(localStorage.getItem("count"));

    if(countSearch === null){
        countSearch = 0;
    }

    while(cityStorage.hasChildNodes()){

        cityStorage.removeChild(cityStorage.firstChild);

    }

    for(let x = 0; x < countSearch; x++){
   
    
    let cityInputKey = "cityInput" + x;
    

    cityInfo[x] = JSON.parse(localStorage.getItem(cityInputKey));
   

    localStorage.setItem("citySearch", JSON.stringify(cityInfo[x]));
}

for (let i = 0; i < cityInfo.length; i++) {

    let button = document.createElement('button');

    button.innerText = cityInfo[i];

    button.setAttribute('data-city', cityInfo[i]);

    button.classList.add("cityHistoryButton");

    cityStorage.appendChild(button);
}


const cityHistoryButton = document.querySelectorAll(".cityHistoryButton");

cityHistoryButton.forEach(button => {

    button.addEventListener('click', function(event) {

    event.preventDefault();

    while(cityFirstDay.hasChildNodes()){

        cityFirstDay.removeChild(cityFirstDay.firstChild);
    
    }
    while(restOfDays.hasChildNodes()){
    
        restOfDays.removeChild(restOfDays.firstChild);
    
    }

    const eventTarget = JSON.stringify(event.target.getAttribute('data-city'));

    localStorage.setItem("cityHistory", eventTarget);

    localStorage.setItem("citsasyHistory", eventTarget);

    localStorage.setItem("count", 0);
    
    fetchData();

})
})};
