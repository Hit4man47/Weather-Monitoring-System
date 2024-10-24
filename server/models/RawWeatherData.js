const mongoose = require('mongoose');
const rawWeatherDataSchema = new mongoose.Schema({
    city: String,
    dt: Date,
    temp: Number,
    feels_like: Number,
    id: Number,  
    main: String,  
    icon: String,   
    humidity: Number, 
    wind: {
        speed: Number, 
        deg: Number    
    }
});
module.exports = mongoose.model('RawWeatherData', rawWeatherDataSchema);
