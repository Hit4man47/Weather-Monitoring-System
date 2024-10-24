const axios = require('axios');
const config = require('config');
const RawWeatherData = require('../models/RawWeatherData');

class DataRetrievalService {
    constructor() {
        this.apiKey = process.env.OPENWEATHER_API_KEY;
        this.cities = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];
        this.interval = config.get('dataFetchInterval') || 300000;
    }

    kelvinToCelsius(kelvin) {
        return (kelvin - 273.15).toFixed(2);
    }

    async fetchWeatherData(city) {
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},IN&appid=${this.apiKey}`;
            const response = await axios.get(url);
            const weather = response.data.weather[0];

            const weatherData = new RawWeatherData({
                city,
                id: weather.id,
                main: weather.main,
                icon: weather.icon,
                temp: this.kelvinToCelsius(response.data.main.temp),
                feels_like: this.kelvinToCelsius(response.data.main.feels_like),
                dt: new Date(response.data.dt * 1000),
                humidity: response.data.main.humidity,
                wind: {
                    speed: response.data.wind.speed,
                    deg: response.data.wind.deg
                }
            });

            await weatherData.save();
            return weatherData;
        } catch (error) {
            console.error(`Error fetching weather data for ${city}:`, error);
            throw error;
        }
    }

    async startDataCollection() {
        
        setInterval(async () => {
            for (const city of this.cities) {
                try {
                    await this.fetchWeatherData(city);
                    
                } catch (error) {
                    console.error(`Failed to collect weather data for ${city}`);
                }
            }
        }, this.interval);
    }
}

module.exports = new DataRetrievalService();
