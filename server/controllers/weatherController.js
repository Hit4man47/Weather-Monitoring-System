const RawWeatherData = require('../models/RawWeatherData');
const DailySummary = require('../models/DailySummary');

exports.getCurrentWeather = async (req, res) => {
    try {
        const weather = await RawWeatherData.findOne({ city: req.params.city }).sort({ dt: -1 });
        if (!weather) return res.status(404).json({ error: `No weather data found for ${req.params.city}` });
        res.json(weather);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

exports.getDailySummary = async (req, res) => {
    try {
        const summaries = await DailySummary.find({ city: req.params.city }).sort({ date: -1 }).limit(7);
        if (!summaries.length) {
            return res.json([]);
        }
        res.json(summaries);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

exports.getWeatherHistory = async (req, res) => {
    try {
        const history = await RawWeatherData.find({ city: req.params.city }).sort({ dt: -1 }).limit(24);
        if (!history.length) return res.status(404).json({ error: `No weather history found for ${req.params.city}` });
        res.json(history);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};
