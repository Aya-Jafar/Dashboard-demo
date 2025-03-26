<script setup lang="ts">
/**
 * Simulating Real-time dashboard displaying:
 * - Line chart (20-point rolling window)
 * - Heatmap visualization
 * - Merchant status table with custom badges
 * - Visual WebSocket connection status
 *
 * Uses MockWebSocket in development
 *
 * @example <Dashboard />
 */

import { onMounted, computed, ref } from "vue";
import MockWebSocket from "../services/WebSocketService";
import LineChart from "@components/dashboard/LineChart.vue";
import HeatMap from "@components/dashboard/HeatMap.vue";
import { useDashboardStore, type WebSocketStatus } from "@stores/dashboard";
import { useLayoutStore } from "@stores/layout";
import Table from "@components/common/Table.vue";

// Store and states
const store = useDashboardStore();
const { isSidebarOpen } = useLayoutStore();
const connectionStatus = ref<WebSocketStatus>("disconnected");
const ws = ref<MockWebSocket | null>(null);
const isOnline = ref(navigator.onLine);

// Initialize WebSocket and update chart data
const initWebSocket = () => {
  // Check connection status
  if (!isOnline.value) {
    return;
  }
  ws.value = new MockWebSocket(import.meta.env.VITE_MOCK_WEB_SOCKET_URL);

  ws.value.onmessage((message) => {
    if (message.type === "connection") {
      connectionStatus.value = "connected";
      return;
    }

    // Handle data updates
    console.log("WebSocket data received:", message);

    // Update line chart data
    if (message.lineData && store.lineSeries[0]?.data) {
      store.lineSeries[0].data.push(message.lineData);
      if (store.lineSeries[0].data.length > 20) {
        store.lineSeries[0].data.shift();
      }
    }

    // Update heatmap data
    if (message.heatmapData) {
      const newHeatmapData = store.heatmapSeries.map((day) => ({
        ...day,
        data: message.heatmapData,
      }));
      store.heatmapSeries = newHeatmapData;
    }

    // Update merchant data
    if (message.merchantData) {
      store.merchants = message.merchantData;
      store.updateTableRows();
    }
  });

  ws.value.connect();
};

onMounted(() => {
  if (!isOnline) {
    return;
  }
  initWebSocket();

  // Simulate periodic WebSocket messages
  const intervalId = setInterval(() => {
    if (ws.value?.state === "connected") {
      ws.value.send("Update charts");
    }
  }, 5000);

  // Cleanup on unmount
  return () => {
    clearInterval(intervalId);
    ws.value?.close();
  };
});

// Compute height based on side bar visibility
const heightValue = computed(() => (isSidebarOpen ? "h-40" : "h-50"));
</script>

<template>
  <div class="bg-slate-900 gap-6 p-6 rounded-t-lg">
    <div class="flex items-center justify-between">
      <p class="font-bold text-2xl">{{ $t("charts_title") }}</p>
      <!-- Connection status indicator with circle -->
      <div class="flex items-center gap-2">
        <span class="relative flex h-3 w-3">
          <!-- Animated ping effect for non-connected states -->
          <span
            v-if="connectionStatus !== 'connected'"
            class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
            :class="{
              'bg-yellow-400': connectionStatus === 'connecting',
              'bg-orange-500': connectionStatus === 'error',
              'bg-red-500': connectionStatus === 'disconnected',
            }"
          ></span>
          <!-- Static circle -->
          <span
            class="relative inline-flex rounded-full h-3 w-3"
            :class="{
              'bg-yellow-400': connectionStatus === 'connecting',
              'bg-orange-500': connectionStatus === 'error',
              'bg-green-500': connectionStatus === 'connected',
              'bg-red-500': connectionStatus === 'disconnected',
            }"
          ></span>
        </span>
        <span
          class="text-sm"
          :class="{
            'text-yellow-400': connectionStatus === 'connecting',
            'text-orange-500': connectionStatus === 'error',
            'text-green-500': connectionStatus === 'connected',
            'text-red-500': connectionStatus === 'disconnected',
          }"
        >
          {{
            connectionStatus === "connecting"
              ? "Connecting..."
              : connectionStatus === "error"
              ? "Connection error"
              : connectionStatus === "disconnected"
              ? "Disconnected"
              : "Connected"
          }}
        </span>
      </div>
    </div>
  </div>

  <div
    class="flex items-center justify-center bg-slate-900 gap-6 p-2 !rounded-b-lg"
    :style="{ height: heightValue }"
  >
    <div class="flex items-center justify-center py-10" v-if="!isOnline">
      <p class="text-2xl text-center">
        {{ $t("connection_error") }}
      </p>
    </div>

    <!-- Line Chart -->
    <LineChart
      v-if="isOnline"
      :chart-options="store.lineChartOptions"
      :colors="store.colors"
      :series="store.lineSeries"
    />

    <!-- Heatmap -->
    <HeatMap
      v-if="isOnline"
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
    :loading="connectionStatus === 'connecting' || !isOnline"
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

<style>
.w-3.h-3 {
  transition: background-color 0.3s ease;
}
</style>
