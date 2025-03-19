<script setup lang="ts">
import { onMounted, ref } from "vue";
import { APIService } from "../services/ApiService.ts";
import Button from "../components/Button.vue";
import API_ENDPOINTS from "../utils/endpoints.ts";
import TreeNode from "../components/TreeNode.vue";

const isLoading = ref(false);
const nodes = ref<any[]>([]);

const handleAction = () => {
  console.log("newww");
};

// Call the APIService.request method with the given options
const fetchData = async () => {
  try {
    const data = await APIService.request({
      endpoint: API_ENDPOINTS.getAllTreeNode,
      method: "GET",
      pathParams: "?page=2&limit=2", // Query parameters
      setLoading: (loading: boolean) => (isLoading.value = loading),
      setterFunction: (data: any) => (nodes.value = data),
    });

    console.log(data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

onMounted(() => {
  fetchData();
});
</script>

<template>
  <div class="flex justify-between items-end mb-10">
    <span>Search...</span>
    <Button :loading="false" :action="handleAction" class="w-30"> New </Button>
  </div>

  <div>
    <!-- Loading state -->
    <div v-if="isLoading" class="flex justify-center items-center">
      <div
        class="spinner-border animate-spin inline-block w-8 h-8 border-4 border-blue-500 rounded-full"
        role="status"
      ></div>
    </div>

    <!-- Tree Rendering -->
    <div v-else>
      <div v-for="(node, index) in nodes" :key="node.id" class="mb-4">
        <!-- Root Level Node -->
        <TreeNode :node="node" />
      </div>
    </div>
  </div>
</template>
