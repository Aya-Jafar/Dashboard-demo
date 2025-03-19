<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { APIService } from "../services/ApiService.ts";
import Button from "../components/Button.vue";
import API_ENDPOINTS from "../utils/endpoints.ts";
import TreeNode from "../components/TreeNode.vue";

// State variables
const isLoading = ref(false);
const nodes = ref<any[]>([]);
const currentPage = ref(1); // Track the current page
const pageSize = ref(10); // Number of items per page (limit)

// Total items
const totalItems = ref(200);

// Calculate total pages based on total items and page size
const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value));

const handleAction = () => {
  console.log("newww");
};

// Call the APIService.request method with dynamic pagination
const fetchData = async (page: number) => {
  try {
    const data = await APIService.request({
      endpoint: API_ENDPOINTS.getAllTreeNode,
      method: "GET",
      pathParams: `?page=${page}&limit=${pageSize.value}`, // Use dynamic page and limit
      setLoading: (loading: boolean) => (isLoading.value = loading),
      setterFunction: (data: any) => {
        nodes.value = data; // Assuming API returns an array of nodes
      },
    });

    console.log(data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// Fetch data when component is mounted
onMounted(() => {
  fetchData(currentPage.value);
});

// Handle next page click
const goToNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    fetchData(currentPage.value);
  }
};

// Handle previous page click
const goToPreviousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    fetchData(currentPage.value);
  }
};
</script>

<template>
  <div class="flex justify-between items-end mb-10 p-4">
    <span class="text-white">Search...</span>
    <Button :loading="false" :action="handleAction" class="w-30"> New </Button>
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
        <TreeNode :node="node" />
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
