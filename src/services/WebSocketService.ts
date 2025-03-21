


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
      this.listeners.forEach((callback) => callback(`Received: ${message}`));
    }, 500);
  }

  onmessage(callback: (message: any) => void): void {
    this.listeners.push(callback);
  }

  close(): void {
    console.log("Mock WebSocket connection closed.");
  }
}
