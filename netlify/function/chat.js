// netlify/functions/chat.js
const axios = require('axios');
require('dotenv').config();

exports.handler = async function(event, context) {
  // Solo permitir solicitudes POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Método no permitido' };
  }

  try {
    const data = JSON.parse(event.body);
    const userMessage = data.message;

    if (!userMessage) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Mensaje requerido' }) };
    }

    // Llamada a la API de OpenAI desde el servidor
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are the Hallownest Assistant, a helpful AI themed after the game Hollow Knight. Use references to the game when appropriate, and adopt a slightly mystical, knowledgeable tone that fits the atmosphere of Hallownest. Be concise but helpful."
          },
          {
            role: "user",
            content: userMessage
          }
        ],
        max_tokens: 150
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        }
      }
    );

    // Devolver solo el contenido de la respuesta
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: response.data.choices[0].message.content
      })
    };
  } catch (error) {
    console.log('Error:', error.response?.data || error.message);
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Error al procesar la solicitud',
        details: error.message
      })
    };
  }
};
