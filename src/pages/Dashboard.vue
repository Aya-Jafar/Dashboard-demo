<script setup lang="ts">
import { onMounted } from "vue";
import { MockWebSocket } from "../services/WebSocketService";
import LineChart from "../components/dashboard/LineChart.vue";
import HeatMap from "../components/dashboard/HeatMap.vue";
import { useDashboardStore } from "../stores/dashboard";
import Table from "../components/common/Table.vue";

// Access the store
const store = useDashboardStore();

// Initialize WebSocket and update chart data
onMounted(() => {
  const ws = new MockWebSocket(import.meta.env.VITE_MOCK_WEB_SOCKET_URL);
  ws.connect();

  // Simulate real-time data updates
  ws.onmessage((message) => {
    console.log("WebSocket message received:", message);

    // Simulate new data for the line chart
    const newLineData = {
      x: new Date().getTime(), // Use current timestamp
      y: Math.floor(Math.random() * 1000), // Random value between 0 and 1000
    };

    // Append new data to the existing line series
    store.lineSeries[0].data.push(newLineData);

    // Limit the number of data points to 20 to avoid overcrowding
    if (store.lineSeries[0].data.length > 20) {
      store.lineSeries[0].data.shift(); // Remove the oldest data point
    }

    // Simulate new data for the heatmap
    const newHeatmapData = store.heatmapSeries.map((day) => ({
      ...day,
      data: store.generateHeatmapRowData(), // Regenerate data for each day
    }));

    // Update the heatmap series
    store.heatmapSeries = newHeatmapData;

    // Update merchant table
    store.merchants = message.merchantData;

    // Update tableRows to reflect the new merchants data
    store.updateTableRows();
  });

  // Simulate periodic WebSocket messages
  setInterval(() => {
    ws.send("Update charts");
  }, 3000); // Send a message every 3 seconds
});
</script>

<template>
  <div class="bg-[#1F2937] gap-6 p-6 rounded-t-lg">
    <p class="font-bold text-2xl">Transaction statistics</p>
  </div>
  <div
    class="flex items-center justify-center bg-[#1F2937] gap-6 p-6 !rounded-b-lg !h-[50vh]"
  >
    <!-- Line Chart -->
    <LineChart
      :chart-options="store.lineChartOptions"
      :colors="store.colors"
      :series="store.lineSeries"
    />

    <!-- Heatmap -->
    <HeatMap
      :chart-options="store.heatmapOptions"
      :colors="store.colors"
      :series="store.heatmapSeries"
    />
  </div>

  <!-- Merchant Table -->
  <Table
    :rows="store.tableRows"
    :headers="store.tableHeaders"
    class="mt-5 rounded-lg"
  />
</template>

<style></style>
