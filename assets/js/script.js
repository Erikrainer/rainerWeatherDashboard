const weatherAppAPIKey = "09616a0a0b08c5d514a5544718008232"
const city = "London"
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