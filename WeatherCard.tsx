import { FC } from 'react';
import { WeatherData } from '../types/types';

interface WeatherCardProps {
  weather: WeatherData;
}

const WeatherCard: FC<WeatherCardProps> = ({ weather }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Outside Weather</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-gray-600">Temperature</p>
          <p className="text-2xl font-bold">{weather.outside_temp}°C</p>
        </div>
        <div>
          <p className="text-gray-600">Humidity</p>
          <p className="text-2xl font-bold">{weather.humidity}%</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
