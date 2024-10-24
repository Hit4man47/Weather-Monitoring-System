import { useState, useEffect } from 'react';
import { fetchWeatherData, fetchDailySummary, fetchAlerts } from '../services/api';

export const useWeatherData = (city) => {
    const [currentWeather, setCurrentWeather] = useState(null);
    const [dailySummary, setDailySummary] = useState([]);
    const [weatherHistory, setWeatherHistory] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [weather, summary, historyData, alertsData] = await Promise.all([
                    fetchWeatherData(city),
                    fetchDailySummary(city),
                    fetch(`/api/weather/history/${city}`).then(res => res.json()),
                    fetchAlerts(city)
                ]);

                setCurrentWeather(weather);
                setDailySummary(summary);
                setWeatherHistory(historyData);
                setAlerts(alertsData);
                setError(null);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 300000);

        return () => clearInterval(interval);
    }, [city]);

    return { currentWeather, dailySummary, weatherHistory, alerts, loading, error };
};