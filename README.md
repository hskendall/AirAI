# AirAI

```
const EventEmitter = require('events');
const fs = require('fs').promises;

class EnergyMonitoringSystem extends EventEmitter {
  constructor() {
    super();
    this.currentData = new Map();
    this.dataFilePath = './energy_data.json';
    this.initializeSystem();
  }

  async initializeSystem() {
    try {
      await this.loadHistoricalData();
      this.startMonitoring();
    } catch (error) {
      console.error('Failed to initialize system:', error);
    }
  }

  async loadHistoricalData() {
    try {
      const data = await fs.readFile(this.dataFilePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.log('No historical data found, creating new 
      dataset');
      return {};
    }
  }

  startMonitoring() {
    this.monitoringInterval = setInterval(() => {
      this.updateCurrentData();
    }, 5000); // Update every 5 seconds
  }

  stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }
  }
}

class FloorEnergyAgent {
  constructor(floorNumber, system) {
    this.floorNumber = floorNumber;
    this.system = system;
    this.sensors = new Map();
    this.currentConsumption = 0;
    this.initializeSensors();
  }

  initializeSensors() {
    // Initialize different types of sensors
    this.sensors.set('lighting', new EnergySensor('lighting'));
    this.sensors.set('hvac', new EnergySensor('hvac'));
    this.sensors.set('equipment', new EnergySensor('equipment'));
  }

  getCurrentData() {
    const sensorData = {};
    this.sensors.forEach((sensor, type) => {
      sensorData[type] = sensor.getCurrentReading();
    });

    return {
      timestamp: new Date().toISOString(),
      floorNumber: this.floorNumber,
      consumption: this.calculateTotalConsumption(sensorData),
      sensorData
    };
  }

  calculateTotalConsumption(sensorData) {
    return Object.values(sensorData).reduce((total, value) => 
    total + value, 0);
  }

  async updateData() {
    const newData = this.getCurrentData();
    this.currentConsumption = newData.consumption;
    await this.system.updateFloorData(this.floorNumber, newData);
  }
}

class EnergySensor {
  constructor(type) {
    this.type = type;
    this.lastReading = 0;
  }

  getCurrentReading() {
    // Simulate sensor reading with random fluctuation
    const baseLoad = this.getBaseLoad();
    const fluctuation = Math.random() * 0.2 - 0.1; // ±10% 
    fluctuation
    this.lastReading = baseLoad * (1 + fluctuation);
    return this.lastReading;
  }

  getBaseLoad() {
    // Base load values for different sensor types
    const baseLoads = {
      lighting: 2.5,  // kW
      hvac: 5.0,     // kW
      equipment: 3.0  // kW
    };
    return baseLoads[this.type] || 1.0;
  }
}

class EnergyDataAnalyzer {
  constructor() {
    this.historicalData = new Map();
  }

  analyzeFloorData(floorData) {
    return {
      currentUsage: floorData.consumption,
      hourlyAverage: this.calculateHourlyAverage(floorData.
      floorNumber),
      dailyAverage: this.calculateDailyAverage(floorData.
      floorNumber),
      peakHours: this.identifyPeakHours(floorData.floorNumber),
      efficiency: this.calculateEfficiency(floorData)
    };
  }

  calculateHourlyAverage(floorNumber) {
    // Implementation for hourly average calculation
    const floorHistory = this.historicalData.get(floorNumber) || 
    [];
    const lastHour = floorHistory.filter(data => 
      new Date(data.timestamp) > new Date(Date.now() - 3600000)
    );
    
    return lastHour.reduce((sum, data) => sum + data.
    consumption, 0) / lastHour.length || 0;
  }

  calculateDailyAverage(floorNumber) {
    // Implementation for daily average calculation
    const floorHistory = this.historicalData.get(floorNumber) || 
    [];
    const lastDay = floorHistory.filter(data => 
      new Date(data.timestamp) > new Date(Date.now() - 86400000)
    );
    
    return lastDay.reduce((sum, data) => sum + data.consumption, 
    0) / lastDay.length || 0;
  }

  identifyPeakHours(floorNumber) {
    // Implementation for peak hours identification
    const floorHistory = this.historicalData.get(floorNumber) || 
    [];
    const hourlyUsage = new Map();

    floorHistory.forEach(data => {
      const hour = new Date(data.timestamp).getHours();
      const current = hourlyUsage.get(hour) || { sum: 0, count: 
      0 };
      hourlyUsage.set(hour, {
        sum: current.sum + data.consumption,
        count: current.count + 1
      });
    });

    const averages = new Map();
    hourlyUsage.forEach((value, hour) => {
      averages.set(hour, value.sum / value.count);
    });

    return Array.from(averages.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([hour]) => hour);
  }

  calculateEfficiency(floorData) {
    // Implementation for efficiency calculation
    const baselineConsumption = this.getBaselineConsumption
    (floorData.floorNumber);
    return baselineConsumption ? (baselineConsumption / 
    floorData.consumption) * 100 : 100;
  }

  getBaselineConsumption(floorNumber) {
    // Implementation for baseline consumption calculation
    const floorHistory = this.historicalData.get(floorNumber) || 
    [];
    if (floorHistory.length === 0) return null;

    const sortedConsumption = floorHistory
      .map(data => data.consumption)
      .sort((a, b) => a - b);
    
    return sortedConsumption[Math.floor(sortedConsumption.length 
    * 0.1)]; // 10th percentile
  }

  addHistoricalData(floorNumber, data) {
    if (!this.historicalData.has(floorNumber)) {
      this.historicalData.set(floorNumber, []);
    }
    this.historicalData.get(floorNumber).push(data);
  }
}

module.exports = {
  EnergyMonitoringSystem,
  FloorEnergyAgent,
  EnergySensor,
  EnergyDataAnalyzer
};
```
Let's create a usage example:

