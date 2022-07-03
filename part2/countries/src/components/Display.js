const Display = ({ countries, newCountry, setNewCountry, setCapital, weather, capital, setWeather }) => {
    let toPrint = countries.filter(country => country.name.common.toUpperCase().includes(newCountry.toUpperCase()))
    if (newCountry === '') {
        return <ul id="myUL">{countries.map(country => <li key={country.name.common}>{country.name.common}</li>)}</ul>
    } else if (toPrint.length > 10) {
        return <p>Too many matches, specify another filter</p>
    } else if (toPrint.length <= 10 && toPrint.length > 1) {
        return <ul id="myUL">{toPrint.map(print => <li key={print.name.common}>{print.name.common} <button onClick={() => setNewCountry(print.name.common)}>show</button></li>)}</ul>
    } else if (toPrint.length === 0) {
        return <p>No results</p>
    } else if (toPrint.length === 1) {
        let city = toPrint[0].capital
        setCapital(city);
        console.log('setCapital se activó')
        return (
            <div>
                <h1>{toPrint[0].name.common}</h1>
                <p>Capital: {city}</p>
                <p>Area: {toPrint[0].area} km2</p>
                <h3>Languages</h3>
                <ul>{Object.values(toPrint[0].languages).map(lg => <li key={lg}>{lg}</li>)}</ul>
                <img src={toPrint[0].flags.png} alt={`${toPrint[0].name.common} flag`} />
            </div>
        )
    }
}

export default Display;
