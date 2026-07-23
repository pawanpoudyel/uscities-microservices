// =============================================================================
// EECE/CS 3093C Software Engineering — Lab 4
// server.js — code skeleton provided by Phu Phung
// complete implementation by Pawan Poudyel
// =============================================================================
const express    = require('express');
const app    = express();
const { MongoClient } = require('mongodb');
app.use (express.urlencoded({extended: false}))
const cors = require('cors')//New for microservice
app.use(cors())//New for microservice
const uri = "mongodb+srv://pawan:Password123@messengerdb.mkvqoiw.mongodb.net/?appName=MessengerDB";
const mongoclient = new MongoClient(uri);
async function mongoconnect (){
  await mongoclient.connect();
  console.log('Debug> connected to MongoDB server!');
}
const PORT = process.env.PORT || 8080;
(async () => {
  try {
    await mongoconnect();
    app.listen(PORT, () => 
      console.log('Server running on port ' + PORT));
  } catch (err) {
    console.log('Error>server.js: failed to start — database connection error', err);
    process.exit(1); // fail fast — don't run a server that can't authenticate anyone
  }
})();
app.get('/', (req, res) => {
  res.send('USCities-Microservices Gateway by Pawan Poudyel');
})

app.get('/echo/:input', function (req, res) {
  var input = req.params.input;
  res.send(input);
});

let uscities = mongoclient.db('uscities-microservices').collection('uscities');
// "uscities-microservices" is the database name, "uscities" is the collection name
// imported by mongo-import.js

// Common fields projection
const fields = {
    _id: 0,
    city: 1,
    state_id: 1,
    state_name: 1,
    county_name: 1,
    timezone: 1,
    zips: 1
};

// Search by ZIP code
app.get(/^\/uscities-search\/(\d{1,5})$/, async (req, res) => {
  const zipCode = req.params[0];
  console.log(`Debug> zipCode= ${zipCode}`);

  try {
    const zipRegEx = new RegExp(zipCode);

    const results = await uscities
      .find({ zips: zipRegEx })
      .project(fields)
      .toArray();

    res.json(results);
  } catch (error) {
    console.error('ZIP search error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Search by city name
app.get('/uscities-search/:city', async (req, res) => {
  const city = req.params.city;
  console.log(`Debug> city= ${city}`);

  try {
    const cityRegEx = new RegExp(city, 'i');

    const results = await uscities
      .find({ city: cityRegEx })
      .project(fields)
      .toArray();

    res.json(results);
  } catch (error) {
    console.error('City search error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});