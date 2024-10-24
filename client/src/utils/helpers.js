export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

export const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const kelvinToCelsius = (kelvin) => {
    return (kelvin - 273.15).toFixed(1);
};

export const getWeatherIcon = (condition) => {
    switch (condition?.toLowerCase()) {
        case 'clear':
            return 'Sun';
        case 'clouds':
            return 'Cloud';
        case 'rain':
            return 'Droplet';
        default:
            return 'Wind';
    }
};