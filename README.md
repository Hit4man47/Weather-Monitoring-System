# Weather-Monitoring-System
Weather Monitoring System tracks weather in major Indian metros using OpenWeatherMap API. It features live data collection, alerts for threshold breaches, and daily analytics. Built with React, Node.js, and MongoDB, it displays current conditions and trends via an interactive dashboard. Includes email alerts and supports both Celsius/Fahrenheit.



# Real-Time Weather Monitoring System

## Overview

This project is a **Real-Time Data Processing System for Weather Monitoring** designed to collect weather data, perform real-time analysis, and provide insights using rollups and aggregates. The application leverages data from the OpenWeatherMap API to monitor weather conditions across key Indian metropolitan cities and generate summarized insights.

## Features

1. **Real-Time Data Collection**:
   - Continuous retrieval of weather data for Indian metros: Delhi, Mumbai, Chennai, Bangalore, Kolkata, and Hyderabad.
   - Fetches current temperature, perceived temperature, humidity, wind speed, and main weather conditions at configurable intervals (default: 5 minutes).

2. **Data Processing & Aggregation**:
   - Converts temperature values from Kelvin to Celsius (or Fahrenheit based on user preference).
   - Performs daily rollups to calculate:
     - Average Temperature
     - Maximum Temperature
     - Minimum Temperature
     - Dominant Weather Condition (determined by frequency of occurrence).
   - Data is stored in a MongoDB database for further analysis.

3. **Alerting System**:
   - User-configurable thresholds for alerts based on temperature and other weather conditions.
   - Automatic alert generation when conditions exceed thresholds (e.g., temperature above 35°C for two consecutive updates).
   - Alerts can be acknowledged through the interface.

4. **Visualizations**:
   - Real-time dashboard displaying current weather data.
   - Historical temperature trends and daily summaries.
   - Active alerts and threshold management.

## Tech Stack

- **Frontend**: React.js with Recharts for visualization, CSS for styling.
- **Backend**: Node.js, Express.js for REST API.
- **Database**: MongoDB for storing weather data and summaries.
- **Data Source**: OpenWeatherMap API.
- **Alert Notifications**: Nodemailer for email notifications.
- **Environment Management**: dotenv for managing environment variables.

## Project Structure

```
├── client
│   ├── components
│   │   ├── WeatherDashboard.jsx      # Main weather dashboard component
│   │   ├── droplet.jsx               # Animated component for visualizing humidity
│   └── services
│       └── api.js                    # Frontend API service for communicating with the backend
├── server
│   ├── controllers
│   │   ├── weatherController.js      # Controller for weather data operations
│   │   └── alertController.js        # Controller for alert management
│   ├── services
│   │   ├── dataRetrievalService.js   # Service for fetching data from OpenWeatherMap API
│   │   ├── dataProcessingService.js  # Service for calculating daily weather summaries
│   │   └── alertService.js           # Service for managing alert thresholds and notifications
│   ├── models                        # MongoDB schemas for data
│   ├── routes
│   │   └── api.js                    # API routes for weather data and alerts
│   ├── app.js                        # Main server file
│   └── config                        # Configuration files for server setup
```

## Setup Instructions

### Prerequisites

- Node.js (>=14.x)
- MongoDB instance
- OpenWeatherMap API Key (sign up [here](https://openweathermap.org/) to get a free API key)
- Git

### Installation

1. **Clone the repository**:
   
   ```bash
   git clone <repository_url>
   cd <repository_name>
   ```

2. **Install server dependencies**:
   
   ```bash
   cd server
   npm install
   ```

3. **Set up environment variables**:
   
   Create a `.env` file in the `server` directory with the following values:

   ```bash
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/weather-monitoring
   OPENWEATHER_API_KEY=<your_openweather_api_key>
   EMAIL_USER=<your_email>
   EMAIL_PASS=<your_email_password>
   ALERT_EMAIL_RECIPIENT=<alert_recipient_email>
   ```

4. **Start the server**:
   
   ```bash
   npm start
   ```

5. **Install client dependencies**:
   
   ```bash
   cd ../client
   npm install
   ```

6. **Run the client**:
   
   ```bash
   npm run dev
   ```

7. **Access the application**:
   
   Open your browser and navigate to `http://localhost:5173`.

## API Endpoints

### Weather Data
- `GET /api/weather/:city`: Fetch current weather for a city.
- `GET /api/weather/daily-summary/:city`: Fetch daily weather summary for a city.
- `GET /api/weather/history/:city`: Fetch weather history (24-hour) for a city.

### Alerts
- `GET /api/alerts/:city`: Retrieve active alerts for a city.
- `POST /api/alerts/threshold`: Create a new alert threshold.
- `PUT /api/alerts/threshold/:id`: Update an existing threshold.
- `DELETE /api/alerts/threshold/:id`: Delete an alert threshold.
- `PUT /api/alerts/acknowledge/:id`: Acknowledge an alert.

## Design Choices

1. **Real-time Data Collection**:
   - Chose Axios for reliable API calls to OpenWeatherMap.
   - Data is stored in a raw format in MongoDB for historical analysis.

2. **Data Aggregation**:
   - Daily summaries are processed using scheduled intervals.
   - Aggregates are calculated for each day to identify key patterns (e.g., average temperature, dominant weather).

3. **Alerting System**:
   - Alerts are generated based on user-defined thresholds.
   - Email notifications are implemented using Nodemailer, which is easy to configure for SMTP.

4. **Frontend Visualization**:
   - Recharts library is used for intuitive data visualization (e.g., line charts, area charts).
   - The dashboard supports switching between Celsius and Fahrenheit based on user preference.

## Test Cases

1. **System Setup**:
   - Test if the server starts successfully and connects to the MongoDB instance.
   - Validate successful API connection to OpenWeatherMap using a valid API key.

2. **Data Retrieval**:
   - Simulate weather data fetching at configurable intervals.
   - Ensure correct parsing of weather data, especially temperature conversion from Kelvin to Celsius.

3. **Data Processing**:
   - Validate daily weather summary calculations (average, max, min temperatures).
   - Test handling of edge cases (e.g., no data for a specific day).

4. **Alert System**:
   - Configure and verify user thresholds for temperature.
   - Simulate data that triggers alerts and ensure notifications are handled correctly.

## Future Enhancements

- Add support for additional weather parameters (e.g., wind speed, humidity).
- Implement forecast retrieval using OpenWeatherMap’s prediction API.
- Improve visualization for long-term trends (e.g., monthly summaries).
- Extend alert system to support SMS notifications.
- Dockerize the application for easy deployment.

## License

This project is licensed under the MIT License.

## Acknowledgments

- OpenWeatherMap for providing the API service.
- Nodemailer for email alert functionality.
- Recharts for visualization components.
