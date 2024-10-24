
const http = require('http');
const mongoose = require('mongoose');
require('dotenv').config();

const checkMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/weather-monitoring');
        
        return true;
    } catch (err) {
        console.error('❌ MongoDB connection failed:', err.message);
        return false;
    }
};

const checkBackendServer = () => {
    return new Promise((resolve) => {
        http.get('http://localhost:3000/api/health', (res) => {
            if (res.statusCode === 200) {
                
                resolve(true);
            } else {
                console.error('❌ Backend server check failed');
                resolve(false);
            }
        }).on('error', (err) => {
            console.error('❌ Backend server is not running:', err.message);
            resolve(false);
        });
    });
};

const main = async () => {
    

    const mongoOk = await checkMongoDB();
    const backendOk = await checkBackendServer();

    
    
    
    

    if (!mongoOk || !backendOk) {
        
        if (!mongoOk) {
            
            
        }
        if (!backendOk) {
            
            
        }
    }

    process.exit(!mongoOk || !backendOk ? 1 : 0);
};

main();