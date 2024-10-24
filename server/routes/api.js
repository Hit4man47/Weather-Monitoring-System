const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');
const alertController = require('../controllers/alertController');

// Weather routes
router.get('/weather/:city', weatherController.getCurrentWeather);
router.get('/weather/daily-summary/:city', weatherController.getDailySummary);
router.get('/weather/history/:city', weatherController.getWeatherHistory);

// Alert routes
router.get('/alerts/:city', alertController.getAlerts);
router.post('/alerts/threshold', alertController.createThreshold);
router.put('/alerts/threshold/:id', alertController.updateThreshold);
router.delete('/alerts/threshold/:id', alertController.deleteThreshold);
router.get('/alerts/threshold', alertController.getThresholds);
router.put('/alerts/acknowledge/:id', alertController.acknowledgedAlert);

module.exports = router;