const mongoose = require('mongoose');

const userThresholdSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['temperature', 'weather'],
        required: true
    },
    condition: {
        type: String,
        required: true
    },
    comparison: {
        type: String,
        enum: ['>', '<', '>=', '<='],
        required: true
    },
    value: {
        type: Number,
        required: true
    },
    duration: {
        type: Number, 
        required: true
    },
    city: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('UserThreshold', userThresholdSchema);
