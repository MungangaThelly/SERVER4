// server.js

require('dotenv').config();  // Load environment variables from .env file
const express = require('express');
const axios = require('axios');
const path = require('path'); // Fix the 'Const' typo
const data = require('data.json'); // Ensure the path to the data.json is correct

const app = express();

// Use the port from the .env file or default to 3000 if not set
const PORT = process.env.PORT || 3000;

// Define the Open-Meteo API URL
const METEO_API_URL = 'https://api.open-meteo.com/v1/forecast';

// Middleware to parse JSON requests
app.use(express.json());

// Endpoint to get weather for a specific location (latitude, longitude)
app.get('/weather', async (req, res) => {
    const { lat, lon } = req.query;  // Get lat and lon from query params
    
    if (!lat || !lon) {
        return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    try {
        // Fetch the weather data from Open-Meteo API
        const response = await axios.get(METEO_API_URL, {
            params: {
                latitude: lat,
                longitude: lon,
                hourly: 'temperature_2m',  // Hourly temperature at 2m above ground
            }
        });

        // Extract the relevant weather data
        const weatherData = {
            location: `Latitude: ${lat}, Longitude: ${lon}`,
            temperature: response.data.hourly.temperature_2m[0], // Get the first hourly temperature
            time: response.data.hourly.time[0], // Corresponding timestamp for the first hourly temperature
        };

        // Log the weather data to the console
        console.log(`Weather Data for ${weatherData.location}:`);
        console.log(`Temperature: ${weatherData.temperature}°C`);
        console.log(`Time: ${weatherData.time}`);

        // Send the weather data as the response
        res.json(weatherData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

// Root route to check if the server is running
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/SERVER/index.html')); // Fix path.join usage
});

app.post('/data', (req, res) => {
    const choice = req.body.choice;

    // Check if choice is provided
    if (!choice) {
        return res.status(400).json({ error: 'Choice is required' });
    }

    // Filter the data based on the choice
    const filteredData = data.filter((entry) => entry.type === choice);

    // Send the filtered data as the response
    res.json(filteredData);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
