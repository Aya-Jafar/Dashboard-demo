<script setup lang="ts">
/**
 * Recursive Tree node component with drag-and-drop, search highlighting, and expand/collapse
 * @prop {Object} node - Node data with children
 * @prop {Boolean} [visible=true] - Controls visibility
 * @emits show-details - When details button clicked
 * @emits create-node - When create button clicked (nodeId)
 * @emits node-move - On drag-and-drop (nodeId, targetNodeId, parentId)
 *
 * @example <TreeNode :node="treeData" @node-move="handleMove" />
 */

 
import { defineProps, defineEmits, ref, watch, computed } from "vue";
import Snackbar from "@components/common/Snackbar.vue";
import { useDynamicTreeStore } from "@stores/dyanmicTree";
import OpenIcon from "@/components/dynamic-tree/OpenIcon.vue";
import Icon from "@/components/common/Icon.vue";
import ICONS from "@/utils/icons";

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

// Reactive states and emits
const emit = defineEmits(["show-details", "create-node", "node-move"]);
const store = useDynamicTreeStore();
const noChildrenText = ref<null | string>(null);
const isLoading = ref(false);
const isOnline = ref(navigator.onLine);

// Function to handle toggling a node
const toggleNode = async (node: any) => {
  if (isLoading.value) return; // Disable toggle if loading

  if (!node.isOpen) {
    try {
      await store.openNode(node, noChildrenText, isLoading);
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
const showDetails = () => emit("show-details", props.node);

// Function to handle creating a new node
const createNode = () => emit("create-node", props.node.id);

// Drag-and-drop handlers
const onDragStart = (event: DragEvent) => {
  event.dataTransfer?.setData("nodeId", props.node.id);
  event.dataTransfer?.setData("parentId", props.node.parentId ?? "null");
  event.dataTransfer?.setData("type", "node");
  event.stopPropagation();
};

const onDragOver = (event: DragEvent) => {
  // Prevent the default drag behavior
  // The default behavior for dragover events in HTML5 drag-and-drop is to not allow dropping
  event.preventDefault();
};

const onDrop = (event: DragEvent) => {
  (event.currentTarget as HTMLElement)?.classList.remove("drop-target");
  event.preventDefault();
  event.stopPropagation();

  const nodeId = event.dataTransfer?.getData("nodeId");
  const parentId = event.dataTransfer?.getData("parentId");

  if (nodeId) {
    emit("node-move", {
      nodeId,
      targetNodeId: props.node.id,
      newParentId: props.node.parentId ?? null,
      oldParentId: parentId === "null" ? null : parentId,
    });
  }
};

const matchesSearch = computed(() => {
  if (!store.searchLabel) return true;
  return props.node.label
    .toLowerCase()
    .includes(store.searchLabel.toLowerCase());
});

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
const isSearchMatch = computed(() => {
  return (
    store.searchLabel &&
    props.node.label.toLowerCase().includes(store.searchLabel.toLowerCase())
  );
});
</script>

<template>
  <Snackbar />
  <div v-if="visible" class="space-y-2">
    <!-- Node Header -->
    <div
      class="flex items-center justify-between cursor-grab"
      draggable="true"
      @dragstart="onDragStart"
      @dragover="onDragOver($event)"
      @drop.stop="onDrop"
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

        <span
          class="font-medium text-gray-100"
          :class="{
            'bg-yellow-500/20 border-l-4 border-yellow-500 px-2': isSearchMatch,
          }"
          >{{ node.label }}</span
        >
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
            :d="ICONS.EYE"
          />
        </button>

        <!-- Plus Icon Button for Creating New Node -->
        <button
          @click.stop="createNode"
          class="px-2 py-1 text-white rounded hover:bg-[#F2CE00] focus:outline-none"
          :aria-label="`Create new node under ${node.label}`"
        >
          <Icon
            :d="ICONS.PLUS"
            iconClass="h-6 w-6 text-white"
            strokeWidth="1.5"
          />
        </button>
      </div>
    </div>

    <!-- Children -->
    <div
      v-if="node.isOpen"
      class="ml-6"
      role="group"
      :aria-labelledby="`node-label-${node.id}`"
    >
      <div v-if="isLoading" class="flex justify-center items-center py-4">
        <div
          aria-label="Loading"
          class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-400"
        ></div>
      </div>
      <div v-else-if="noChildrenText !== null && isOnline">
        {{ $t(noChildrenText) }}
      </div>
      <TreeNode
        v-else
        v-for="child in node.children"
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
