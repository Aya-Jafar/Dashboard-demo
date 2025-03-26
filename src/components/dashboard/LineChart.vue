<script setup lang="ts">
import { ref, watch } from "vue";

/**
 * Line Chart Component
 *
 * @component
 *
 * @prop {Object} chartOptions - ApexCharts configuration options
 * @prop {Object} colors - Color configuration for the chart
 * @prop {LineSeries[]} series - Array of data series to display
 *
 * @example
 * // Basic usage
 * <LineChart
 *   :chart-options="chartOptions"
 *   :colors="colors"
 *   :series="lineData"
 * />
 *
 * @example
 * // Sample data structure
 * const chartOptions = {
 *   chart: {
 *     type: 'line',
 *     height: 350,
 *     toolbar: { show: true }
 *   },
 *   stroke: {
 *     curve: 'smooth',
 *     width: 2
 *   },
 *   xaxis: {
 *     type: 'datetime'
 *   },
 *   yaxis: {
 *     title: { text: 'Values' }
 *   }
 * };
 *
 * const colors = ['#008FFB', '#00E396', '#FEB019']; // Array of colors for series
 *
 * const lineData = [
 *   {
 *     name: 'Sales',
 *     data: [
 *       { x: 1672531200000, y: 30 }, // Jan 1 2023
 *       { x: 1675209600000, y: 40 }, // Feb 1 2023
 *       { x: 1677628800000, y: 45 }  // Mar 1 2023
 *     ]
 *   },
 *   {
 *     name: 'Revenue',
 *     data: [
 *       { x: 1672531200000, y: 20 },
 *       { x: 1675209600000, y: 35 },
 *       { x: 1677628800000, y: 50 }
 *     ]
 *   }
 * ];
 */

const props = defineProps({
  chartOptions: {
    type: Object,
    required: true,
  },
  colors: {
    type: Object,
    required: true,
  },
  series: {
    type: Array<{
      name: string;
      data: Array<{ x: number; y: number }>;
    }>,
    required: true,
  },
});

// Reactive series data
const lineSeries = ref(props.series);

// Watch for changes in the series prop
watch(
  () => props.series,
  (newSeries) => {
    lineSeries.value = newSeries;
  },
  { deep: true }
);
</script>

<template>
  <apexchart
    class="flex-1 h-full text-gray-900"
    type="line"
    :options="chartOptions"
    :series="lineSeries"
  ></apexchart>
</template>
