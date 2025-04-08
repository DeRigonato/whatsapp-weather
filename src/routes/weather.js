const express = require('express');
const router = express.Router();
const { getWeatherByCity, isRaining, willItRainToday } = require('../services/watherService.js');
// chamada da função do zap

router.get('/weather/:city', async (req, res) => {
  try {
    const city = req.params.city;
    const weatherData = await getWeatherByCity(city);
    console.log('Dados recebidos da rota: ', weatherData);
    const rainStatus = isRaining(weatherData);

    if (!weatherData || !weatherData.current) {
      console.log("Estrutura de dados inesperada2");
      return res.status(500).json({ erro: "Estrutura de dados inesperada3" });
    }

    const rainExpected = willItRainToday(weatherData);

    const messageSend = rainExpected
      ? `Bom dia! Pode ser que chova hoje em ${city} então considere levar um guarda chuva ;D`
      : `Bom dia! Sem previsão de chuva em ${city} hoje, aproveite o sol ;D`;

    if (rainExpected) {
      const recipient = process.env.RECIPIENT_WHATSAPP;
      await sendWhatsAppMessage(recipient, messageSend);
      console.log("Alerta de chuva enviado ao whatsapp");
    } else {
      console.log("Nenhum alerta enviado, pois não há previsão de chuva");
    }

    // res.json({
    //   city,
    //   latitude: weatherData.lat,
    //   longitude: weatherData.lon,
    //   current: weatherData.current,
    //   daily: weatherData.daily,
    //   raining: rainStatus
    // });

    res.json({
      city,
      forecastToday: weatherData.daily[0],
      rainExpected,
      messageSend,
    });
  } catch (error) {
    console.error('Erro na rota /weather/:city:');
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
