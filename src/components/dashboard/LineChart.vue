<script setup lang="ts">
import { ref, watch } from "vue";

// Props for the line chart
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
    type: Array as () => Array<{
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
