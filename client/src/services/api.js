const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const handleResponse = async (response) => {
  
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    throw new Error('Server returned non-JSON response');
  }

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

const createApiRequest = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    return handleResponse(response);
  } catch (error) {
    console.error(`API Request Failed: ${endpoint}`, error);
    throw new Error(
      error.message === 'Server returned non-JSON response'
        ? 'Unable to connect to server. Please check if the backend is running.'
        : error.message
    );
  }
};

export const fetchWeatherData = (city) => 
  createApiRequest(`/weather/${city}`);

export const fetchDailySummary = (city) => 
  createApiRequest(`/weather/daily-summary/${city}`);

export const fetchWeatherHistory = (city) => 
  createApiRequest(`/weather/history/${city}`);

export const fetchAlerts = (city) => 
  createApiRequest(`/alerts/${city}`);

export const createThreshold = (threshold) => 
  createApiRequest('/alerts/threshold', {
    method: 'POST',
    body: JSON.stringify(threshold),
  });

export const updateThreshold = (id, threshold) => 
  createApiRequest(`/alerts/threshold/${id}`, {
    method: 'PUT',
    body: JSON.stringify(threshold),
});

export const deleteThreshold = (id) => 
  createApiRequest(`/alerts/threshold/${id}`, {
    method: 'DELETE',
});

export const acknowledgeAlert = (alertId) => 
  createApiRequest(`/alerts/acknowledge/${alertId}`, {
      method: 'PUT',
  });
