import { useDashboardStore, type WebSocketStatus } from "@/stores/dashboard";

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
// Updated MockWebSocket class with connection state tracking
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
      const newData = {
        type: "data",
        lineData: {
          x: new Date().getTime(),
          y: Math.floor(Math.random() * 1500),
        },
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
