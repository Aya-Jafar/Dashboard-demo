<script setup lang="ts">
import { ref, onMounted } from "vue";

// Dark theme color palette with yellow accent
const colors = {
  primary: "#4936FC",
  secondary: "#10B981",
  background: "#1E2938",
  text: "#fff",
  grid: "#364051",
};

// Heatmap Options
const heatmapOptions = ref({
  chart: {
    id: "vuechart-heatmap",
    type: "heatmap",
    height: "100%",
    toolbar: {
      show: false, // Hide toolbar for heatmap
    },
    background: colors.background, // Set chart background
    foreColor: colors.text, // Set default text color
  },
  colors: [colors.primary], // Use primary color for heatmap
  xaxis: {
    categories: [
      "00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10",
      "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"
    ], // Hours of the day
    labels: {
      style: {
        colors: colors.text, // Light gray text for x-axis labels
        fontSize: "12px",
        fontFamily: "Inter, sans-serif", // Modern font
      },
    },
    axisBorder: {
      show: true,
      color: colors.grid, // Medium gray border
    },
    axisTicks: {
      color: colors.grid, // Medium gray ticks
    },
  },
  yaxis: {
    show: false, // Hide y-axis as we only have one day
  },
  tooltip: {
    y: {
      formatter: (value: number) => `Transactions: ${value}`, // Tooltip showing transaction volume
    },
    style: {
      fontSize: "14px",
      fontFamily: "Inter, sans-serif", // Modern font
      fontWeight: "bold",
      color: colors.text, // Light gray text for tooltip
    },
    background: colors.background, // Dark background for tooltip
  },
  plotOptions: {
    heatmap: {
      colorScale: {
        ranges: [
          {
            from: 0,
            to: 50,
            name: "Low",
            color: "#00A100",
          },
          {
            from: 51,
            to: 100,
            name: "Medium",
            color: "#FFB200",
          },
          {
            from: 101,
            to: 200,
            name: "High",
            color: "#FF0000",
          },
        ],
      },
    },
  },
  grid: {
    show: true, // Show grid lines
    borderColor: colors.grid, // Medium gray grid lines
    strokeDashArray: 4, // Dashed grid lines
    position: "back", // Place grid behind the chart
  },
});

// Heatmap Data (Transaction activity by hour of the current day)
const heatmapSeries = ref([
  {
    name: "Transaction Activity",
    data: generateHeatmapData(), // Generate heatmap data
  },
]);

// Function to generate heatmap data for the current day
function generateHeatmapData() {
  const data = [];
  const hours = 24; // Hours in a day

  for (let hour = 0; hour < hours; hour++) {
    data.push({
      x: `${hour < 10 ? `0${hour}` : hour}`, // Format hour as "00", "01", etc.
      y: 1, // Single row for the current day
      value: Math.floor(Math.random() * 200), // Random transaction count (0-200)
    });
  }
  return data;
}

onMounted(() => {
  // Simulate updating data after 2 seconds
  setTimeout(() => {
    heatmapSeries.value[0].data = generateHeatmapData();
  }, 2000);
});
</script>

<template>
  <div

  >
    <!-- Heatmap -->
    <apexchart
      class="w-full h-full !rounded-lg"
      type="heatmap"
      :options="heatmapOptions"
      :series="heatmapSeries"
    ></apexchart>
  </div>
</template>

<style>
/* Import Inter font for modern typography */
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap");

/* Apply modern font to the entire app */
body {
  font-family: "Inter", sans-serif;
  background-color: #111827; /* Dark background for the entire page */
  color: #F3F4F6; /* Light text color for the entire page */
}
</style>