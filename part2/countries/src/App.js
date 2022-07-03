import { useState, useEffect } from 'react';
import axios from 'axios';
import Display from './components/Display';
import Weather from './components/Weather';

function App() {
  const [countries, setCountries] = useState([]);
  const [capital, setCapital] = useState();
  const [weather, setWeather] = useState();
  const [newCountry, setNewCountry] = useState('');

  const hookCountries = () => {
    const eventHandler = response => {
      setCountries(response.data)
      console.log('setCountries se activó');
    }
    const promise = axios.get('https://restcountries.com/v3.1/all');
    promise.then(eventHandler)
  }
  useEffect(hookCountries, []);

  const hookWeather = () => {
    const eventHandler = response => {
      console.log('response: ', response);
      setWeather(response.data);
      console.log('setWeather se activó');
    }
    const promise = axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${process.env.REACT_APP_API_KEY}`);
    promise.then(eventHandler)
  }
  
  useEffect(() => {
    console.log('capital en useEffect: ', capital);
    if (!capital) {
        return;
    } else {
        hookWeather();
    }
  }, [capital]);
  
  const handleSearch = (event) => {
    setNewCountry(event.target.value.toUpperCase());
  };

  return (
    <div>
      <div>find countries <input id="myInput" onChange={handleSearch} /></div>
      <Display countries={countries} newCountry={newCountry} setNewCountry={setNewCountry} setCapital={setCapital} weather={weather} setWeather={setWeather} capital={capital} />
      <Weather capital={capital} weather={weather} countries={countries} newCountry={newCountry} />
    </div>
  );
}

export default App;
