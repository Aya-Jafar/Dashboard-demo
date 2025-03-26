<script setup lang="ts">
import { ref, computed } from "vue";
import { exportToCSV, getCurrentLanguage } from "@/utils/helpers";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  headers: {
    type: Array<string>,
    required: true,
  },
  rows: {
    type: Array<any>,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

// States for sorting
const sortColumn = ref<string | null>(null);
const sortDirection = ref<"asc" | "desc">("asc");

// State for filtering
const filterValue = ref<string>("");
const filterColumn = ref<string | null>(null);

// Computed property for sorted and filtered rows
const sortedAndFilteredRows = computed(() => {
  let filteredRows = props.rows;

  // Apply filtering
  if (filterColumn.value && filterValue.value) {
    // Apply exact filtering with status
    if (filterColumn.value === "status") {
      filteredRows = filteredRows.filter((row) => {
        const columnIndex = props.headers.indexOf(filterColumn.value!);
        return (
          String(row[columnIndex]).toLowerCase() ===
          filterValue.value.toLowerCase()
        );
      });
    }

    filteredRows = filteredRows.filter((row) => {
      const columnIndex = props.headers.indexOf(filterColumn.value!);
      return String(row[columnIndex])
        .toLowerCase()
        .includes(filterValue.value.toLowerCase());
    });
  }

  // Apply sorting
  if (sortColumn.value) {
    const columnIndex = props.headers.indexOf(sortColumn.value);
    filteredRows = filteredRows.slice().sort((a, b) => {
      const aValue = a[columnIndex];
      const bValue = b[columnIndex];

      // Handle numbers
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection.value === "asc"
          ? aValue - bValue
          : bValue - aValue;
      }

      // Handle dates
      if (aValue instanceof Date && bValue instanceof Date) {
        return sortDirection.value === "asc"
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime();
      }

      // Handle strings
      return sortDirection.value === "asc"
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
  }

  return filteredRows;
});

// Function to handle sorting
const handleSort = (column: string) => {
  if (sortColumn.value === column) {
    // Toggle sort direction
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  } else {
    // Set new sort column and default to ascending
    sortColumn.value = column;
    sortDirection.value = "asc";
  }
};

const handleExport = () => {
  exportToCSV(sortedAndFilteredRows.value, props.title, props.headers);
};
</script>

<template>
  <div class="overflow-x-auto">
    <!-- Filter Input -->
    <div class="flex justify-between items-center">
      <p class="text-2xl font-bold">
        {{ title }}
      </p>
      <div class="flex items-end gap-4 mb-5">
        <div class="w-50 flex flex-col justify-end">
          <label for="filter" class="block text-sm font-medium text-gray-300">
            {{ $t("filterBy") }}
          </label>
          <select
            v-model="filterColumn"
            class="mt-1 block w-full p-2 border border-gray-600 bg-slate-900 text-white rounded-md"
          >
            <option :value="null">{{ $t("selectColumn") }}</option>
            <option v-for="header in headers" :key="header" :value="header">
              {{ $t(header) }}
            </option>
          </select>
          <input
            v-if="filterColumn"
            v-model="filterValue"
            type="text"
            :placeholder="$t('enterFilterValue')"
            class="mt-2 block w-full p-2 border border-gray-600 bg-slate-900 text-white rounded-md"
          />
        </div>

        <button
          @click="handleExport"
          class="px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          :disabled="sortedAndFilteredRows.length === 0"
          :class="{
            'opacity-50 cursor-not-allowed': sortedAndFilteredRows.length === 0,
          }"
        >
          {{ $t("export") }}
        </button>
      </div>
    </div>
    <!-- Skeleton Loading -->
    <div v-if="loading" class="space-y-2">
      <!-- Skeleton header with equal width columns -->
      <div class="flex space-x-2 animate-pulse">
        <div
          v-for="index in headers"
          :key="`header-${index}`"
          class="h-10 bg-gray-700 rounded"
          :style="{
            width: `${100 / headers.length}%`,
            minWidth: '100px',
          }"
        ></div>
      </div>

      <!-- Skeleton rows -->
      <div
        v-for="i in 5"
        :key="`row-${i}`"
        class="flex space-x-2 animate-pulse"
      >
        <div
          v-for="index in headers"
          :key="`cell-${index}-${i}`"
          class="h-12 bg-gray-800 rounded"
          :style="{
            width: `${100 / headers.length}%`,
            minWidth: '100px',
          }"
        ></div>
      </div>
    </div>

    <!-- Table -->
    <table
      class="min-w-full bg-slate-900 text-white"
      v-if="sortedAndFilteredRows.length > 0 && !loading"
    >
      <thead>
        <tr>
          <!-- Dynamic headers with sorting -->
          <th
            v-for="header in headers"
            :key="header"
            :class="{
              'text-left': getCurrentLanguage() === 'en',
              'text-right': getCurrentLanguage() === 'ar',
            }"
            class="px-4 py-3 text-left text-sm font-semibold cursor-pointer hover:bg-gray-700"
            @click="handleSort(header)"
          >
            {{ $t(header) }}
            <span v-if="sortColumn === header">
              {{ sortDirection === "asc" ? "↑" : "↓" }}
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        <!-- Dynamic rows -->
        <tr
          v-for="(row, rowIndex) in sortedAndFilteredRows"
          :key="rowIndex"
          class="hover:bg-gray-700 transition-colors"
        >
          <!-- Dynamic cells -->
          <td
            v-for="(cell, cellIndex) in row"
            :key="cellIndex"
            class="px-4 py-2 text-sm border-b border-gray-600"
          >
            <!-- Use slots for custom rendering -->
            <slot :name="headers[cellIndex]" :value="cell" :row="row">
              {{ cell }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="sortedAndFilteredRows.length === 0 && !loading">
      <p class="text-xl text-center font-semibold">{{ $t("empty_data") }}</p>
    </div>
  </div>
</template>

<style scoped>
table {
  border-collapse: collapse;
}

th,
td {
  border: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
