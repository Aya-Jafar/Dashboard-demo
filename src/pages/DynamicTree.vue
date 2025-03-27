<script setup lang="ts">
/**
 * Tree structure component with:
 * - Hierarchical node display
 * - Search, pagination, and sorting
 * - Node creation/editing
 * - Drag-and-drop reorganization
 * - RTL language support
 *
 * @example <DynamicTree />
 */

import { ref, onMounted, watch, computed } from "vue";
import Button from "@components/common/Button.vue";
import TreeNode from "@components/dynamic-tree/TreeNode.vue";
import CreateNodeModal from "@components/dynamic-tree/CreateNodeModal.vue";
import { useDynamicTreeStore } from "@stores/dyanmicTree";
import NodeDetailsModal from "@components/dynamic-tree/NodeDetailsModal.vue";
import { useI18n } from "vue-i18n";
import Loading from "@/components/common/Loading.vue";
import type { Node } from "@stores/dyanmicTree";

// Store and states
const store = useDynamicTreeStore();
const { locale } = useI18n();
const isOnline = ref(navigator.onLine);
const selectedParentId = ref<string | null>(null);
const selectedNode = ref(null); // Selected node data for the modal

// Modal visibility states
const isCreateNodeModalVisible = ref(false);
const isDetailsModalVisible = ref(false);

// Function to handle creating a new node
const handleCreateNode = (parentId: string | null) => {
  selectedParentId.value = parentId ?? null; // Set parent ID
  isCreateNodeModalVisible.value = true; // Show the modal
};

// Watch for changes in the search label and trigger search
watch(
  () => store.searchLabel,
  (newLabel) => {
    if (isOnline.value) {
      store.currentPage = 1; // Reset to first page on new search
      store.fetchMainData(store.currentPage, newLabel).then(() => {
        // Only toggle nodes after data is loaded
        store.toggleNodesBySearch(newLabel);
      });
    }
  },
  { immediate: true } // Run this on component mount
);

// Fetch data when component is mounted
onMounted(() => {
  if (isOnline.value) {
    store.fetchMainData(store.currentPage, store.searchLabel);
  }
});

// Handle next page click
const goToNextPage = () => {
  if (isOnline.value) {
    if (store.currentPage < store.totalPages) {
      store.currentPage++;
      store.fetchMainData(store.currentPage, store.searchLabel);
    }
  }
};

// Handle previous page click
const goToPreviousPage = () => {
  if (isOnline.value) {
    if (store.currentPage > 1) {
      store.currentPage--;
      store.fetchMainData(store.currentPage, store.searchLabel);
    }
  }
};
// Handle showing the details modal
const showNodeDetails = (node: any) => {
  selectedNode.value = node;
  isDetailsModalVisible.value = true;
};

const handleNodeCreate = async (newNode: Node) => {
  // Add the new node to the tree
  if (isOnline.value) {
    await store.add({
      label: newNode.label,
      parentId: newNode.parentId,
      createdAt: new Date().getTime(),
      numberOfEmployees: newNode.numberOfEmployees,
      description: newNode.description,
    });
  }
  // Close the modal
  isCreateNodeModalVisible.value = false;
};
const isRTL = computed(() => locale.value === "ar");
</script>

<template>
  <div
    :class="{ 'blur-sm': isCreateNodeModalVisible || isDetailsModalVisible }"
    aria-modal="true"
    aria-labelledby="modal-title"
  >
    <!-- Search and New Button -->
    <div class="flex justify-between flex-wrap items-end mb-10 py-4">
      <input
        v-model.lazy="store.searchLabel"
        type="text"
        aria-label="Node search input"
        :placeholder="$t('search')"
        class="p-2 rounded-md w-80 bg-slate-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
      />
      <Button
        :action="() => handleCreateNode(null)"
        class="w-25 border hover:bg-yellow-500"
      >
        {{ $t("new") }}
      </Button>
    </div>

    <div class="flex items-center justify-center py-10" v-if="!isOnline">
      <p class="text-2xl text-center">
        {{ $t("connection_error") }}
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="store.isLoading">
      <Loading />
    </div>

    <div
      v-else-if="!store.isLoading && store.nodes?.length === 0 && isOnline"
      class="flex justify-center items-center py-8"
    >
      {{ $t("noDepartmentsAvailable") }}
    </div>

    <!-- Tree Rendering -->
    <div v-else>
      <div
        v-for="node in store.nodes"
        :key="node.id"
        class="mb-4 p-4 bg-slate-900 rounded-lg shadow-md"
      >
        <!-- Root Level Node -->
        <TreeNode
          :node="node"
          :visible="node.visible !== false"
          @toggle="store.toggleNodeVisibility(node.id)"
          @show-details="showNodeDetails"
          @create-node="handleCreateNode"
          @node-move="store.moveNode"
        />
      </div>

      <!-- Pagination Controls -->
      <div :dir="isRTL ? 'rtl' : 'ltr'">
        <div class="flex justify-center mt-8">
          <button
            :disabled="store.currentPage === 1"
            @click="goToPreviousPage"
            class="px-4 py-2 bg-slate-800 text-white hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            :class="{
              'rounded-l': !isRTL,
              'rounded-r': isRTL,
            }"
          >
            {{ isRTL ? "السابق" : "Previous" }}
          </button>
          <span class="px-4 py-2 bg-slate-800 text-white">
            {{
              isRTL
                ? `صفحة ${store.currentPage} من ${store.totalPages}`
                : `Page ${store.currentPage} of ${store.totalPages}`
            }}
          </span>
          <button
            :disabled="store.currentPage === store.totalPages"
            @click="goToNextPage"
            class="px-4 py-2 bg-slate-800 text-white hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            :class="{
              'rounded-r': !isRTL,
              'rounded-l': isRTL,
            }"
          >
            {{ isRTL ? "التالي" : "Next" }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Create Node Modal -->
  <CreateNodeModal
    v-if="isCreateNodeModalVisible && selectedParentId !== undefined"
    :parentId="selectedParentId"
    @close="isCreateNodeModalVisible = false"
    @submit="handleNodeCreate"
  />
  <!-- Node Details Modal -->
  <NodeDetailsModal
    v-if="isDetailsModalVisible && selectedNode != null"
    :nodeData="selectedNode"
    @close="isDetailsModalVisible = false"
  />
</template>

<style scoped></style>
