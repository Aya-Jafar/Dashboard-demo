<script setup lang="ts">
import { defineProps, defineEmits, ref, onMounted, watch, computed } from "vue";
import { APIService } from "../../services/ApiService.ts";
import API_ENDPOINTS from "../../utils/endpoints.ts";
import Snackbar from "../common/Snackbar.vue";
import { useDynamicTreeStore, type Node } from "../../stores/dyanmicTree.ts";
import { filterByExactParentID } from "../../utils/helpers.ts";
import OpenIcon from "./OpenIcon.vue";
import Icon from "../common/Icon.vue";
import { useI18n } from "vue-i18n";

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

const emit = defineEmits(["show-details", "create-node", "node-move"]);
const store = useDynamicTreeStore();
const { t } = useI18n();
const noChildrenText = ref<null | string>(null);

const isLoading = ref(false);

// Function to handle toggling a node
const toggleNode = async (node: any) => {
  if (isLoading.value) return; // Disable toggle if loading

  if (!node.isOpen) {
    try {
      isLoading.value = true;

      const data = await APIService.request({
        endpoint: `${API_ENDPOINTS.DEPARTMENTS}?parentId=${node.id}`,
        method: "GET",
        setLoading: (loading: boolean) => (isLoading.value = loading),
        setError: (message) => {
          node.isOpen = true;
          noChildrenText.value = message;
        },
        setterFunction: (data: any) => {
          /**
           * The mock API's path parameter is NOT filtering with the exact ID
           * So if ?parentId=2/ the response conatins children with any parentId
           * that contain "2" like "dept-1-2-1-1"
           * That's why we need the filtering here
           *  */
          node.children = filterByExactParentID(data, node.id);
          if (node.children.length === 0) {
            noChildrenText.value = t("noSubSectionsAvailable");
          }
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
const onDragStart = (event: DragEvent, nodeId: string, parentId: string) => {
  event.dataTransfer?.setData("nodeId", nodeId);
  event.dataTransfer?.setData("parentId", parentId);
};

const onDragOver = (event: DragEvent) => {
  event.preventDefault();
};

const onDrop = (event: DragEvent, targetNodeId: string) => {
  const nodeId = event.dataTransfer?.getData("nodeId");
  const parentId = event.dataTransfer?.getData("parentId");
  if (nodeId && parentId) {
    emit("node-move", { nodeId, parentId, targetNodeId });
  }
};

const matchesSearch = computed(() => {
  if (!store.searchLabel) return true;
  return props.node.label
    .toLowerCase()
    .includes(store.searchLabel.toLowerCase());
});

// In TreeNode.vue
watch(
  () => store.searchLabel,
  async (newSearch) => {
    if (newSearch && matchesSearch.value) {
      // Automatically expand when node matches search
      await toggleNode(props.node);
    }
  },
  { immediate: true }
);
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
      role="treeitem"
      :aria-expanded="node.isOpen ? 'true' : 'false'"
      :aria-labelledby="`node-label-${node.id}`"
    >
      <div
        class="flex items-center cursor-pointer"
        @click="toggleNode(node)"
        role="button"
        :aria-label="`Toggle ${node.label}`"
        :disabled="isLoading"
      >
        <span class="mr-2">
          <OpenIcon :isOpen="node.isOpen" />
        </span>

        <span class="font-medium text-gray-100">{{ node.label }}</span>
      </div>

      <!-- Buttons for Details and Create New Node -->
      <div class="flex items-center space-x-2">
        <!-- Eye Icon Button for Details -->
        <button
          @click.stop="showDetails"
          :aria-label="`View details of ${node.label}`"
          class="px-2 py-1 text-white rounded hover:bg-[#F2CE00] focus:outline-none"
        >
          <Icon
            iconClass="h-6 w-6 text-blue-500 text-white"
            strokeWidth="1.5"
            :d="'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z'"
          />
        </button>

        <!-- Plus Icon Button for Creating New Node -->
        <button
          @click.stop="createNode"
          class="px-2 py-1 text-white rounded hover:bg-[#F2CE00] focus:outline-none"
          :aria-label="`Create new node under ${node.label}`"
        >
          <Icon
            :d="'M12 4v16m8-8H4'"
            iconClass="h-6 w-6 text-white"
            strokeWidth="1.5"
          />
        </button>
      </div>
    </div>

    <!-- Children -->
    <div
      v-if="node.isOpen"
      class="ml-6 "
      role="group"
      :aria-labelledby="`node-label-${node.id}`"
    >
      <div v-if="isLoading" class="flex justify-center items-center py-4">
        <div
          aria-label="Loading"
          class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-400"
        ></div>
      </div>
      <div v-else-if="noChildrenText !== null">{{ $t(noChildrenText) }}</div>
      <TreeNode
        v-else
        v-for="(child, idx) in node.children"
        :key="child.id"
        :node="child"
        :visible="child.visible"
        @show-details="emit('show-details', $event)"
        @node-move="emit('node-move', $event)"
        class="!cursor-grab"
      />
    </div>
  </div>
</template>
