const Alert = require('../models/Alert');
const UserThreshold = require('../models/UserThreshold');

exports.getAlerts = async (req, res) => {
    try {
        const alerts = await Alert.find({ city: req.params.city });
        
        if (!alerts.length) {
            return res.json([]);
        }
        res.json(alerts);
    } catch (error) {
        console.error('Error fetching alerts:', error);
        res.status(500).send('Server Error');
    }
};


exports.createThreshold = async (req, res) => {
    try {
        const threshold = new UserThreshold(req.body);
        await threshold.save();
        res.status(201).json(threshold);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateThreshold = async (req, res) => {
    try {
        const threshold = await UserThreshold.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(threshold);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteThreshold = async (req, res) => {
    try {
        await UserThreshold.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getThresholds = async (req, res) => {
    try {
        const thresholds = await UserThreshold.find();
        res.json(thresholds);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.acknowledgedAlert = async (req, res) => {
    try {
        const alertId = req.params.id;
        const updatedAlert = await Alert.findByIdAndUpdate(
            alertId,
            { acknowledged: true },
            { new: true }
        );
        res.json(updatedAlert);
    } catch (error) {
        console.error('Error acknowledging alert:', error);
        res.status(500).json({ error: error.message });
    }
};