import { getWeatherDesc } from '../utils/weatherUtils'
export default function ForecastCard({ day, max, min, code, unit = 'C' }) {
function toUnit(t) {
return unit === 'C' ? Math.round(t) : Math.round((t * 9) / 5 + 32)
}


const info = getWeatherDesc(code)
return (
<div className="forecast-card">
<div className="fc-day">{day}</div>
<div className="fc-icon">{info.icon}</div>
<div className="fc-temp">{toUnit(max)}° / {toUnit(min)}°</div>
</div>
)
}