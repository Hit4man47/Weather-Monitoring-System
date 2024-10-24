require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const apiRoutes = require('./routes/api');
const dataRetrievalService = require('./services/dataRetrievalService');
const dataProcessingService = require('./services/dataProcessingService');
const alertService = require('./services/alertService');

const app = express();


app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());


app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});


const connectDB = async (retries = 5) => {
    for (let i = 0; i < retries; i++) {
        try {
            await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/weather-monitoring', {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            
            return;
        } catch (err) {
            console.error(`MongoDB connection attempt ${i + 1} failed:`, err.message);
            if (i === retries - 1) throw err;
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
};


app.use('/api', apiRoutes);


app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
        path: req.path
    });
});


const startServer = async () => {
    try {
        await connectDB();

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            
            startServices().catch(console.error);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
};


const startServices = async () => {
    try {
        await dataRetrievalService.startDataCollection();


        setInterval(() => {
            dataProcessingService.processDailySummaries().catch(console.error);
        }, 300000);


        setInterval(() => {
            alertService.checkAllThresholds().catch(console.error);
        }, 30000);
    } catch (err) {
        console.error('Error starting services:', err);
        throw err;
    }
};

startServer();

module.exports = app;