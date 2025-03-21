<script setup lang="ts">
import { ref, onMounted } from "vue";
import { MockWebSocket } from "../services/WebSocketService";

// Dark theme color palette
const colors = {
  primary: "#4936FC",
  secondary: "#10B981",
  background: "#1E2938",
  text: "#fff",
  grid: "#364051",
};

// Line Chart Options
const lineChartOptions = ref({
  chart: {
    id: "vuechart-example",
    type: "line",
    height: "100%",
    toolbar: {
      show: true,
      tools: {
        download: true,
        zoom: true,
        reset: true,
      },
    },
    zoom: {
      enabled: true,
      type: "xy",
      zoomedArea: {
        fill: { color: "#90CAF9", opacity: 0.4 },
        stroke: { color: "#42A5F5", width: 1 },
      },
    },
    animations: {
      enabled: true,
      easing: "easeinout",
      speed: 800,
    },
    background: colors.background,
    foreColor: colors.text,
  },
  colors: [colors.primary],
  stroke: {
    curve: "smooth",
  },
  fill: {
    type: "gradient",
    gradient: {
      shade: "light",
      gradientToColors: [colors.secondary],
      shadeIntensity: 1,
      stops: [0, 90, 100],
    },
  },
  markers: {
    size: 6,
    colors: [colors.primary],
    strokeColors: colors.background,
    hover: {
      size: 7,
    },
  },
  xaxis: {
    type: "datetime",
    labels: {
      format: "dd MMM yyyy",
      style: {
        colors: colors.text,
        fontSize: "12px",
        fontFamily: "Inter, sans-serif",
      },
    },
    axisBorder: {
      show: true,
      color: colors.grid,
    },
    axisTicks: {
      color: colors.grid,
    },
  },
  yaxis: [
    {
      title: {
        text: "Transactions",
        style: {
          color: colors.text,
          fontSize: "12px",
          fontFamily: "Inter, sans-serif",
        },
      },
      labels: {
        style: {
          colors: colors.text,
          fontSize: "12px",
          fontFamily: "Inter, sans-serif",
        },
      },
      axisBorder: {
        show: true,
        color: colors.grid,
      },
    },
    {
      opposite: true,
      title: {
        text: "Transaction Volume",
        style: {
          color: colors.text,
          fontSize: "12px",
          fontFamily: "Inter, sans-serif",
        },
      },
      labels: {
        style: {
          colors: colors.text,
          fontSize: "12px",
          fontFamily: "Inter, sans-serif",
        },
      },
    },
  ],
  tooltip: {
    x: {
      format: "dd MMM yyyy",
    },
    style: {
      fontSize: "14px",
      fontFamily: "Inter, sans-serif",
      fontWeight: "bold",
      color: colors.text,
    },
    fillSeriesColor: true,
    background: colors.background,
    marker: {
      show: true,
    },
  },
  grid: {
    show: true,
    borderColor: colors.grid,
    strokeDashArray: 4,
    position: "back",
  },
});

// Line Chart Data (initial data)
const lineSeries = ref([
  {
    name: "Transaction Volume",
    data: [
      { x: new Date("2025-03-01").getTime(), y: 100 },
      { x: new Date("2025-03-02").getTime(), y: 150 },
      { x: new Date("2025-03-03").getTime(), y: 200 },
      { x: new Date("2025-03-04").getTime(), y: 220 },
      { x: new Date("2025-03-05").getTime(), y: 250 },
      { x: new Date("2025-03-06").getTime(), y: 150 },
      { x: new Date("2025-03-07").getTime(), y: 150 },
      { x: new Date("2025-03-08").getTime(), y: 250 },
      { x: new Date("2025-03-09").getTime(), y: 2100 },
    ],
  },
]);

