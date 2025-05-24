import type { NextApiRequest, NextApiResponse } from 'next';
import { BuildingData } from '../../types/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BuildingData>
) {
  // This is where you'll integrate with your backend data service
  const data: BuildingData = {
    weather: {
      outside_temp: 30,
      humidity: 60
    },
    floors: {
      "1": {
        current_temp: 28,
        current_humidity: 55,
        people_expected: 25,
        departure_time: "18:00"
      },
      "2": {
        current_temp: 22,
        current_humidity: 40,
        people_expected: 10,
        departure_time: "17:00"
      }
    },
    time_now: "09:00"
  };

  res.status(200).json(data);
}
