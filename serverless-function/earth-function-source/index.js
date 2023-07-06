const functions = require('@google-cloud/functions-framework');
const axios = require('axios');

functions.http('retrieveNasaImage', async (request, response) => {
    
    response.set('Access-Control-Allow-Origin', '*');

  if (request.method === 'OPTIONS') {
    response.set('Access-Control-Allow-Methods', 'GET');
    response.set('Access-Control-Allow-Headers', 'Content-Type');
    response.set('Access-Control-Max-Age', '3600');
    response.status(204).send('');
  } 


  let date = request.query.date;
  axios.get(`https://api.nasa.gov/planetary/apod?date=${date}&api_key=${process.env.NASA_KEY}`).then(nasaResponse => {
      console.log(`Response Receieved`)
      response.status(200).send(nasaResponse.data)
    })
 
})