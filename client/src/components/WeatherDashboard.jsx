import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AnimatedDroplet from './ui/droplet';
import { AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Responsive, WidthProvider } from 'react-grid-layout';
import CountUp from 'react-countup';
import './WeatherDashboard.css';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { acknowledgeAlert, fetchWeatherData, fetchDailySummary, fetchWeatherHistory, fetchAlerts, createThreshold } from '../services/api';

const ResponsiveGridLayout = WidthProvider(Responsive);

const WeatherDashboard = () => {
    const [currentWeather, setCurrentWeather] = useState(null);
    const [dailySummary, setDailySummary] = useState([]);
    const [weatherHistory, setWeatherHistory] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [selectedCity, setSelectedCity] = useState('Delhi');
    const [isFahrenheit, setIsFahrenheit] = useState(false);
    const [theme, setTheme] = useState('dark');
    const [thresholds, setThresholds] = useState([]);
    const [newThreshold, setNewThreshold] = useState({
        city: selectedCity,
        value: '',
        comparison: '>',
        condition: 'temperature',
        type: 'temperature',
        duration: ''
    });

    const cities = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [weather, summary, history, alertsData] = await Promise.all([
                    fetchWeatherData(selectedCity),
                    fetchDailySummary(selectedCity),
                    fetchWeatherHistory(selectedCity),
                    fetchAlerts(selectedCity)
                ]);
                setCurrentWeather(weather);
                setDailySummary(summary);
                setWeatherHistory(history);
                setAlerts(alertsData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        const fetchThresholds = async () => {
            try {
                const thresholdsData = await fetchAlerts();
                setThresholds(thresholdsData);
            } catch (error) {
                console.error('Error fetching thresholds:', error);
            }
        };

        fetchData();
        fetchThresholds();

        const interval = setInterval(fetchData, 300000);
        return () => clearInterval(interval);
    }, [selectedCity]);

    useEffect(() => {
        setNewThreshold({ ...newThreshold, city: selectedCity });
    }, [selectedCity])

    const convertTemp = (temp) => isFahrenheit ? (temp * 9 / 5) + 32 : temp;

    const processedWeatherHistory = useMemo(() => {
        return weatherHistory.map(item => ({
            ...item,
            temp: Number(convertTemp(item.temp).toFixed(2))
        }));
    }, [weatherHistory, isFahrenheit]);

    const processedDailySummary = useMemo(() => {
        return dailySummary.map(item => ({
            ...item,
            maxTemp: Number(convertTemp(item.maxTemp).toFixed(2)),
            minTemp: Number(convertTemp(item.minTemp).toFixed(2)),
            avgTemp: Number(convertTemp(item.avgTemp).toFixed(2))
        }));
    }, [dailySummary, isFahrenheit]);

    const temp = parseFloat(currentWeather?.temp);
    const feelsLike = parseFloat(currentWeather?.feels_like);
    const displayTemp = !isNaN(temp) ? convertTemp(temp).toFixed(1) : 'N/A';
    const displayFeelsLike = !isNaN(feelsLike) ? convertTemp(feelsLike).toFixed(1) : 'N/A';
    const humidity = currentWeather?.humidity || 'N/A';
    const windSpeed = currentWeather?.wind?.speed || 'N/A';
    const windDirection = currentWeather?.wind?.deg || 0;


    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const getWeatherIconUrl = (icon) => `https://openweathermap.org/img/wn/${icon}@2x.png`;

    const handleCreateThreshold = async () => {
        
        try {
            const response = await createThreshold(newThreshold);
            
            setNewThreshold({ city: selectedCity, temp: '', comparison: '>' });
            const updatedThresholds = await fetch('/api/alerts/threshold').then(res => res.json());
            setThresholds(updatedThresholds);
        } catch (error) {
            console.error('Error creating threshold:', error);
        }
    };

    const handleDeleteThreshold = async (id) => {
        try {
            await deleteThreshold(id);
            setThresholds(thresholds.filter(threshold => threshold._id !== id));
        } catch (error) {
            console.error('Error deleting threshold:', error);
        }
    };

    const handleAcknowledgeAlert = async (alertId) => {
        try {
            const updatedAlert = await acknowledgeAlert(alertId);
            setAlerts((prevAlerts) =>
                prevAlerts.map(alert =>
                    alert._id === updatedAlert._id ? updatedAlert : alert
                )
            );
        } catch (error) {
            console.error('Error acknowledging alert:', error);
        }
    };


    const layout = {
        lg: [
            { i: 'currentTemp', x: 0, y: 0, w: 1, h: 2 },
            { i: 'feelsLike', x: 1, y: 0, w: 1, h: 2 },
            { i: 'weatherCondition', x: 2, y: 0, w: 1, h: 2 },
            { i: 'humidity', x: 0, y: 2, w: 1, h: 2 },
            { i: 'windSpeed', x: 1, y: 2, w: 1, h: 2 },
            { i: 'tempTrend', x: 0, y: 4, w: 2, h: 4 },
            { i: 'dailySummary', x: 2, y: 4, w: 1, h: 4 },
            { i: 'alerts', x: 3, y: 6, w: 1, h: 2 },
            { i: 'threshold', x: 1, y: 8, w: 3, h: 2 }
        ],
        md: [
            { i: 'currentTemp', x: 0, y: 0, w: 1, h: 2 },
            { i: 'feelsLike', x: 1, y: 0, w: 1, h: 2 },
            { i: 'weatherCondition', x: 0, y: 2, w: 2, h: 2 },
            { i: 'humidity', x: 0, y: 4, w: 1, h: 2 },
            { i: 'windSpeed', x: 1, y: 4, w: 1, h: 2 },
            { i: 'tempTrend', x: 0, y: 6, w: 2, h: 4 },
            { i: 'dailySummary', x: 0, y: 10, w: 2, h: 4 },
            { i: 'alerts', x: 0, y: 14, w: 1, h: 2 },
            { i: 'threshold', x: 1, y: 14, w: 1, h: 2 }
        ],
        sm: [
            { i: 'currentTemp', x: 0, y: 0, w: 1, h: 2 },
            { i: 'feelsLike', x: 1, y: 0, w: 1, h: 2 },
            { i: 'weatherCondition', x: 0, y: 2, w: 2, h: 2 },
            { i: 'humidity', x: 0, y: 4, w: 1, h: 2 },
            { i: 'windSpeed', x: 1, y: 4, w: 1, h: 2 },
            { i: 'tempTrend', x: 0, y: 6, w: 2, h: 4 },
            { i: 'dailySummary', x: 0, y: 10, w: 2, h: 4 },
            { i: 'alerts', x: 0, y: 14, w: 2, h: 2 },
            { i: 'threshold', x: 1, y: 14, w: 2, h: 2 }
        ],
        xs: [
            { i: 'currentTemp', x: 0, y: 0, w: 1, h: 2 },
            { i: 'feelsLike', x: 0, y: 2, w: 1, h: 2 },
            { i: 'weatherCondition', x: 0, y: 4, w: 1, h: 2 },
            { i: 'humidity', x: 0, y: 6, w: 1, h: 2 },
            { i: 'windSpeed', x: 0, y: 8, w: 1, h: 2 },
            { i: 'tempTrend', x: 0, y: 10, w: 1, h: 4 },
            { i: 'dailySummary', x: 0, y: 14, w: 1, h: 4 },
            { i: 'alerts', x: 0, y: 18, w: 1, h: 2 },
            { i: 'threshold', x: 0, y: 20, w: 1, h: 2 }
        ]
    };


    return (
        <div className={`min-h-screen p-4 ${theme === 'light' ? 'bg-white' : 'bg-black'} transition-colors`}>
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className={`text-3xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Weather Monitoring System</h1>
                    <div className="flex space-x-4">
                        <select
                            className={`border-2 p-2 rounded-md ${theme === 'light' ? 'border-gray-300' : 'border-gray-700 bg-gray-800 text-white'}`}
                            value={selectedCity}
                            onChange={(e) => setSelectedCity(e.target.value)}
                        >
                            {cities.map(city => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                        <button
                            className={`border-2 p-2 rounded-md ${theme === 'light' ? 'border-gray-300' : 'border-gray-700 bg-gray-800 text-white'}`}
                            onClick={() => setIsFahrenheit(!isFahrenheit)}
                        >
                            {isFahrenheit ? 'Switch to °C' : 'Switch to °F'}
                        </button>
                        <button
                            className={`border-2 p-2 rounded-md ${theme === 'light' ? 'border-gray-300' : 'border-gray-700 bg-gray-800 text-white'}`}
                            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                        >
                            {theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                        </button>
                    </div>
                </div>
                <ResponsiveGridLayout
                    className="layout"
                    layouts={layout}
                    breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480 }}
                    cols={{ lg: 3, md: 2, sm: 2, xs: 1 }}
                    rowHeight={100}
                    width={1200}
                    margin={[20, 20]}
                    isResizable={false}
                    draggableCancel=".non-draggable"
                >
                    <Card key="currentTemp" className="dashboard-card glassmorphism">
                        <CardHeader>
                            <CardTitle>Current Temperature</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold">
                                <CountUp end={displayTemp} duration={2} decimals={1} />°{isFahrenheit ? 'F' : 'C'}
                            </div>
                        </CardContent>
                    </Card>

                    <Card key="feelsLike" className="dashboard-card glassmorphism">
                        <CardHeader>
                            <CardTitle>Feels Like</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold">
                                <CountUp end={displayFeelsLike} duration={2} decimals={1} />°{isFahrenheit ? 'F' : 'C'}
                            </div>
                        </CardContent>
                    </Card>

                    <Card key="weatherCondition" className="dashboard-card glassmorphism">
                        <CardHeader>
                            <CardTitle>Weather Condition</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex ">
                                {currentWeather?.icon && (
                                    <div className="bg-white rounded-full p-2 shadow-lg">
                                        <img
                                            src={getWeatherIconUrl(currentWeather.icon)}
                                            alt={currentWeather.main}
                                            className="w-26 h-26"
                                        />
                                    </div>
                                )}
                                <span className="text-3xl items-center font-bold">{currentWeather?.main}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card key="humidity" className="dashboard-card glassmorphism overflow-hidden">
                        <CardHeader>
                            <CardTitle>Humidity</CardTitle>
                        </CardHeader>
                        <CardContent className="pb-0">
                            <div className="flex flex-col items-center">
                                <div className="text-4xl font-bold mb-2">
                                    <CountUp end={currentWeather?.humidity || 0} duration={2} />%
                                </div>
                                <AnimatedDroplet humidity={currentWeather?.humidity || 0} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card key="windSpeed" className="dashboard-card glassmorphism">
                        <CardHeader>
                            <CardTitle>Wind Speed & Direction</CardTitle>
                        </CardHeader>
                        <CardContent className="flex">
                            <div className="text-4xl font-bold mb-4">
                                <CountUp end={windSpeed} duration={2} decimals={1} /> m/s
                            </div>
                            {windDirection && (
                                <div className="relative compass-container mb-4">
                                    <span className="absolute top-2 left-1/2 transform -translate-x-1/2 text-sm ">N</span>
                                    <span className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-sm ">S</span>
                                    <span className="absolute top-1/2 right-2 transform -translate-y-1/2 text-sm ">E</span>
                                    <span className="absolute top-1/2 left-2 transform -translate-y-1/2 text-sm ">W</span>
                                    <div
                                        className="compass-icon"
                                        style={{
                                            transform: `rotate(${windDirection}deg)`,
                                            fontSize: '2.5rem',
                                            transition: 'transform 0.5s ease',
                                        }}
                                    >
                                        ➤
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card key="tempTrend" className="dashboard-card glassmorphism">
                        <CardHeader>
                            <CardTitle>Temperature Trend (24 Hours)</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={processedWeatherHistory}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="dt" tickFormatter={(dt) => new Date(dt).toLocaleTimeString()} />
                                    <YAxis tickFormatter={(value) => value.toFixed(1)} />
                                    <Tooltip
                                        labelFormatter={(dt) => new Date(dt).toLocaleString()}
                                        formatter={(value) => [value.toFixed(2), `Temperature °${isFahrenheit ? 'F' : 'C'}`]}
                                        contentStyle={{ backgroundColor: 'var(--card-bg-color)' }}
                                    />
                                    <Legend />
                                    <Area type="monotone" dataKey="temp" stroke="#8884d8" fill="#8884d8" name={`Temperature °${isFahrenheit ? 'F' : 'C'}`} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card key="dailySummary" className="dashboard-card glassmorphism">
                        <CardHeader>
                            <CardTitle>Daily Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={processedDailySummary}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="date"
                                        tickFormatter={(date) => new Date(date).toLocaleDateString()}
                                    />
                                    <YAxis
                                        tickFormatter={(value) => value.toFixed(1)}
                                    />
                                    <Tooltip
                                        labelFormatter={(date) => new Date(date).toLocaleDateString()}
                                        formatter={(value) => [value.toFixed(2), `Temp °${isFahrenheit ? 'F' : 'C'}`]}
                                        contentStyle={{ backgroundColor: 'var(--card-bg-color)' }}
                                    />
                                    <Legend />
                                    <Area
                                        type="monotone"
                                        dataKey="maxTemp"
                                        stroke="#ff7300"
                                        fill="#ff7300"
                                        fillOpacity={0.3}
                                        name={`Max Temp °${isFahrenheit ? 'F' : 'C'}`}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="avgTemp"
                                        stroke="#8884d8"
                                        fill="#8884d8"
                                        fillOpacity={0.3}
                                        name={`Avg Temp °${isFahrenheit ? 'F' : 'C'}`}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="minTemp"
                                        stroke="#82ca9d"
                                        fill="#82ca9d"
                                        fillOpacity={0.3}
                                        name={`Min Temp °${isFahrenheit ? 'F' : 'C'}`}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card key="alerts" className="dashboard-card glassmorphism">
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <AlertTriangle className="h-6 w-6 text-red-500 mr-2" />
                                Weather Alerts
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="max-h-[120px] overflow-y-auto space-y-2 p-2"> 
                            <div className="space-y-2">
                                {alerts.filter(alert => !alert.acknowledged).length === 0 ? (
                                    <p className="text-gray-500 dark:text-gray-400">No active alerts</p>
                                ) : (
                                    alerts.map((alert, index) => (
                                        !alert.acknowledged && (
                                            <Alert key={alert._id} variant="destructive" className="p-2"> 
                                                <AlertDescription>
                                                    {alert.message}
                                                    <span className="block text-sm text-gray-500 dark:text-gray-400">
                                                        {new Date(alert.triggeredAt).toLocaleString()}
                                                    </span>
                                                    <Button
                                                        size="sm"
                                                        className="mt-1 non-draggable"
                                                        variant="success"
                                                        onClick={() => handleAcknowledgeAlert(alert._id)}
                                                    >
                                                        Acknowledge
                                                    </Button>
                                                </AlertDescription>
                                            </Alert>
                                        )
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card key="threshold" className="dashboard-card glassmorphism">
                        <CardHeader>
                            <CardTitle>Alert Thresholds</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4 mb-4">
                                {thresholds.map(threshold => (
                                    <Alert key={threshold._id} variant="default">
                                        <AlertTitle>{threshold.city} : {threshold.comparison} {threshold.temp}°{isFahrenheit ? 'F' : 'C'}</AlertTitle>
                                        <Button size="sm" variant="destructive" onClick={() => handleDeleteThreshold(threshold._id)}>Delete</Button>
                                    </Alert>
                                ))}
                            </div>
                            <div className="flex gap-2 items-center">
                                <div className="non-draggable">
                                    <span className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Current temperature</span>
                                </div>
                                <div className="non-draggable">
                                    <select
                                        name="comparison"
                                        value={newThreshold.comparison}
                                        onChange={(e) => setNewThreshold((prevThreshold) => ({
                                            ...prevThreshold,
                                            comparison: e.target.value,
                                        }))}
                                        className={`threshold-select ${theme === 'dark' ? 'dark-mode' : 'light-mode'}`}
                                    >
                                        <option value=">">{'>'}</option>
                                        <option value="<">&lt;</option>
                                        <option value=">=">{'>='}</option>
                                        <option value="<=">{'<='}</option>
                                    </select>
                                </div>
                                
                                <div className="non-draggable">
                                    <input
                                        type="number"
                                        name="value"
                                        placeholder="Temperature"
                                        value={newThreshold.value}
                                        onChange={(e) => setNewThreshold((prevThreshold) => ({
                                            ...prevThreshold,
                                            value: e.target.value,
                                        }))}
                                        className={`threshold-input ${theme === 'dark' ? 'dark-mode' : 'light-mode'}`}
                                    />
                                </div>
                                <div className="non-draggable">
                                    <span className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-black'}`}>For</span>
                                </div>
                                <div className="non-draggable">
                                    <input
                                        type="number"
                                        name="duration"
                                        placeholder="Duration"
                                        value={newThreshold.duration}
                                        onChange={(e) => setNewThreshold((prevThreshold) => ({
                                            ...prevThreshold,
                                            duration: e.target.value,
                                        }))}
                                        className={`threshold-input ${theme === 'dark' ? 'dark-mode' : 'light-mode'}`}
                                    />
                                </div>
                                <div className="non-draggable">
                                    <span className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-black'}`}>minutes</span>
                                </div>
                                <div className="non-draggable">
                                    <Button
                                        onClick={handleCreateThreshold}
                                        className="threshold-button"
                                        variant="default"
                                    >
                                        Add Threshold
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </ResponsiveGridLayout>
            </div>
        </div>
    );
};

export default WeatherDashboard;