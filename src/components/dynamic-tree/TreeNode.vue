<script setup lang="ts">
import { defineProps, defineEmits, ref } from "vue";
import { APIService } from "../../services/ApiService.ts";
import API_ENDPOINTS from "../../utils/endpoints.ts";
import Snackbar from "../Snackbar.vue";
import { useDynamicTreeStore, type Node } from "../../stores/dyanmicTree.ts";
import { filterByExactParentID } from "../../utils/helpers.ts";

const props = defineProps({
  node: {
    type: Object,
    required: true,
  },
  visible: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["show-details", "create-node", "node-move"]); // Add create-node event
const store = useDynamicTreeStore();

const isLoading = ref(false);
// TODO: Add childrenCount to each object in json
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
          /**
           * The mock API's path parameter is NOT filtering with the exact ID
           * So if ?parentId=2/ the response conatins children with any parentId
           * that contain "2" like "dept-1-2-1-1"
           * That's why we need the filtering here
           *  */
          node.children = filterByExactParentID(data, node.id);
          node.isOpen = true;
        },
      });
    } catch (error) {
      console.error("Error fetching node details:", error);
    } finally {
      isLoading.value = false;
    }
  } else {
    node.isOpen = !node.isOpen;
  }
};

// Function to show node details
const showDetails = () => emit("show-details", props.node); // Emit the node data to the parent

// Function to handle creating a new node
const createNode = () => emit("create-node", props.node.id); // Emit the parent node's ID

// Drag-and-drop handlers
// Drag Start Handler
const onDragStart = (event: DragEvent, nodeId: string, parentId: string) => {
  event.dataTransfer?.setData("nodeId", nodeId); // Save dragged node's ID
  event.dataTransfer?.setData("parentId", parentId); // Save dragged node's parent ID
};

// Drag Over Handler (Allow dropping)
const onDragOver = (event: DragEvent) => {
  event.preventDefault(); // Allow dropping
};

// Drop Handler (Reorder children based on drop)
const onDrop = async (event: DragEvent, targetNodeId: string) => {
  console.log("Node dropped:", targetNodeId);
  event.preventDefault();

  const draggedNodeId = event.dataTransfer?.getData("nodeId"); // Get the dragged node's ID
  const draggedNodeParentId = event.dataTransfer?.getData("parentId"); // Get its original parent ID

  if (!draggedNodeId || draggedNodeId === targetNodeId) return; // Avoid self-drop

  console.log("Dragged Node ID:", draggedNodeId);
  console.log("Target Node ID:", targetNodeId);
  console.log("Store Nodes:", store.nodes);

  const draggedNode = store.nodes.find((node) => {
    console.log("Node", node.id, "dragged", draggedNodeId);
    return node.id === draggedNodeId;
  });

  const targetNode = store.nodes.find((node) => {
    console.log("Node", node.id, "target", targetNodeId);
    return node.id === targetNodeId;
  });

  console.log("Target Node:", targetNode);
  console.log("Dragged Node:", draggedNode);

  if (!draggedNode || !targetNode) {
    console.error("Dragged node or target node not found");
    return;
  }

  console.log("🔴 Old Parent Node:", draggedNodeParentId);
  console.log("🟢 Dragged Node:", draggedNode);
  console.log("🔵 Target Node (New Position):", targetNode);

  // Update the dragged node's parentId to match the target node's parentId
  draggedNode.parentId = targetNode.parentId;

  // Force reactivity by reassigning the nodes array
  store.nodes = [...store.nodes];
};
</script>

<template>
  <Snackbar />
  <div v-if="visible" class="space-y-2">
    <!-- Node Header -->
    <div
      class="flex items-center justify-between"
      draggable="true"
      @dragstart="onDragStart($event, node.id, node.parentId)"
      @dragover="onDragOver($event)"
      @drop.stop="onDrop($event, node.id)"
    >
      <div class="flex items-center cursor-pointer" @click="toggleNode(node)">
        <span class="mr-2">
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
        <span class="font-medium text-gray-100">{{ node.label }}</span>
      </div>

      <!-- Buttons for Details and Create New Node -->
      <div class="flex items-center space-x-2">
        <!-- Eye Icon Button for Details -->
        <button
          @click.stop="showDetails"
          class="px-2 py-1 text-white rounded hover:bg-[#F2CE00] focus:outline-none"
        >
          <svg
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
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"
            />
          </svg>
        </button>

        <!-- Plus Icon Button for Creating New Node -->
        <button
          @click.stop="createNode"
          class="px-2 py-1 text-white rounded hover:bg-[#F2CE00] focus:outline-none"
        >
          <svg
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
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>
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
        @show-details="emit('show-details', $event)"
        @create-node="emit('create-node', $event)"
      />
    </div>
  </div>
</template>
