import { useEffect, useState } from 'react';
import { BuildingData } from '../types/types';
import Dashboard from '../components/Dashboard';

export default function Home() {
  const [buildingData, setBuildingData] = useState<BuildingData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/building-data');
        const data = await response.json();
        setBuildingData(data);
      } catch (error) {
        console.error('Error fetching building data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  if (!buildingData) {
    return <div>Loading...</div>;
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <Dashboard data={buildingData} />
    </main>
  );
}
