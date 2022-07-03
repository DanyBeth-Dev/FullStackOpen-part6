const Weather = ({ capital, weather, countries, newCountry }) => {
    let toPrint = countries.filter(country => country.name.common.toUpperCase().includes(newCountry.toUpperCase()))
    console.log('capital: ', capital);
    console.log('weather: ', weather);
    if (weather && toPrint.length === 1) {
        return (
            <div>
                <h3>Weather in {capital}</h3>
                <p>Temperature: {Math.round(weather.main.temp - 273.15)}º Celcius</p>
                <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt='Weather icon' />
                <p>Description: {weather.weather[0].description}</p>
                <p>Wind: {weather.wind.speed} m/s</p>
            </div>
        );
    }
}

export default Weather;
