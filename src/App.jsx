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
  const [loading, setLoading] = useState(false);

  // ====== Fetch weather data ======
  const fetchWeather = async (lat, lon, name) => {
    setLoading(true);
    try {
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

      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert('Failed to fetch weather data');
    }
  };

  // ====== Search by city ======
  const getWeatherByCity = async () => {
    if (!city.trim()) return alert('Please enter a city name');
    try {
      const geoUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${city}&limit=1`;
      const geoRes = await fetch(geoUrl);
      const geoData = await geoRes.json();
      if (!geoData.length) return alert('City not found');

      const { lat, lon, display_name } = geoData[0];
      fetchWeather(lat, lon, display_name.split(',')[0]);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch location');
    }
  };

  // ====== Use current location ======
  const useLocation = () => {
    if (!navigator.geolocation) return alert('Geolocation not supported');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          // Reverse geocode to get city name
          const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
          const geoData = await geoRes.json();
          const name = geoData.address.city || geoData.address.town || geoData.address.village || 'Your Location';
          setCity(name);
          fetchWeather(latitude, longitude, name);
        } catch (err) {
          console.error(err);
          fetchWeather(latitude, longitude, 'Your Location');
        }
      },
      () => alert('Location access denied'),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // ====== Hourly chart data ======
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
          pointRadius: 4,
        },
      ],
    };
  };

  // ====== Animate background ======
  useEffect(() => {
    document.body.style.transition = 'background 1s ease';
    document.body.style.background = background;
  }, [background]);

  // ====== Auto-refresh every 5 minutes ======
  useEffect(() => {
    if (!weather) return;
    const interval = setInterval(() => {
      if (weather.name === 'Your Location' && navigator.geolocation) {
        useLocation();
      } else if (city) getWeatherByCity();
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [weather, city]);

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

      {loading && <div className="loading">⏳ Fetching weather...</div>}

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
              <Line
                data={getHourlyChartData()}
                options={{
                  responsive: true,
                  plugins: { legend: { display: false } },
                  animation: { duration: 800 },
                }}
              />
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