// Heatmap Options (unchanged)
const heatmapOptions = ref({
  chart: {
    id: "vuechart-heatmap",
    type: "heatmap",
    height: "100%",
    toolbar: {
      show: false,
      tools: {
        download: true,
        zoom: true,
        reset: true,
      },
    },
    background: colors.background,
    foreColor: colors.text,
  },
  colors: [colors.primary, colors.secondary],
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    categories: [
      "12 AM",
      "1 AM",
      "2 AM",
      "3 AM",
      "4 AM",
      "5 AM",
      "6 AM",
      "7 AM",
      "8 AM",
      "9 AM",
      "10 AM",
      "11 AM",
      "12 PM",
      "1 PM",
      "2 PM",
      "3 PM",
      "4 PM",
      "5 PM",
      "6 PM",
      "7 PM",
      "8 PM",
      "9 PM",
      "10 PM",
      "11 PM",
    ],
    labels: {
      style: {
        colors: colors.text,
        fontSize: "12px",
        fontFamily: "Inter, sans-serif",
      },
    },
    axisBorder: {
      show: true,
      color: colors.grid,
    },
    axisTicks: {
      color: colors.grid,
    },
  },
  yaxis: {
    show: true,
    labels: {
      style: {
        colors: colors.text,
        fontSize: "12px",
        fontFamily: "Inter, sans-serif",
      },
    },
    axisBorder: {
      show: true,
      color: colors.grid,
    },
  },
  tooltip: {
    y: {
      formatter: (value: number) => `Transactions: ${value}`,
    },
    style: {
      fontSize: "14px",
      fontFamily: "Inter, sans-serif",
      fontWeight: "bold",
      color: colors.text,
    },
    background: colors.background,
  },
  plotOptions: {
    heatmap: {
      distributed: true,
      colorScale: {
        inverse: false,
        ranges: [
          { from: 0, to: 50, name: "Low", color: "#4936FC" },
          { from: 51, to: 100, name: "Medium", color: "#10B981" },
          { from: 101, to: 200, name: "High", color: "#3189F2" },
        ],
      },
    },
  },
  grid: {
    show: true,
    borderColor: "#FFD700",
    strokeDashArray: 4,
    position: "back",
  },
});

// Heatmap Data (initial data)
const heatmapSeries = ref([
  { name: "Monday", data: generateHeatmapRowData() },
  { name: "Tuesday", data: generateHeatmapRowData() },
  { name: "Wednesday", data: generateHeatmapRowData() },
  { name: "Thursday", data: generateHeatmapRowData() },
  { name: "Friday", data: generateHeatmapRowData() },
  { name: "Saturday", data: generateHeatmapRowData() },
  { name: "Sunday", data: generateHeatmapRowData() },
]);

// Function to generate heatmap row data
function generateHeatmapRowData() {
  const data = [];
  const hours = 24;

  for (let hour = 0; hour < hours; hour++) {
    data.push({
      x: `${hour < 10 ? `0${hour}` : hour}`,
      y: Math.floor(Math.random() * 200),
    });
  }
  return data;
}

// Initialize WebSocket and update chart data
onMounted(() => {
  const ws = new MockWebSocket(import.meta.env.VITE_MOCK_WEB_SOCKET_URL);
  ws.connect();

  // Simulate real-time data updates for the line chart
  ws.onmessage((message) => {
    console.log("WebSocket message received:", message);

    // Simulate new data for the line chart
    const newLineData = {
      x: new Date().getTime(), // Use current timestamp
      y: Math.floor(Math.random() * 1000), // Random value between 0 and 1000
    };

    // Append new data to the existing line series
    lineSeries.value[0].data.push(newLineData);

    // Limit the number of data points to 20 to avoid overcrowding
    if (lineSeries.value[0].data.length > 20) {
      lineSeries.value[0].data.shift(); // Remove the oldest data point
    }

    // Simulate new data for the heatmap
    const newHeatmapData = heatmapSeries.value.map((day) => ({
      ...day,
      data: generateHeatmapRowData(), // Regenerate data for each day
    }));

    // Update the heatmap series
    heatmapSeries.value = newHeatmapData;
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
    <apexchart
      class="flex-1 h-full text-gray-900"
      type="line"
      :options="lineChartOptions"
      :series="lineSeries"
    ></apexchart>

    <!-- Heatmap -->
    <apexchart
      class="flex-1 h-full !rounded-lg text-gray-900"
      type="heatmap"
      :options="heatmapOptions"
      :series="heatmapSeries"
    ></apexchart>
  </div>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap");

body {
  font-family: "Inter", sans-serif;
  background-color: #111827;
  color: #f3f4f6;
}
</style>