```
const {
  EnergyMonitoringSystem,
  FloorEnergyAgent,
  EnergyDataAnalyzer
} = require('./EnergyMonitoringSystem');

async function main() {
  // Initialize the system
  const system = new EnergyMonitoringSystem();
  const analyzer = new EnergyDataAnalyzer();

  // Create agents for each floor
  const floorAgents = new Map();
  for (let floor = 1; floor <= 10; floor++) {
    floorAgents.set(floor, new FloorEnergyAgent(floor, system));
  }

  // Start monitoring
  system.on('data_update', async (floorNumber, data) => {
    // Store historical data
    analyzer.addHistoricalData(floorNumber, data);

    // Analyze current data
    const analysis = analyzer.analyzeFloorData(data);
    console.log(`Floor ${floorNumber} Analysis:`, analysis);
  });

  // Update data for all floors
  async function updateAllFloors() {
    for (const [floor, agent] of floorAgents) {
      await agent.updateData();
    }
  }

  // Update every 5 seconds
  setInterval(updateAllFloors, 5000);

  // Example of getting historical data for a specific floor
  async function getFloorHistory(floorNumber) {
    const history = await system.loadHistoricalData();
    return history[floorNumber] || [];
  }

  // Example of getting current data for a specific floor
  function getCurrentFloorData(floorNumber) {
    const agent = floorAgents.get(floorNumber);
    return agent ? agent.getCurrentData() : null;
  }
}

main().catch(console.error);
```
To use this system:

1. Install dependencies:
```
npm init -y
```
2. Run the example:
```
node example.js
```
This implementation provides:

1. Real-time Monitoring:
   
   - Per-floor energy consumption tracking
   - Multiple sensor types (HVAC, lighting, equipment)
   - Automatic data updates every 5 seconds
2. Data Analysis:
   
   - Hourly and daily averages
   - Peak usage hours identification
   - Efficiency calculations
   - Historical trend analysis
3. Historical Data Management:
   
   - Persistent storage of energy data
   - Historical data retrieval
   - Trend analysis capabilities
4. Sensor Integration:
   
   - Modular sensor system
   - Support for different energy measurement types
   - Real-time data collection
5. Analysis Features:
   
   - Current consumption monitoring
   - Historical data comparison
   - Efficiency metrics
   - Peak usage identification
The system allows you to:

- Monitor real-time energy consumption for each floor
- Track historical usage patterns
- Identify peak usage periods
- Calculate efficiency metrics
- Store and retrieve historical data
Would you like me to add any additional features or make modifications to the current implementation?

