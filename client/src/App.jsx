import React from 'react';
import WeatherDashboard from './components/WeatherDashboard';
import AnimatedBackground from './components/AnimatedBackground';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

function App() {
    return (
        <div className="App relative min-h-screen bg-gray-100">
            <AnimatedBackground />
            <WeatherDashboard />
        </div>
    );
}

export default App;