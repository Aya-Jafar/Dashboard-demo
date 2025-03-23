import { useDashboardStore } from "../stores/dashboard";
class MockWebSocket {
  private url: string;
  private listeners: Array<(message: any) => void>;

  constructor(url: string) {
    this.url = url;
    this.listeners = [];
  }

  connect(): void {
    setTimeout(() => {
      this.listeners.forEach((callback) =>
        callback("WebSocket connection established.")
      );
    }, 500);
  }

  send(message: string): void {
    console.log(`Mock WebSocket sending: ${message}`);
    setTimeout(() => {
      const newData = {
        lineData: {
          x: new Date().getTime(),
          y: Math.floor(Math.random() * 1500),
        },
        heatmapData: useDashboardStore().generateHeatmapRowData(),
        merchantData: generateMerchantData(),
      };
      this.listeners.forEach((callback) => callback(newData));
    }, 500);
  }

  onmessage(callback: (message: any) => void): void {
    this.listeners.push(callback);
  }

  close(): void {
    console.log("Mock WebSocket connection closed.");
  }
}

// Function to generate mock merchant data
const generateMerchantData = () => {
  const merchants = ["Merchant A", "Merchant B", "Merchant C", "Merchant D"];
  const statusOptions = ["Active", "Inactive", "Pending"];

  return merchants.map((name) => ({
    name,
    count: Math.floor(Math.random() * 100), // Random transaction count (0-99)
    value: Math.floor(Math.random() * 10000), // Random transaction amount (0-9999)
    date: new Date(
      Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)
    )
      .toISOString()
      .split("T")[0], // Random date within the last 30 days
    status: statusOptions[Math.floor(Math.random() * statusOptions.length)], // Random status
  }));
};

export default MockWebSocket;
