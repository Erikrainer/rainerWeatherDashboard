// Query selectors and variables and consts creation Start Here

const searchButton = document.querySelector(".searchButton");

const cityInput = document.querySelector(".city");

const cityStorage = document.querySelector(".cityStorage");

let count = 0;

const cityInfo = [];

const weatherAppAPIKey = "09616a0a0b08c5d514a5544718008232"

// Finish here the select section

function fetchData(){

const city = localStorage.getItem("citySearch");

const url = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${weatherAppAPIKey}`;

fetch(url).then(function(response){

    return response.json();

}).then(function(data){
    
    console.log("--------- First request with geolocation --------")

    console.log(data);

    const latitude = data[0].lat;

    const longitude = data[0].lon;

    console.log(latitude, longitude);

    const url2 = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=imperial&appid=${weatherAppAPIKey}`

    fetch(url2).then(function(response2) {

        return response2.json();

    }).then(function(data2){

        console.log("--------- Second request with forecase --------")

        console.log(data2);

        for(let i = 0; i < data2.list.length; i++){

            console.log(data2.list[i].main.temp)

        }
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

        console.log(cityInfo[i])

        cityDisplay.textContent = cityInfo[i].cityName;

        cityStorage.appendChild(cityDisplay);
    }

    cityInput.value = "";

    fetchData();

})