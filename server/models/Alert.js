const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
    thresholdId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserThreshold'
    },
    city: String,
    message: String,
    triggeredAt: {
        type: Date,
        default: Date.now
    },
    acknowledged: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Alert', alertSchema);