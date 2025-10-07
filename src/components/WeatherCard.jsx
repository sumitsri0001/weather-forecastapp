import { motion } from 'framer-motion'
import ForecastCard from './ForecastCard'
import HourlyChart from './HourlyChart'
import { getWeatherDesc } from '../utils/weatherUtils'

export default function WeatherCard({ weather, unit = 'C' }){
   const current = weather.current_weather
    const daily = weather.daily


    const desc = getWeatherDesc(current.weathercode)


function toUnit(tempC) {
return unit === 'C' ? Math.round(tempC) : Math.round((tempC * 9) / 5 + 32)

} 
return (
<motion.div
className="weather-card"
initial={{ scale: 0.98, opacity: 0 }}
animate={{ scale: 1, opacity: 1 }}
>
<div className="current-row">
<div className="left">
<div className="icon-big">{desc.icon}</div>
<div className="desc-text">{desc.desc}</div>
</div>
<div className="right">
<div className="temp-big">{toUnit(current.temperature)}°</div>
<div className="meta">Wind: {current.windspeed} km/h</div>
<div className="meta">Time: {new Date(current.time).toLocaleString()}</div>
</div>
</div>


<div className="extra-row">
<div className="sun">
🌅 Sunrise: {new Date(daily.sunrise[0]).toLocaleTimeString()} <br />
🌇 Sunset: {new Date(daily.sunset[0]).toLocaleTimeString()}
</div>


<div className="daily">
{daily.time.slice(0, 5).map((d, i) => (
<ForecastCard
key={i}
day={new Date(d).toLocaleDateString(undefined, { weekday: 'short' })}
max={daily.temperature_2m_max[i]}
min={daily.temperature_2m_min[i]}
code={daily.weathercode[i]}
unit={unit}
/>
))}
</div>
</div>


<div className="chart-section">
<h3>Hourly (next 24 hours)</h3>
<HourlyChart weather={weather} unit={unit} />
</div>
</motion.div>
)
}