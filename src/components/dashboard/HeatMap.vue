<script setup lang="ts">
import { ref, watch } from "vue";


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
