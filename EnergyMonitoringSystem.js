const EventEmitter = require('events');
const fs = require('fs').promises;

class EnergyMonitoringSystem extends EventEmitter {
  constructor() {
    super();
    this.currentData = new Map();
    this.dataFilePath = './energy_data.json';
    this.initializeSystem();
  }

  async initializeSystem() {
    try {
      await this.loadHistoricalData();
      this.startMonitoring();
    } catch (error) {
      console.error('Failed to initialize system:', error);
    }
  }

  async loadHistoricalData() {
    try {
      const data = await fs.readFile(this.dataFilePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.log('No historical data found, creating new dataset');
      return {};
    }
  }

  startMonitoring() {
    this.monitoringInterval = setInterval(() => {
      this.updateCurrentData();
    }, 5000); // Update every 5 seconds
  }

  stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }
  }
}

class FloorEnergyAgent {
  constructor(floorNumber, system) {
    this.floorNumber = floorNumber;
    this.system = system;
    this.sensors = new Map();
    this.currentConsumption = 0;
    this.initializeSensors();
  }

  initializeSensors() {
    // Initialize different types of sensors
    this.sensors.set('lighting', new EnergySensor('lighting'));
    this.sensors.set('hvac', new EnergySensor('hvac'));
    this.sensors.set('equipment', new EnergySensor('equipment'));
  }

  getCurrentData() {
    const sensorData = {};
    this.sensors.forEach((sensor, type) => {
      sensorData[type] = sensor.getCurrentReading();
    });

    return {
      timestamp: new Date().toISOString(),
      floorNumber: this.floorNumber,
      consumption: this.calculateTotalConsumption(sensorData),
      sensorData
    };
  }

  calculateTotalConsumption(sensorData) {
    return Object.values(sensorData).reduce((total, value) => total + value, 0);
  }

  async updateData() {
    const newData = this.getCurrentData();
    this.currentConsumption = newData.consumption;
    await this.system.updateFloorData(this.floorNumber, newData);
  }
}

class EnergySensor {
  constructor(type) {
    this.type = type;
    this.lastReading = 0;
  }

  getCurrentReading() {
    // Simulate sensor reading with random fluctuation
    const baseLoad = this.getBaseLoad();
    const fluctuation = Math.random() * 0.2 - 0.1; // ±10% fluctuation
    this.lastReading = baseLoad * (1 + fluctuation);
    return this.lastReading;
  }

  getBaseLoad() {
    // Base load values for different sensor types
    const baseLoads = {
      lighting: 2.5,  // kW
      hvac: 5.0,     // kW
      equipment: 3.0  // kW
    };
    return baseLoads[this.type] || 1.0;
  }
}

class EnergyDataAnalyzer {
  constructor() {
    this.historicalData = new Map();
  }

  analyzeFloorData(floorData) {
    return {
      currentUsage: floorData.consumption,
      hourlyAverage: this.calculateHourlyAverage(floorData.floorNumber),
      dailyAverage: this.calculateDailyAverage(floorData.floorNumber),
      peakHours: this.identifyPeakHours(floorData.floorNumber),
      efficiency: this.calculateEfficiency(floorData)
    };
  }

  calculateHourlyAverage(floorNumber) {
    // Implementation for hourly average calculation
    const floorHistory = this.historicalData.get(floorNumber) || [];
    const lastHour = floorHistory.filter(data => 
      new Date(data.timestamp) > new Date(Date.now() - 3600000)
    );
    
    return lastHour.reduce((sum, data) => sum + data.consumption, 0) / lastHour.length || 0;
  }

  calculateDailyAverage(floorNumber) {
    // Implementation for daily average calculation
    const floorHistory = this.historicalData.get(floorNumber) || [];
    const lastDay = floorHistory.filter(data => 
      new Date(data.timestamp) > new Date(Date.now() - 86400000)
    );
    
    return lastDay.reduce((sum, data) => sum + data.consumption, 0) / lastDay.length || 0;
  }

  identifyPeakHours(floorNumber) {
    // Implementation for peak hours identification
    const floorHistory = this.historicalData.get(floorNumber) || [];
    const hourlyUsage = new Map();

    floorHistory.forEach(data => {
      const hour = new Date(data.timestamp).getHours();
      const current = hourlyUsage.get(hour) || { sum: 0, count: 0 };
      hourlyUsage.set(hour, {
        sum: current.sum + data.consumption,
        count: current.count + 1
      });
    });

    const averages = new Map();
    hourlyUsage.forEach((value, hour) => {
      averages.set(hour, value.sum / value.count);
    });

    return Array.from(averages.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([hour]) => hour);
  }

  calculateEfficiency(floorData) {
    // Implementation for efficiency calculation
    const baselineConsumption = this.getBaselineConsumption(floorData.floorNumber);
    return baselineConsumption ? (baselineConsumption / floorData.consumption) * 100 : 100;
  }

  getBaselineConsumption(floorNumber) {
    // Implementation for baseline consumption calculation
    const floorHistory = this.historicalData.get(floorNumber) || [];
    if (floorHistory.length === 0) return null;

    const sortedConsumption = floorHistory
      .map(data => data.consumption)
      .sort((a, b) => a - b);
    
    return sortedConsumption[Math.floor(sortedConsumption.length * 0.1)]; // 10th percentile
  }

  addHistoricalData(floorNumber, data) {
    if (!this.historicalData.has(floorNumber)) {
      this.historicalData.set(floorNumber, []);
    }
    this.historicalData.get(floorNumber).push(data);
  }
}

module.exports = {
  EnergyMonitoringSystem,
  FloorEnergyAgent,
  EnergySensor,
  EnergyDataAnalyzer
};
