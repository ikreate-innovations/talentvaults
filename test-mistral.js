require('dotenv').config({ path: '.env.local' });
const axios = require('axios');

const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;

console.log('API Key loaded:', MISTRAL_API_KEY ? 'YES ✓' : 'NO ✗');
console.log('API Key starts with:', MISTRAL_API_KEY?.substring(0, 10) + '...');

async function testMistral() {
  try {
    console.log('📡 Making request to Mistral API...');
    
    const response = await axios.post(
      'https://api.mistral.ai/v1/chat/completions',
      {
        model: 'mistral-small-latest', // ✅ Changed to valid model
        messages: [
          {
            role: 'user',
            content: 'Say hello briefly'
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${MISTRAL_API_KEY}`
        }
      }
    );

    console.log('✅ Success!');
    console.log('📝 Response:', response.data.choices[0].message.content);
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testMistral();