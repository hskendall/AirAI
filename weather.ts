import type { NextApiRequest, NextApiResponse } from 'next';
import { WeatherService, WeatherResponse } from '../../services/weatherService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<WeatherResponse | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { city } = req.query;

  if (!city || typeof city !== 'string') {
    return res.status(400).json({ error: 'City parameter is required' });
  }

  try {
    const weatherService = new WeatherService();
    const weatherData = await weatherService.getCurrentWeather(city);
    res.status(200).json(weatherData);
  } catch (error) {
    console.error('Weather API error:', error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
}
