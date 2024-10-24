
const UserThreshold = require('../models/UserThreshold');
const Alert = require('../models/Alert');
const RawWeatherData = require('../models/RawWeatherData');
const nodemailer = require('nodemailer');

class AlertService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    }

    async checkThreshold(threshold, city) {
        const duration = threshold.duration * 60 * 1000;
        const checkTime = new Date(Date.now() - duration);


        const readings = await RawWeatherData.find({
            city,
            dt: { $gte: checkTime }
        }).sort({ dt: 1 });


        const conditionMet = readings.every(reading => {
            if (threshold.comparison === '>') return reading.temp > threshold.value;
            if (threshold.comparison === '<') return reading.temp < threshold.value;
            if (threshold.comparison === '>=') return reading.temp >= threshold.value;
            if (threshold.comparison === '<=') return reading.temp <= threshold.value;
            return false;
        });


        if (conditionMet && readings.length > 0) {
            await this.createAlert(threshold, city,
                `Temperature has exceeded ${threshold.value}°C for ${threshold.duration} minutes in ${city}`);
        }
    }

    async checkAllThresholds() {
        const activeThresholds = await UserThreshold.find({ isActive: true });

        for (const threshold of activeThresholds) {
            if (threshold.type === 'temperature') {
                if (threshold.city) {
                    await this.checkThreshold(threshold, threshold.city);
                }
            }
        }
    }

    async createAlert(threshold, city, message) {

        const recentAlert = await Alert.findOne({
            thresholdId: threshold._id,
            city,
            triggeredAt: { $gte: new Date(Date.now() - 3600000) }
        });

        if (!recentAlert) {
            const alert = new Alert({
                thresholdId: threshold._id,
                city,
                message
            });

            await alert.save();
            
            await this.sendAlertEmail(message);
        }
    }

    async sendAlertEmail(message) {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.ALERT_EMAIL_RECIPIENT,
            subject: 'Weather Alert',
            text: message
        };

        try {
            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            console.error('Failed to send alert email:', error);
        }
    }
}





module.exports = new AlertService();
