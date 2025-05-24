import { FC } from 'react';
import { FloorData } from '../types/types';

interface FloorCardProps {
  floorNumber: string;
  data: FloorData;
}

const FloorCard: FC<FloorCardProps> = ({ floorNumber, data }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Floor {floorNumber}</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Temperature</p>
            <p className="text-2xl font-bold">{data.current_temp}°C</p>
          </div>
          <div>
            <p className="text-gray-600">Humidity</p>
            <p className="text-2xl font-bold">{data.current_humidity}%</p>
          </div>
        </div>
        <div>
          <p className="text-gray-600">Expected Occupancy</p>
          <p className="text-xl font-bold">{data.people_expected} people</p>
        </div>
        <div>
          <p className="text-gray-600">Departure Time</p>
          <p className="text-xl font-bold">{data.departure_time}</p>
        </div>
      </div>
    </div>
  );
};

export default FloorCard;
