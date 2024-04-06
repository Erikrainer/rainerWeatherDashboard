// Query selectors and variables and consts creation Start Here

const searchButton = document.querySelector(".searchButton");

const cityInput = document.querySelector(".city");

const cityStorage = document.querySelector(".cityStorage");

let count = 0;

const cityInfo = [];

const cityList = [];

const weatherAppAPIKey = "09616a0a0b08c5d514a5544718008232"

// Finish here the select section

function fetchData(){

const city = localStorage.getItem("citySearch");

const url = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${weatherAppAPIKey}`;

fetch(url).then(function(response){

    return response.json();

}).then(function(data){
    
    const latitude = data[0].lat;

    const longitude = data[0].lon;

    const url2 = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=imperial&appid=${weatherAppAPIKey}`

    fetch(url2).then(function(response2) {

        return response2.json();

    }).then(function(data2){

        let index = 0;
// For loop below to set the object of city information creating the localStorage for cityList0 - 4
        for(let i = 0; i <= 32; i = i + 8){

            let storageKey = "cityList" + index++;

             cityList[i] = {

                cityName: cityInput.value.trim(),

                todayDate: data2.list[i].dt_txt,

                cityIcon: data2.list[i].weather[0].icon,

                cityTemp: data2.list[i].main.temp,

                cityWind: data2.list[i].wind.speed

                };

                localStorage.setItem(storageKey, JSON.stringify(cityList[i]));
        }

        cityInput.value = "";
    })  
})
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