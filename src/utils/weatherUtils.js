export function getWeatherDesc(code) {
  if (code === 0) return { desc: 'Clear Sky', icon: '☀️', type: 'clear' };
  if ([1, 2, 3].includes(code)) return { desc: 'Partly Cloudy', icon: '🌤️', type: 'cloudy' };
  if ([45, 48].includes(code)) return { desc: 'Foggy', icon: '🌫️', type: 'fog' };
  if (code >= 51 && code <= 67) return { desc: 'Drizzle', icon: '🌦️', type: 'rain' };
  if (code >= 71 && code <= 77) return { desc: 'Snowfall', icon: '❄️', type: 'snow' };
  if (code >= 80 && code <= 82) return { desc: 'Rain Showers', icon: '🌧️', type: 'rain' };
  if (code >= 95 && code <= 99) return { desc: 'Thunderstorm', icon: '⛈️', type: 'storm' };
  return { desc: 'Unknown', icon: '❓', type: 'unknown' };
}

export function isDaytime() {
  const hour = new Date().getHours();
  return hour >= 6 && hour < 18;
}

export function getBackground(type) {
  const day = isDaytime();
  const gradients = {
    clear: day ? 'linear-gradient(135deg, #74ABE2, #5563DE)' : 'linear-gradient(135deg, #1b2735, #090a0f)',
    cloudy: day ? 'linear-gradient(135deg, #b0c4de, #708090)' : 'linear-gradient(135deg, #3a3a52, #24243e)',
    fog: day ? 'linear-gradient(135deg, #d7d2cc, #304352)' : 'linear-gradient(135deg, #757f9a, #d7dde8)',
    rain: day ? 'linear-gradient(135deg, #667db6, #0082c8, #667db6)' : 'linear-gradient(135deg, #283e51, #485563)',
    snow: day ? 'linear-gradient(135deg, #83a4d4, #b6fbff)' : 'linear-gradient(135deg, #2c3e50, #bdc3c7)',
    storm: day ? 'linear-gradient(135deg, #434343, #000000)' : 'linear-gradient(135deg, #141E30, #243B55)',
    unknown: 'linear-gradient(135deg, #606c88, #3f4c6b)',
  };
  return gradients[type] || gradients.unknown;
}

export function formatTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}