import React, { useState, useEffect } from 'react';
import { CloudRain, Sun, Wind, Droplets, AlertTriangle, Loader2 } from 'lucide-react';
import { api } from '../services/api';

const WeatherIntelligence: React.FC = () => {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/ai/weather-intelligence')
      .then(res => {
        setWeatherData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("AI Weather Error", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-10 text-primary-green animate-pulse">
        <Loader2 size={40} className="animate-spin mb-4" />
        <h3 className="font-bold">Gemini AI is analyzing the weather patterns...</h3>
      </div>
    );
  }

  if (!weatherData || weatherData.error) {
    return <p className="p-4 text-center text-red-500">Failed to load AI Weather Intelligence.</p>;
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-secondary-green">Weather Intelligence</h2>

      {/* Primary Alert */}
      {weatherData.primary_alert && (
        <div className="bg-accent-yellow/20 border-l-4 border-accent-yellow p-4 rounded-xl flex gap-3">
          <AlertTriangle className="text-accent-yellow shrink-0 mt-1" size={24} />
          <div>
            <h3 className="font-bold text-gray-800">{weatherData.primary_alert.title}</h3>
            <p className="text-sm text-gray-700">{weatherData.primary_alert.description}</p>
          </div>
        </div>
      )}

      {/* Recommended Action */}
      {weatherData.irrigation_recommendation && (
        <div className="bg-primary-green/10 p-4 rounded-xl shadow-sm border border-primary-green/20">
          <div className="flex items-center gap-2 mb-2">
            <Droplets className="text-primary-green" size={20} />
            <h3 className="font-bold text-primary-green">{weatherData.irrigation_recommendation.title}</h3>
          </div>
          <p className="text-sm text-gray-700 mb-2">{weatherData.irrigation_recommendation.description}</p>
        </div>
      )}

      {/* 7 Day Forecast */}
      <div>
        <h3 className="font-bold text-gray-800 mb-3">7-Day Forecast</h3>
        <div className="flex gap-3 overflow-x-auto pb-4 snap-x">
          {weatherData.forecast && weatherData.forecast.map((dayObj: any, index: number) => (
            <div key={index} className="snap-center shrink-0 w-24 bg-white rounded-xl p-3 shadow-md border border-gray-100 flex flex-col items-center">
              <span className="text-sm font-bold text-gray-500 mb-2">{dayObj.day}</span>
              {dayObj.condition?.toLowerCase().includes('rain') ? (
                <CloudRain className="text-accent-yellow mb-2" size={28} />
              ) : (
                <Sun className="text-accent-yellow mb-2" size={28} />
              )}
              <span className="font-bold text-xl text-gray-800">{dayObj.temp}°</span>
              {dayObj.wind?.toLowerCase().includes('high') && <div className="text-[0.6rem] text-primary-green flex items-center mt-1"><Wind size={10} className="mr-1" /> High Wind</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherIntelligence;
