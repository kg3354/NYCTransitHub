const express = require('express');
const fetch = require('node-fetch');
const app = express();
const port = 3000;

app.get('/api/data', async (req, res) => {
  const apiKey = 'YOUR_API_KEY'; // Securely manage this
  const url = 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-ace';

  try {
    const apiResponse = await fetch(url, {
      headers: { 'x-api-key': apiKey }
    });
    const data = await apiResponse.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching MTA data:', error);
    res.status(500).send('Error fetching data');
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
