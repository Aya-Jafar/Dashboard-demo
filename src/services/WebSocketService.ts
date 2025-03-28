
/**
 * A mock WebSocket implementation for testing and development purposes.
 * Simulates WebSocket behavior without requiring an actual server connection.
 *
 * @example
 * const socket = new MockWebSocket('ws://example.com');
 * socket.onmessage((data) => console.log('Received:', data));
 * socket.connect();
 * socket.send('ping');
 */

import { useDashboardStore, type WebSocketStatus } from "@/stores/dashboard";
import { generateRandomY } from "@/utils/helpers";
class MockWebSocket {
  // @ts-ignore
  private url: string;
  private listeners: Array<(message: any) => void>;
  private connectionState: WebSocketStatus;
  private reconnectAttempts: number;
  private maxReconnectAttempts: number;
  private reconnectInterval: number;

  constructor(url: string) {
    this.url = url;
    this.listeners = [];
    this.connectionState = "disconnected";
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectInterval = 3000;
  }

  get state() {
    return this.connectionState;
  }

  connect(): void {
    if (
      this.connectionState === "connected" ||
      this.connectionState === "connecting"
    ) {
      return;
    }

    this.connectionState = "connecting";
    this.reconnectAttempts++;

    // Simulate connection attempt with possible failure
    const shouldFail = Math.random() < 0.2; // 20% chance of failure for simulating

    setTimeout(() => {
      if (shouldFail && this.reconnectAttempts < this.maxReconnectAttempts) {
        this.connectionState = "error";
        console.error(
          "Mock WebSocket connection failed. Attempting reconnect..."
        );
        this.scheduleReconnect();
      } else {
        this.connectionState = "connected";
        this.reconnectAttempts = 0;
        this.listeners.forEach((callback) =>
          callback({
            type: "connection",
            message: "WebSocket connection established",
          })
        );
      }
    }, 500);
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("Max reconnection attempts reached");
      this.connectionState = "disconnected";
      return;
    }

    setTimeout(() => this.connect(), this.reconnectInterval);
  }

  send(message: string): void {
    if (this.connectionState !== "connected") {
      console.warn("Cannot send message - WebSocket not connected");
      return;
    }
    console.log(`Mock WebSocket sending: ${message}`);

    setTimeout(() => {
      const today = new Date();
      const store = useDashboardStore();

      if (!store.lineSeries?.[0]?.data) {
        throw new Error("Invalid line series data structure");
      }

      const lineData = store.lineSeries[0].data;
      const lastDataPoint = lineData[lineData.length - 1];

      // Create comparison dates without time components
      const normalizeDate = (date: Date) =>
        new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

      const todayNormalized = normalizeDate(today);
      const lastDateNormalized = lastDataPoint
        ? normalizeDate(new Date(lastDataPoint.x))
        : 0;

      if (todayNormalized > lastDateNormalized) {
        // Add new entry if it's a new day or first data point
        const newEntry = {
          x: today.getTime(),
          y: generateRandomY(),
        };

        lineData.push(newEntry);

        // Maintain 7-day window 
        if (lineData.length > 7) {
          console.log("Dropping oldest data point:", lineData.shift());
          lineData.shift();
        }
      } else {
        // Update today's existing data point
        lineData[lineData.length - 1] = {
          x: today.getTime(),
          y: generateRandomY(),
        };
      }

      const newData = {
        type: "data",
        lineData: [...lineData],
        heatmapData: useDashboardStore().generateHeatmapRowData(),
        merchantData: useDashboardStore().generateMerchantData(),
      };
      this.listeners.forEach((callback) => callback(newData));
    }, 500);
  }

  onmessage(callback: (message: any) => void): void {
    this.listeners.push(callback);
  }

  close(): void {
    this.connectionState = "disconnected";
    console.log("Mock WebSocket connection closed.");
  }
}

export default MockWebSocket;
