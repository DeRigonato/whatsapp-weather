const cron = require('node-cron');
const { getWeatherByCity, willItRainToday } = require('../services/watherService.js');
const { sendWhatsAppMessage } = require('../services/messageService.js');

const CITY = 'Itatiba,SP,BR';
const RECIPIENT = process.env.RECIPIENT_WHATSAPP;

cron.schedule('0 7 * * *', async () => {
  console.log(`Executando job de verificação de previsão para ${CITY}`);
  try {
    const weatherData = await getWeatherByCity(CITY);
    const rainExpected = willItRainToday(weatherData);
    if (rainExpected) {
      const message = `Bom dia! Há previsão de chuva hoje em ${CITY}. Lembre-se de levar seu guarda-chuva.`;
      await sendWhatsAppMessage(RECIPIENT, message);
      console.log('Alerta de chuva enviado com sucesso.');
    } else {
      console.log('Nenhuma chuva prevista hoje.');
    }
  } catch (error) {
    console.error('Erro no job de alerta:', error);
  }
});
