import React, { useState } from "react";

const Weather = () => {
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedCity, setSelectedCity] = useState("");

    const accessKey = "320edca19d6721874a5bdcc20502be20"; // Weatherstack API Key

    // Kerala cities
    const keralaCities = [
        "Thiruvananthapuram",
        "Kochi",
        "Kozhikode",
        "Thrissur",
        "Alappuzha",
        "Palakkad",
        "Kannur",
        "Ernakulam",
        "Idukki",
        "Kasaragod",
        "Kottayam",
        "Malappuram",
        "Pathanamthitta",
        "Kollam",
    ];

    const getWeather = async (city) => {
        setLoading(true);
        setSelectedCity(city);
        setWeatherData(null);

        try {
            const response = await fetch(
                `http://api.weatherstack.com/current?access_key=${accessKey}&query=${encodeURIComponent(
                    city
                )}`
            );

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();

            if (data.success === false) {
                alert("Error: " + data.error.info);
                return;
            }

            setWeatherData(data);
        } catch (error) {
            console.error("Failed to fetch weather data:", error);
            alert("Could not fetch weather data.");
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-start bg-gray-100 p-8">
            <h1 className="text-4xl font-extrabold text-gray-800 mb-8 tracking-wide">
                🌦 Kerala Weather
            </h1>

            {/* City Selector */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
                {keralaCities.map((city) => (
                    <button
                        key={city}
                        onClick={() => getWeather(city)}
                        className={`px-5 py-2 rounded-full font-semibold transition-all shadow-sm ${selectedCity === city
                                ? "bg-blue-600 text-white"
                                : "bg-white text-gray-700 border border-gray-300 hover:bg-blue-100"
                            }`}
                        disabled={loading}
                    >
                        {city}
                    </button>
                ))}
            </div>

            {/* Weather Card */}
            {weatherData && (
                <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-b from-yellow-400 to-yellow-200 p-6 text-center">
                        <h2 className="text-5xl font-bold text-white drop-shadow-lg">
                            {weatherData.current.temperature}°C
                        </h2>
                        <p className="text-xl text-white mt-2 font-medium">
                            {weatherData.current.weather_descriptions.join(", ")}
                        </p>
                        <p className="text-sm text-white opacity-90 mt-1">
                            {weatherData.location.name}, {weatherData.location.country}
                        </p>
                    </div>

                    {/* Body */}
                    <div className="p-6 grid grid-cols-2 gap-4 text-center">
                        <div className="flex flex-col items-center bg-gray-50 rounded-2xl py-4">
                            <span className="text-2xl">💨</span>
                            <p className="text-xs text-gray-500 mt-1">Wind</p>
                            <p className="text-lg font-semibold text-gray-800">
                                {weatherData.current.wind_speed} km/h
                            </p>
                        </div>

                        <div className="flex flex-col items-center bg-gray-50 rounded-2xl py-4">
                            <span className="text-2xl">💧</span>
                            <p className="text-xs text-gray-500 mt-1">Humidity</p>
                            <p className="text-lg font-semibold text-gray-800">
                                {weatherData.current.humidity}%
                            </p>
                        </div>

                        <div className="flex flex-col items-center bg-gray-50 rounded-2xl py-4">
                            <span className="text-2xl">🌍</span>
                            <p className="text-xs text-gray-500 mt-1">Region</p>
                            <p className="text-sm font-medium text-gray-700">
                                {weatherData.location.region}
                            </p>
                        </div>

                        <div className="flex flex-col items-center bg-gray-50 rounded-2xl py-4">
                            <span className="text-2xl">🕒</span>
                            <p className="text-xs text-gray-500 mt-1">Timezone</p>
                            <p className="text-sm font-medium text-gray-700">
                                {weatherData.location.timezone_id}
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-100 text-xs text-gray-500 py-3 text-center">
                        Lat: {weatherData.location.lat}, Lon: {weatherData.location.lon}
                    </div>
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="mt-6 text-blue-700 font-semibold animate-pulse">
                    Fetching weather data...
                </div>
            )}
        </div>
    );
};

export default Weather;
