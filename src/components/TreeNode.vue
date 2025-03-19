<script setup lang="ts">
import { defineProps, defineEmits, ref } from "vue";
import { preprocessNodeID } from "../utils/helpers.ts";
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

// Function to handle toggling a node
const toggleNode = async (node: any) => {
  if (!node.isOpen) {
    try {
      isLoading.value = true;

      const data = await APIService.request({
        endpoint: `${API_ENDPOINTS.getAllTreeNode}/${preprocessNodeID(node.id)}`,
        method: "GET",
        setLoading: (loading: boolean) => (isLoading.value = loading),
        setterFunction: (data: any) => {
          node.children = data.children || [];
          node.isOpen = true;
        },
      });

      if (node.children && node.children.length === 0) {
        await fetchChildren(node);
      }
    } catch (error) {
      console.error("Error fetching node details:", error);
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
      endpoint: `${API_ENDPOINTS.getAllTreeNode}/${preprocessNodeID(node.id)}`,
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
  <div v-if="visible"> <!-- Only render if visible is true -->
    <!-- Show toggle and fetch node details on click -->
    <div class="flex items-center cursor-pointer mb-3">
      <span @click="toggleNode(node)" class="mr-2">
        <svg
          v-if="node.isOpen"
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
      <span class="font-medium">{{ node.label }}</span>
    </div>

    <!-- Recursively render children if the node is open -->
    <div v-if="node.isOpen" class="ml-6">
      <!-- Show loading spinner when isLoading is true -->
      <div v-if="isLoading" class="flex justify-center items-center">
        <div
          class="spinner-border animate-spin inline-block w-8 h-8 border-4 border-blue-500 rounded-full"
          role="status"
        ></div>
      </div>

      <!-- Render the children nodes if not loading -->
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
