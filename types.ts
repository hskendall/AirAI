export interface WeatherData {
  outside_temp: number;
  humidity: number;
}

export interface FloorData {
  current_temp: number;
  current_humidity: number;
  people_expected: number;
  departure_time: string;
}

export interface BuildingData {
  weather: WeatherData;
  floors: {
    [key: string]: FloorData;
  };
  time_now: string;
}
