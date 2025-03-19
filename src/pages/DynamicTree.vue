<script setup lang="ts">
import { onMounted, ref, computed, watch } from "vue";
import { APIService } from "../services/ApiService.ts";
import Button from "../components/Button.vue";
import API_ENDPOINTS from "../utils/endpoints.ts";
import TreeNode from "../components/TreeNode.vue";

// State variables
const isLoading = ref(false);
const nodes = ref<any[]>([]);
const currentPage = ref(1); // Track the current page
const pageSize = ref(10); // Number of items per page (limit)
const searchLabel = ref(""); // Search input for node label
const totalItems = ref(1000); // Total items

// Calculate total pages based on total items and page size
const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value));

// Function to handle API requests with dynamic search based on the label
const fetchData = async (page: number, label: string = "") => {
  try {
    isLoading.value = true;
    const data = await APIService.request({
      endpoint: API_ENDPOINTS.getAllTreeNode,
      method: "GET",
      pathParams: `?page=${page}&limit=${
        pageSize.value
      }&label=${encodeURIComponent(label)}`, // Include label in query params
      setLoading: (loading: boolean) => (isLoading.value = loading),
      setterFunction: (data: any) => {
        nodes.value = data; // Assuming API returns an array of nodes
      },
    });
    console.log(data);
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    isLoading.value = false;
  }
};

// Recursive function to open or close nodes based on the search label
const toggleNodesBySearch = (nodes: any[], label: string) => {
  nodes.forEach((node) => {
    if (label === "") {
      // If the search label is empty, close all nodes
      node.isOpen = false;
    } else if (node.label.toLowerCase().includes(label.toLowerCase())) {
      // If the node matches the search label, open it
      node.isOpen = true;
    }
    // Recursively process children
    if (node.children && node.children.length > 0) {
      toggleNodesBySearch(node.children, label);
    }
  });
};

// Watch for changes in the search label and trigger search
watch(searchLabel, (newLabel) => {
  currentPage.value = 1; // Reset to first page on new search
  fetchData(currentPage.value, newLabel).then(() => {
    toggleNodesBySearch(nodes.value, newLabel); // Open or close nodes based on the search label
  });
});

// Fetch data when component is mounted
onMounted(() => {
  fetchData(currentPage.value, searchLabel.value);
});

// Handle next page click
const goToNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    fetchData(currentPage.value, searchLabel.value);
  }
};

// Handle previous page click
const goToPreviousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    fetchData(currentPage.value, searchLabel.value);
  }
};

// Toggle the visibility of nodes
const toggleNodeVisibility = (nodeId: string) => {
  const node = nodes.value.find((node: any) => node.id === nodeId);
  if (node) {
    node.visible = !node.visible; // Toggle visibility
  }
};

const handleAction = () => {};
</script>

<template>
  <div class="flex justify-between items-end mb-10 p-4">
    <!-- Search input -->
    <input
      v-model="searchLabel"
      type="text"
      placeholder="Search by label..."
      class="p-2 rounded-md bg-gray-800 text-white"
    />
    <Button :loading="isLoading" :action="handleAction" class="w-30">
      New
    </Button>
  </div>

  <div class="p-4">
    <!-- Loading state -->
    <div v-if="isLoading" class="flex justify-center items-center">
      <div
        class="spinner-border animate-spin inline-block w-8 h-8 border-4 border-blue-500 rounded-full"
        role="status"
      ></div>
    </div>

    <!-- Tree Rendering -->
    <div v-else>
      <div
        v-for="(node, index) in nodes"
        :key="node.id"
        class="mb-4 text-white"
      >
        <!-- Root Level Node -->
        <TreeNode
          :node="node"
          :visible="node.visible"
          @toggle="toggleNodeVisibility(node.id)"
        />
      </div>

      <!-- Pagination Controls -->
      <div class="flex justify-center mt-4">
        <button
          :disabled="currentPage === 1"
          @click="goToPreviousPage"
          class="px-4 py-2 bg-gray-800 text-white rounded-l hover:bg-gray-700"
        >
          Previous
        </button>

        <span class="px-4 py-2 text-white"
          >Page {{ currentPage }} of {{ totalPages }}</span
        >

        <button
          :disabled="currentPage === totalPages"
          @click="goToNextPage"
          class="px-4 py-2 bg-gray-800 text-white rounded-r hover:bg-gray-700"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>
