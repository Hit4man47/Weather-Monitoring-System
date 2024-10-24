const RawWeatherData = require('../models/RawWeatherData');
const DailySummary = require('../models/DailySummary');

class DataProcessingService {
    async calculateDailySummary(city, date) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const dailyData = await RawWeatherData.find({
            city,
            dt: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        });

        if (dailyData.length === 0) {
            return null;
        }


        const temperatures = dailyData.map(data => parseFloat(data.temp)).filter(temp => !isNaN(temp));
        if (temperatures.length === 0) {
            return null;
        }

        const avgTemp = (temperatures.reduce((a, b) => a + b, 0) / temperatures.length).toFixed(2);
        const maxTemp = Math.max(...temperatures).toFixed(2);
        const minTemp = Math.min(...temperatures).toFixed(2);


        const weatherCounts = new Map();
        dailyData.forEach(data => {
            const count = weatherCounts.get(data.main) || 0;
            weatherCounts.set(data.main, count + 1);
        });

        let dominantWeather = '';
        let maxCount = 0;
        weatherCounts.forEach((count, weather) => {
            if (count > maxCount) {
                maxCount = count;
                dominantWeather = weather;
            }
        });


        const summary = await DailySummary.findOneAndUpdate(
            {
                city,
                date: startOfDay
            },
            {
                avgTemp,
                maxTemp,
                minTemp,
                dominantWeather,
                weatherCounts: Object.fromEntries(weatherCounts)
            },
            {
                upsert: true,
                new: true
            }
        );

        return summary;
    }

    async processDailySummaries() {
        const cities = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];
        const today = new Date();

        for (const city of cities) {
            await this.calculateDailySummary(city, today);
        }
    }
}

module.exports = new DataProcessingService();