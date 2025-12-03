import { useState, useEffect } from 'react'
import axios from 'axios'

const api_key = import.meta.env.VITE_WEATHER_API_KEY

  const Filter = ({ searchTerm, handleSearchTerm }) => {
    return (
      <div>
        find countries <input value={searchTerm} onChange={handleSearchTerm}/>
      </div>
    )
  }

const App = () => {
  const [countries, setCountries] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [weather, setWeather] = useState(null)
  const filteredCountries = countries.filter(country => 
    country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
  )

  useEffect(() => {
  axios
    .get('https://studies.cs.helsinki.fi/restcountries/api/all')
    .then(response  => {
      setCountries(response.data)
    })
}, [])

  useEffect(() => {
    if (filteredCountries.length === 1) {
      const capital = filteredCountries[0].capital[0]

      axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${api_key}&units=metric`)
        .then(response => {
          console.log('Weather data fetched')
          setWeather(response.data)
        })
      .catch(error => {
        console.error('Error fetching weather data:', error)
        setWeather(null)
      })
    } else {
      setWeather(null)
    }
  }, [filteredCountries])

  const handleSearchTerm = (event) => {
    console.log(event.target.value)
    setSearchTerm(event.target.value)
  }

    return (
      <div>
        <h2>Countries</h2>
        <Filter searchTerm={searchTerm} handleSearchTerm={handleSearchTerm} />
        {filteredCountries.length > 10 ? (
          <p>Too many matches, specify another filter</p>
        ) : filteredCountries.length > 1 ? (
          <ul>
          {filteredCountries.map(country => 
            <li key={country.name.common}>{country.name.common}
            <button onClick={() => setSearchTerm(country.name.common)}>show</button>
            </li>
          )}
        </ul>
        ) : filteredCountries.length === 1 ? (
          (() => {
            const country = filteredCountries[0]
            return (
              <>  
                <h3>{country.name.common}</h3>
                <p>Capital: {country.capital}</p>
                <p>Area: {country.area}</p>
                <h3>Languages:</h3>
                <ul>
                  {Object.values(country.languages).map(language => 
                    <li key={language}>{language}</li>
                  )}
                </ul>
                <img src={country.flags.png} alt={`Flag of ${country.name.common}`} width="200"/>
                {weather && (
                <div>
                  <h3>Weather in {country.capital[0]}</h3>
                  <p>Temperature: {weather.main.temp} °C</p>
                  <p>Wind: {weather.wind.speed} m/s</p>
                  <img 
                    src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt={weather.weather[0].description}
                  />
                </div>
              )}
              </>
            )
          })()
        ) : null}
      </div>
    )
  }
export default App