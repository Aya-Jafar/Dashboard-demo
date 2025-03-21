<script setup lang="ts">
// Props for the table
const props = defineProps({
  headers: {
    type: Array as () => Array<string>,
    required: true,
  },
  rows: {
    type: Array as () => Array<any>,
    required: true,
  },
});
</script>

<template>
  <div class="overflow-x-auto rounded-lg">
    <table class="min-w-full bg-[#1E2938] text-white">
      <thead>
        <tr>
          <!-- Dynamic headers -->
          <th
            v-for="header in headers"
            :key="header"
            class="px-4 py-3 text-left text-md font-bold border-b border-gray-600"
          >
            {{ header }}
          </th>
        </tr>
      </thead>
      <tbody>
        <!-- Dynamic rows -->
        <tr v-for="(row, rowIndex) in rows" :key="rowIndex" class="hover:bg-gray-700 transition-colors">
          <!-- Dynamic cells -->
          <td
            v-for="(cell, cellIndex) in row"
            :key="cellIndex"
            class="px-4 py-2 text-sm border-b border-gray-600"
          >
            {{ cell }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>