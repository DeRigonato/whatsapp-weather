const axios = require('axios');

const CALLMEBOT_API_KEY = process.env.CALLMEBOT_API_KEY;
const CALLMEBOT_BASE_URL = process.env.CALLMEBOT_BASE_URL;

/**
 * Envia uma mensagem via CallMeBot para o WhatsApp.
 * @param {string} to - Número do destinatário (incluindo o código do país, ex: +5511999999999).
 * @param {string} message - Texto da mensagem a ser enviada.
 * @returns {Promise} - Resposta da API.
 */

async function sendWhatsAppMessage(to, message) {
  try {
    const url = `${CALLMEBOT_BASE_URL}?phone=${encodeURIComponent(to)}&text=${encodeURIComponent(message)}&apikey=${CALLMEBOT_API_KEY}`;
    console.log('Enviando mensagem via CallMeBot: ', url);
    const response = await axios.get(url);
    console.log('Resposta de CallMeBot: ', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao enviar mensagem via CallMeBot: ', error.message);
    throw error;

  }
}

module.exports = {
  sendWhatsAppMessage,
};

