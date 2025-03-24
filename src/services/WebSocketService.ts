import { useDashboardStore } from "../stores/dashboard";

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
class MockWebSocket {
  private url: string;
  private listeners: Array<(message: any) => void>;

  /**
   * Creates a new MockWebSocket instance
   * @param {string} url - The URL to simulate connecting to
   */
  constructor(url: string) {
    this.url = url;
    this.listeners = [];
  }

  /**
   * Simulates establishing a WebSocket connection.
   * After a 500ms delay, triggers a connection confirmation message.
   */
  connect(): void {
    setTimeout(() => {
      this.listeners.forEach((callback) =>
        callback("WebSocket connection established.")
      );
    }, 500);
  }

  /**
   * Simulates sending data through the WebSocket.
   * Generates mock response data after a 500ms delay containing:
   * - Random line chart data point
   * - Generated heatmap data from dashboard store
   * - Generated merchant data from dashboard store
   *
   * @param {string} message - The message being sent
   */
  send(message: string): void {
    console.log(`Mock WebSocket sending: ${message}`);
    setTimeout(() => {
      const newData = {
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

  /**
   * Registers a callback function to handle incoming messages
   * @param {(message: any) => void} callback - Function to call when messages are received
   */
  onmessage(callback: (message: any) => void): void {
    this.listeners.push(callback);
  }

  /**
   * Simulates closing the WebSocket connection
   */
  close(): void {
    console.log("Mock WebSocket connection closed.");
  }
}

export default MockWebSocket;
