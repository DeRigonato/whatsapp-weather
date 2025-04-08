const axios = require('axios');

const API_KEY = process.env.OPENWEATHERMAP_API_KEY;

async function getCordenades(city) {
  try {
    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${API_KEY}`;
    console.log("Consultando cordenadas...", geoUrl);
    const response = await axios.get(geoUrl);
    if (response.data.length === 0) {
      throw new Error('Cidade não encontrada');
    }
    const { lat, lon } = response.data[0];
    return { lat, lon };
  } catch (error) {
    console.error('Erro ao obter as cordenadas', error.message);
    throw error;
  }
}

async function getWeatherByCity(city) {
  try {
    const { lat, lon } = await getCordenades(city);

    const exclude = 'minutely,hourly,alerts';
    const oneCallUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=${exclude}&appid=${API_KEY}&units=metric&lang=pt`;
    console.log('Consultando clima via OneCall:', oneCallUrl);
    const response = await axios.get(oneCallUrl);
    //    console.log('Resposta da onecall: ', response.data);
    return response.data;

  } catch (error) {
    if (error.response) {
      console.error('Erro na resposta da API:', error.response.data);
    } else {
      console.error('Erro ao obter os dados do tempo', error.message);
    }

    throw error;
  }
}

function isRaining(weatherData) {
  if (!weatherData || !weatherData.current || !Array.isArray(weatherData.current.weather)) {
    console.error("Estrutura de resposta inesperada. Propriedade 'current.weather' não encontrada ou não é um array.");
    console.log("weatherData recebido:", weatherData);
    return false;
  }
  console.log("Dados de weather encontrados:", weatherData.current.weather);
  return weatherData.current.weather.some(condition => {
    console.log("Condição:", condition);
    return condition.main && condition.main.toLowerCase() === 'rain';
  });
}

function willItRainToday(weatherData) {
  if (!weatherData || !weatherData.daily || !Array.isArray(weatherData.daily)) {
    console.error("Estrutura de resposta inesperada para daily.");
    return false;
  }

  const todayForecast = weatherData.daily[0];

  if (todayForecast.rain && todayForecast.rain > 0) {
    return true;
  }
  if (todayForecast.pop && todayForecast.pop >= 0.5) {
    return true;
  }
  return true
}

module.exports = {
  getWeatherByCity,
  isRaining,
  willItRainToday,
};
