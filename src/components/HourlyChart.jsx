import { Line } from 'react-chartjs-2'
import {
Chart as ChartJS,
CategoryScale,
LinearScale,
PointElement,
LineElement,
Tooltip,
Legend,
Filler,
} from 'chart.js'
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler)


export default function HourlyChart({ weather, unit = 'C' }) {
const hourly = weather.hourly
// find index of current hour
const idx = hourly.time.findIndex((t) => t === weather.current_weather.time)
const start = idx >= 0 ? idx : 0
const slice = hourly.time.slice(start, start + 24)
const temps = hourly.temperature_2m.slice(start, start + 24)


function toUnit(arr) {
return arr.map((t) => (unit === 'C' ? Math.round(t) : Math.round((t * 9) / 5 + 32)))
}


const labels = slice.map((t) => new Date(t).toLocaleTimeString(undefined, { hour: 'numeric' }))
const tempsData = toUnit(temps)


const data = {
labels,
datasets: [
{
label: `Temperature (°${unit})`,
data: tempsData,
fill: true,
tension: 0.3,
pointRadius: 3,
borderWidth: 2,
backgroundColor: (ctx) => {
const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 200)
gradient.addColorStop(0, 'rgba(255,255,255,0.18)')
gradient.addColorStop(1, 'rgba(255,255,255,0.02)')
return gradient
},
borderColor: 'rgba(255,255,255,0.9)',
},
],
}


const options = {
responsive: true,
plugins: {
legend: { display: false },
tooltip: { mode: 'index', intersect: false },
},
scales: {
x: { grid: { display: false }, ticks: { color: 'rgba(255,255,255,0.9)' } },
y: { grid: { color: 'rgba(255,255,255,0.06)' }, ticks: { color: 'rgba(255,255,255,0.9)' } },
},
}


return (
<div className="hourly-chart">
<Line data={data} options={options} />
</div>
)
}