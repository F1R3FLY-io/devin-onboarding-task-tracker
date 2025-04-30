const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const baseUrl = `http://localhost:${process.env.PORT || 5001}/api`;

async function testEndpoints() {
  console.log('Testing API endpoints...');
  console.log('Base URL:', baseUrl);
  
  try {
    console.log('\nTesting user creation endpoint...');
    const userResponse = await axios.post(`${baseUrl}/users`, {
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'password123'
    });
    console.log('User creation response:', userResponse.status);
  } catch (err) {
    console.log('User creation failed (might already exist):', err.response?.status, err.response?.data);
  }
  
  try {
    console.log('\nTesting authentication endpoint...');
    const authResponse = await axios.post(`${baseUrl}/auth`, {
      email: 'testuser@example.com',
      password: 'password123'
    });
    console.log('Auth response:', authResponse.status);
    
    const token = authResponse.data.token;
    console.log('Token received:', token ? 'Yes' : 'No');
    
    try {
      console.log('\nTesting ranking lists endpoint...');
      const listsResponse = await axios.get(`${baseUrl}/rankinglists`, {
        headers: { 'x-auth-token': token }
      });
      console.log('Rankings lists response:', listsResponse.status, 'Count:', listsResponse.data.length);
      
      if (listsResponse.data.length > 0) {
        const listId = listsResponse.data[0]._id;
        console.log('\nTesting ranking items endpoint for list:', listId);
        try {
          const itemsResponse = await axios.get(`${baseUrl}/rankingitems/${listId}`, {
            headers: { 'x-auth-token': token }
          });
          console.log('Ranking items response:', itemsResponse.status, 'Count:', itemsResponse.data.length);
        } catch (err) {
          console.error('Ranking items failed:', err.response?.status, err.response?.data);
        }
      }
    } catch (err) {
      console.error('Rankings lists failed:', err.response?.status, err.response?.data);
    }
  } catch (err) {
    console.error('Auth failed:', err.response?.status, err.response?.data);
  }
}

testEndpoints();
