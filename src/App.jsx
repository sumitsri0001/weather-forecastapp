import React, { useState, useEffect } from 'react';
import {
  getWeatherDesc,
  getBackground,
  isDaytime,
  formatTime,
} from './utils/weatherUtils';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import './App.css';

export default function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [background, setBackground] = useState('');
  const [hourly, setHourly] = useState([]);

  const fetchWeather = async (lat, lon, name) => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,weathercode,windspeed_10m&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,weathercode&timezone=auto`;
    const res = await fetch(url);
    const data = await res.json();
    const current = data.current_weather;
    const daily = data.daily;
    const desc = getWeatherDesc(current.weathercode);

    setWeather({
      name,
      temperature: current.temperature,
      desc: desc.desc,
      icon: desc.icon,
      windspeed: current.windspeed,
      sunrise: daily.sunrise[0],
      sunset: daily.sunset[0],
      forecast: daily,
    });

    setBackground(getBackground(desc.type));
    setHourly(data.hourly);
  };

  const getWeatherByCity = async () => {
    if (!city.trim()) {
      alert('Please enter a city name');
      return;
    }
    const geoUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${city}&limit=1`;
    const geoRes = await fetch(geoUrl);
    const geoData = await geoRes.json();
    if (geoData.length === 0) {
      alert('City not found');
      return;
    }
    const { lat, lon, display_name } = geoData[0];
    fetchWeather(lat, lon, display_name.split(',')[0]);
  };

  const useLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude, 'Your Location'),
        () => alert('Location access denied')
      );
    } else {
      alert('Geolocation not supported');
    }
  };

  const getHourlyChartData = () => {
    if (!hourly.time) return null;

    const next12Hours = hourly.time.slice(0, 12);
    const temps = hourly.temperature_2m.slice(0, 12);

    return {
      labels: next12Hours.map((t) => formatTime(t)),
      datasets: [
        {
          label: 'Temperature (°C)',
          data: temps,
          borderColor: '#ffcc00',
          backgroundColor: 'rgba(255,204,0,0.2)',
          tension: 0.3,
          fill: true,
        },
      ],
    };
  };

  useEffect(() => {
    document.body.style.background = background;
  }, [background]);

  return (
    <div className="app-container">
      <header>
        <h1>🌈 Beautiful Weather App</h1>
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={getWeatherByCity}>Search</button>
        <button onClick={useLocation}>📍 Use My Location</button>
      </header>

      {weather && (
        <div className="weather-info">
          <h2>{weather.name}</h2>
          <div className="temperature">{weather.temperature}°C</div>
          <div className="desc">{weather.icon} {weather.desc}</div>
          <div className="extra-info">
            💨 Wind: {weather.windspeed} km/h<br />
            🌅 Sunrise: {formatTime(weather.sunrise)}<br />
            🌇 Sunset: {formatTime(weather.sunset)}
          </div>

          {getHourlyChartData() && (
            <div className="chart-container">
              <Line data={getHourlyChartData()} options={{ responsive: true, plugins: { legend: { display: false } } }} />
            </div>
          )}

          <div className="forecast-container">
            {weather.forecast.time.slice(0, 5).map((time, i) => {
              const dayDesc = getWeatherDesc(weather.forecast.weathercode[i]);
              const day = new Date(time).toLocaleDateString('en-US', { weekday: 'short' });
              return (
                <div className="forecast-day" key={i}>
                  <div>{day}</div>
                  <div className="icon">{dayDesc.icon}</div>
                  <div>{weather.forecast.temperature_2m_max[i]}° / {weather.forecast.temperature_2m_min[i]}°</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}