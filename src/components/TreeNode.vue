<script setup lang="ts">
import { defineProps, defineEmits, ref } from "vue";
import { APIService } from "../services/ApiService.ts";
import API_ENDPOINTS from "../utils/endpoints.ts";

const props = defineProps({
  node: {
    type: Object,
    required: true,
  },
  visible: {
    type: Boolean,
    default: true, // Default value for visible
  },
});

const isLoading = ref(false);
const hasChildren = ref<boolean>(true);

// Function to handle toggling a node
const toggleNode = async (node: any) => {
  if (!node.isOpen) {
    try {
      isLoading.value = true;

      const data = await APIService.request({
        endpoint: `${API_ENDPOINTS.getAllNodeWithoutChildren}?parentId=${node.id}`,
        method: "GET",
        setLoading: (loading: boolean) => (isLoading.value = loading),
        setterFunction: (data: any) => {
          node.children = data.children || [];
          node.isOpen = true;
        },
      });
      hasChildren.value = node.children.length > 0;

      await fetchChildren(node);
    } catch (error) {
      console.error("Error fetching node details:", error);
      hasChildren.value = false;
    } finally {
      isLoading.value = false;
    }
  } else {
    node.isOpen = !node.isOpen;
  }
};

// Function to fetch children dynamically
const fetchChildren = async (node: any) => {
  try {
    isLoading.value = true;
    const childrenData = await APIService.request({
      endpoint: `${API_ENDPOINTS.getAllNodeWithoutChildren}?parentId=${node.id}`,
      method: "GET",
      setLoading: (loading: boolean) => (isLoading.value = loading),
      setterFunction: (data: any) => {
        node.children = data;
      },
    });
  } catch (error) {
    console.error("Error fetching children data:", error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div v-if="visible" class="space-y-2">
    <!-- Node Header -->
    <div class="flex items-center cursor-pointer" @click="toggleNode(node)">
      <span class="mr-2">
        <svg
          v-if="node.isOpen && hasChildren"
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 transform rotate-90"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 15l7-7 7 7"
          />
        </svg>
      </span>
      <span class="font-medium text-gray-100">{{ node.label }}</span>
    </div>

    <!-- Children -->
    <div v-if="node.isOpen" class="ml-6">
      <div v-if="isLoading" class="flex justify-center items-center py-4">
        <div
          class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-400"
        ></div>
      </div>
      <TreeNode
        v-else
        v-for="(child, idx) in node.children"
        :key="child.id"
        :node="child"
        :visible="child.visible"
      />
    </div>
  </div>
</template>
