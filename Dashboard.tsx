import { FC } from 'react';
import { BuildingData } from '../types/types';
import WeatherCard from './WeatherCard';
import FloorCard from './FloorCard';
import TimeDisplay from './TimeDisplay';

interface DashboardProps {
  data: BuildingData;
}

const Dashboard: FC<DashboardProps> = ({ data }) => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Building Energy Dashboard</h1>
        <TimeDisplay time={data.time_now} />
      </div>
      
      <WeatherCard weather={data.weather} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(data.floors).map(([floorNumber, floorData]) => (
          <FloorCard
            key={floorNumber}
            floorNumber={floorNumber}
            data={floorData}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
