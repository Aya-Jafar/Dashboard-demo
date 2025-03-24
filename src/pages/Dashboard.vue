<script setup lang="ts">
import { onMounted, computed } from "vue";
import MockWebSocket from "../services/WebSocketService";
import LineChart from "@components/dashboard/LineChart.vue";
import HeatMap from "@components/dashboard/HeatMap.vue";
import { useDashboardStore } from "@stores/dashboard";
import { useLayoutStore } from "@stores/layout";
import Table from "@components/common/Table.vue";

// Access the store
const store = useDashboardStore();
const { isSidebarOpen } = useLayoutStore();

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
    if (store.lineSeries[0]?.data) {
      store.lineSeries[0].data.push(newLineData);

      if (store.lineSeries[0].data.length > 20) {
        store.lineSeries[0].data.shift();
      }
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
  }, 5000); // Send a message every 5 seconds
});

// Compute height based on side bar visibility
const heightValue = computed(() => (isSidebarOpen ? "h-40" : "h-50"));
</script>

<template>
  <div class="bg-slate-900 gap-6 p-6 rounded-t-lg">
    <p class="font-bold text-2xl">{{ $t("charts_title") }}</p>
  </div>

  <div
    class="flex items-center justify-center bg-slate-900 gap-6 p-2 !rounded-b-lg"
    :style="{ height: heightValue }"
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
    :title="$t('table_title')"
    :rows="store.tableRows"
    :headers="store.tableHeaders"
    class="mt-5 rounded-lg"
  >
    <!-- Custom rendering for the "Status" column -->
    <template #status="{ value }">
      <span
        :class="{
          'bg-sky-600': value === 'Active',
          'bg-red-400': value === 'Inactive',
          'bg-yellow-500': value === 'Pending',
        }"
        class="px-2 py-1 rounded-full text-white inline-block"
      >
        {{
          value === "Active"
            ? $t("active")
            : value === "Inactive"
            ? $t("inactive")
            : $t("pending")
        }}
      </span>
    </template>
  </Table>
</template>

<style></style>
