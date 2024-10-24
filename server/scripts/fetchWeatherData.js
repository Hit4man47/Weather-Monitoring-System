require('dotenv').config();
const axios = require('axios');
const mongoose = require('mongoose');
const RawWeatherData = require('../models/RawWeatherData');
const DailySummary = require('../models/DailySummary');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/weather-monitoring';

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => 
    .catch(err => console.error('MongoDB connection error:', err));

const fetchWeatherData = async (lat, lon) => {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    try {
        const response = await axios.get(url);
        const weatherData = response.data;

        const rawWeatherData = new RawWeatherData({
            city: weatherData.name,
            dt: new Date(weatherData.dt * 1000),
            temp: weatherData.main.temp,
            feels_like: weatherData.main.feels_like,
            temp_min: weatherData.main.temp_min,
            temp_max: weatherData.main.temp_max,
            pressure: weatherData.main.pressure,
            humidity: weatherData.main.humidity,
            weather: weatherData.weather[0].description,
            wind_speed: weatherData.wind.speed,
            wind_deg: weatherData.wind.deg,
            clouds: weatherData.clouds.all,
            rain: weatherData.rain ? weatherData.rain['1h'] : 0,
            snow: weatherData.snow ? weatherData.snow['1h'] : 0,
        });

        await rawWeatherData.save();
        

    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
};

const main = async () => {
    const lat = 28.6139;
    const lon = 77.2090;
    await fetchWeatherData(lat, lon);
    mongoose.connection.close();
};

main();
