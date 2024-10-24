const mongoose = require('mongoose');

const dailySummarySchema = new mongoose.Schema({
    city: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    avgTemp: Number,
    maxTemp: Number,
    minTemp: Number,
    dominantWeather: String,
    weatherCounts: Map,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('DailySummary', dailySummarySchema);