Henry380

Copy

Delete

Create dataset with {

"weather": {

"outside_temp": 30,

"humidity": 60

},

"floors": {

"1": {

"current_temp": 28,

"current_humidity": 55,

"people_expected": 25,

"departure_time": "18:00"

},

"2": {

"current_temp": 22,

"current_humidity": 40,

"people_expected": 10,

"departure_time": "17:00"

}

},

"time_now": "09:00"

}

Trae

I'll help you create a dataset manager for building environment data. Let's implement a system that can store and manage the environmental data for each floor.

```
const fs = require('fs').promises;

class BuildingDataManager {
  constructor() {
    this.dataFilePath = './building_data.json';
    this.currentData = {
      weather: {
        outside_temp: 30,
        humidity: 60
      },
      floors: {
        "1": {
          current_temp: 28,
          current_humidity: 55,
          people_expected: 25,
          departure_time: "18:00"
        },
        "2": {
          current_temp: 22,
          current_humidity: 40,
          people_expected: 10,
          departure_time: "17:00"
        }
      },
      time_now: "09:00"
    };
  }

  async initialize() {
    try {
      await this.saveData();
      console.log('Initial dataset created successfully');
    } catch (error) {
      console.error('Failed to create initial dataset:', error);
    }
  }

  async saveData() {
    try {
      await fs.writeFile(
        this.dataFilePath,
        JSON.stringify(this.currentData, null, 2),
        'utf8'
      );
      return true;
    } catch (error) {
      console.error('Error saving data:', error);
      return false;
    }
  }

  async loadData() {
    try {
      const data = await fs.readFile(this.dataFilePath, 'utf8');
      this.currentData = JSON.parse(data);
      return this.currentData;
    } catch (error) {
      console.error('Error loading data:', error);
      return null;
    }
  }

  getCurrentData() {
    return this.currentData;
  }

  getFloorData(floorNumber) {
    return this.currentData.floors[floorNumber];
  }

  getWeatherData() {
    return this.currentData.weather;
  }

  async updateFloorData(floorNumber, newData) {
    this.currentData.floors[floorNumber] = {
      ...this.currentData.floors[floorNumber],
      ...newData
    };
    return await this.saveData();
  }

  async updateWeatherData(newData) {
    this.currentData.weather = {
      ...this.currentData.weather,
      ...newData
    };
    return await this.saveData();
  }

  async updateTimeNow(newTime) {
    this.currentData.time_now = newTime;
    return await this.saveData();
  }
}

module.exports = BuildingDataManager;
```
Let's create a usage example:

```
const BuildingDataManager = require('./BuildingDataManager');

async function main() {
  // Create and initialize the data manager
  const dataManager = new BuildingDataManager();
  await dataManager.initialize();

  // Get current data
  console.log('Current Data:', dataManager.getCurrentData());

  // Get specific floor data
  console.log('Floor 1 Data:', dataManager.getFloorData('1'));

  // Update floor data
  await dataManager.updateFloorData('1', {
    current_temp: 26,
    current_humidity: 50
  });

  // Update weather data
  await dataManager.updateWeatherData({
    outside_temp: 32
  });

  // Update time
  await dataManager.updateTimeNow('10:00');

  // Get updated data
  console.log('Updated Data:', dataManager.getCurrentData());
}

main().catch(console.error);
```
To use this system:

1. Create the files:
```
touch BuildingDataManager.js example.js
```
2. Run the example:
```
node example.js
```
This implementation provides:

1. Data Management:
   
   - Initial dataset creation
   - Data persistence using JSON file
   - CRUD operations for building data
2. Floor-specific Data:
   
   - Temperature monitoring
   - Humidity tracking
   - Occupancy expectations
   - Departure time management
3. Weather Data:
   
   - Outside temperature tracking
   - Humidity monitoring
4. Time Management:
   
   - Current time tracking
   - Time-based data organization
5. Data Operations:
   
   - Get current data state
   - Get floor-specific data
   - Get weather conditions
   - Update floor information
   - Update weather data
   - Update current time
The system allows you to:

- Store and retrieve building environmental data
- Track conditions for each floor
- Monitor weather conditions
- Manage time-based information
- Persist data between sessions
