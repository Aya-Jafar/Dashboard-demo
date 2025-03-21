import { useDashboardStore } from "../stores/dashboard";
export class MockWebSocket {
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
          y: Math.floor(Math.random() * 1000),
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
function generateMerchantData() {
  const merchants = ["Merchant A", "Merchant B", "Merchant C", "Merchant D"];
  return merchants.map((name) => ({
    name,
    count: Math.floor(Math.random() * 100),
    value: Math.floor(Math.random() * 10000),
  }));
}
