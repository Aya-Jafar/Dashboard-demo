<script setup lang="ts">
import { ref, watch } from "vue";
/**
 * Heatmap Chart Component
 *
 * @component
 *
 * @prop {Object} chartOptions - ApexCharts configuration options
 * @prop {Object} colors - Color configuration for the heatmap
 * @prop {HeatmapSeries[]} series - Array of data series to display
 *
 * @example
 * // Basic usage
 * <HeatMap
 *   :chart-options="chartOptions"
 *   :colors="colors"
 *   :series="heatmapData"
 * />
 *
 * @example
 * // Sample data structure
 * const chartOptions = {
 *   chart: {
 *     type: 'heatmap',
 *     toolbar: { show: false }
 *   },
 *   dataLabels: { enabled: false },
 *   xaxis: {
 *     categories: ['Jan', 'Feb', 'Mar', 'Apr']
 *   }
 * };
 *
 * const colors = {
 *   ranges: [
 *     { from: 0, to: 10, color: '#FF0000', name: 'Low' },
 *     { from: 11, to: 20, color: '#00FF00', name: 'Medium' },
 *     { from: 21, to: 30, color: '#0000FF', name: 'High' }
 *   ]
 * };
 *
 * const heatmapData = [
 *   {
 *     name: 'Series 1',
 *     data: [
 *       { x: 'Jan', y: 5 },
 *       { x: 'Feb', y: 15 },
 *       { x: 'Mar', y: 25 }
 *     ]
 *   },
 *   {
 *     name: 'Series 2',
 *     data: [
 *       { x: 'Jan', y: 8 },
 *       { x: 'Feb', y: 12 },
 *       { x: 'Mar', y: 18 }
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
      data: Array<{ x: string; y: number }>;
    }>,
    required: true,
  },
});
// Reactive series data
const heatmapSeries = ref(props.series);

// Watch for changes in the series prop
watch(
  () => props.series,
  (newSeries) => {
    heatmapSeries.value = newSeries;
  },
  { deep: true }
);
</script>

<template>
  <apexchart
    class="flex-1 h-full !rounded-lg text-gray-900"
    type="heatmap"
    :options="chartOptions"
    :series="heatmapSeries"
  ></apexchart>
</template>
