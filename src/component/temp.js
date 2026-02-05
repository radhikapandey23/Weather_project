import React, { useEffect, useState } from "react";
import './temp.css'
import see from './image/see.png'
import humidity from './image/humidity.png'
import wind from './image/wind.png'
import clearsky from './image/clearsky.png'
import two from './image/two.png'
import three from './image/three.png'
import four from './image/four.png'
import nine from './image/nine.png'
import ten from './image/ten.png'
import eleven from './image/eleven.png'
import thrteen from './image/thrteen.png'
import fifty from './image/fifty.png'
import { FaSearch } from "react-icons/fa";
import { WiBarometer, WiThermometer, WiDaySunny } from "react-icons/wi";

import AOS from 'aos';
import 'aos/dist/aos.css';

const Temp = () => {
  const key_api = "0d54507dc02aa86f1a845dd430bb83a8";
  
  const [weatherData, setWeatherData] = useState({
    city: '',
    temp: '',
    feelsLike: '',
    humidity: '',
    windSpeed: '',
    pressure: '',
    visibility: '',
    weather: '',
    icon: clearsky
  });
  
  const [searchValue, setSearchValue] = useState('');
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const getWeatherIcon = (iconCode) => {
    const iconMap = {
      '01d': clearsky, '01n': clearsky,
      '02d': two, '02n': two,
      '03d': three, '03n': three,
      '04d': four, '04n': four,
      '09d': nine, '09n': nine,
      '10d': ten, '10n': ten,
      '11d': eleven, '11n': eleven,
      '13d': thrteen, '13n': thrteen,
      '50d': fifty, '50n': fifty
    };
    return iconMap[iconCode] || clearsky;
  };

  const fetchWeather = async (city = searchValue) => {
    if (!city.trim()) {
      setError('Please enter a city name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=Metric&appid=${key_api}`;
      const response = await fetch(url);
      const data = await response.json();

      if (!data.name) {
        setError('City not found');
        return;
      }

      // Save current state to history before updating
      if (weatherData.city) {
        setHistory(prev => [...prev, weatherData]);
      }

      const newWeatherData = {
        city: data.name,
        temp: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
        pressure: data.main.pressure,
        visibility: Math.round(data.visibility / 1000), // Convert m to km
        weather: data.weather[0].main,
        icon: getWeatherIcon(data.weather[0].icon)
      };

      setWeatherData(newWeatherData);
    } catch (error) {
      setError('Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const handleUndo = () => {
    if (history.length > 0) {
      const lastState = history[history.length - 1];
      setWeatherData(lastState);
      setHistory(prev => prev.slice(0, -1));
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchWeather();
  };
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const imageStyle = {
    height: "11rem",
    width: "11rem",
  };

  const centerStyle = {
    textAlign: 'center',
  };
  return (
    <div className="weather-app">
      <div className="container">
        <header className="app-header">
          <h1 className="app-title">Weather Forecast</h1>
          <p className="app-subtitle">Get real-time weather information for any city</p>
        </header>

        {error && <div className="error-message">{error}</div>}
        
        <div className='weather-card' data-aos="fade-up">
          <div className="search-section">
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-container">
                <input 
                  type="search" 
                  className="search-input" 
                  placeholder="Enter city name (e.g., London, Tokyo, New York)" 
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  disabled={loading}
                />
                <button type="submit" className="search-btn" disabled={loading}>
                  {loading ? '⏳' : <FaSearch />}
                </button>
              </div>
            </form>

            {history.length > 0 && (
              <button onClick={handleUndo} className="undo-btn">
                ↶ Undo Last Search
              </button>
            )}
          </div>

          {weatherData.city && (
            <div className="weather-content">
              <div className="main-weather">
                <div className="weather-icon-section">
                  <img src={weatherData.icon} style={imageStyle} alt="weather" className="weather-icon" />
                  <div className="weather-status">{weatherData.weather}</div>
                </div>
                
                <div className="temperature-section">
                  <div className="city-name">{weatherData.city}</div>
                  <div className="temperature">{weatherData.temp}°C</div>
                  <div className="feels-like">Feels like {weatherData.feelsLike}°C</div>
                </div>
              </div>
              
              <div className="weather-details">
                <div className="detail-card">
                  <img src={humidity} alt="humidity" className="detail-icon" />
                  <div className="detail-info">
                    <div className="detail-value">{weatherData.humidity}%</div>
                    <div className="detail-label">Humidity</div>
                  </div>
                </div>

                <div className="detail-card">
                  <img src={wind} alt="wind" className="detail-icon" />
                  <div className="detail-info">
                    <div className="detail-value">{weatherData.windSpeed} km/h</div>
                    <div className="detail-label">Wind Speed</div>
                  </div>
                </div>

                <div className="detail-card">
                  <WiBarometer className="detail-icon-react" />
                  <div className="detail-info">
                    <div className="detail-value">{weatherData.pressure} hPa</div>
                    <div className="detail-label">Pressure</div>
                  </div>
                </div>

                <div className="detail-card">
                  <WiDaySunny className="detail-icon-react" />
                  <div className="detail-info">
                    <div className="detail-value">{weatherData.visibility} km</div>
                    <div className="detail-label">Visibility</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!weatherData.city && !loading && (
            <div className="welcome-message">
              <div className="welcome-icon">🌤️</div>
              <h3>Welcome to Weather Forecast</h3>
              <p>Search for any city to get current weather information</p>
            </div>
          )}
        </div>

        <footer className="app-footer">
          <p>Built with React & OpenWeatherMap API</p>
        </footer>
      </div>
    </div>
  );
    
}

export default Temp;