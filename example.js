const {
  EnergyMonitoringSystem,
  FloorEnergyAgent,
  EnergyDataAnalyzer
} = require('./EnergyMonitoringSystem');

async function main() {
  // Initialize the system
  const system = new EnergyMonitoringSystem();
  const analyzer = new EnergyDataAnalyzer();

  // Create agents for each floor
  const floorAgents = new Map();
  for (let floor = 1; floor <= 10; floor++) {
    floorAgents.set(floor, new FloorEnergyAgent(floor, system));
  }

  // Start monitoring
  system.on('data_update', async (floorNumber, data) => {
    // Store historical data
    analyzer.addHistoricalData(floorNumber, data);

    // Analyze current data
    const analysis = analyzer.analyzeFloorData(data);
    console.log(`Floor ${floorNumber} Analysis:`, analysis);
  });

  // Update data for all floors
  async function updateAllFloors() {
    for (const [floor, agent] of floorAgents) {
      await agent.updateData();
    }
  }

  // Update every 5 seconds
  setInterval(updateAllFloors, 5000);

  // Example of getting historical data for a specific floor
  async function getFloorHistory(floorNumber) {
    const history = await system.loadHistoricalData();
    return history[floorNumber] || [];
  }

  // Example of getting current data for a specific floor
  function getCurrentFloorData(floorNumber) {
    const agent = floorAgents.get(floorNumber);
    return agent ? agent.getCurrentData() : null;
  }
}

main().catch(console.error);
