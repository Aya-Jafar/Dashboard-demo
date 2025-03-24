<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import Button from "@components/common/Button.vue";
import TreeNode from "@components/dynamic-tree/TreeNode.vue";
import CreateNodeModal from "@components/dynamic-tree/CreateNodeModal.vue"; // Modal for creating new nodes
import { useDynamicTreeStore } from "@stores/dyanmicTree";
import NodeDetailsModal from "@components/dynamic-tree/NodeDetailsModal.vue";
import { useI18n } from "vue-i18n";
import type { Node } from "@stores/dyanmicTree";

// Use the store
const store = useDynamicTreeStore();
const { locale } = useI18n();

// Modal visibility states
const isCreateNodeModalVisible = ref(false);
const selectedParentId = ref<string | null>(null);

// Modal visibility state
const isDetailsModalVisible = ref(false);

// Selected node data for the modal
const selectedNode = ref(null);

// Function to handle creating a new node
const handleCreateNode = (parentId: string | null) => {
  selectedParentId.value = parentId ?? null; // Set the parent ID
  isCreateNodeModalVisible.value = true; // Show the modal
};

// Watch for changes in the search label and trigger search
watch(
  () => store.searchLabel,
  (newLabel) => {
    store.currentPage = 1; // Reset to first page on new search
    store.fetchMainData(store.currentPage, newLabel).then(() => {
      // Only toggle nodes after data is loaded
      store.toggleNodesBySearch(newLabel);
    });
  },
  { immediate: true } // Run this watcher immediately on component mount
);

// Fetch data when component is mounted
onMounted(() => {
  store.fetchMainData(store.currentPage, store.searchLabel);
});

// Handle next page click
const goToNextPage = () => {
  if (store.currentPage < store.totalPages) {
    store.currentPage++;
    store.fetchMainData(store.currentPage, store.searchLabel);
  }
};

// Handle previous page click
const goToPreviousPage = () => {
  if (store.currentPage > 1) {
    store.currentPage--;
    store.fetchMainData(store.currentPage, store.searchLabel);
  }
};

const showNodeDetails = (node: any) => {
  selectedNode.value = node; // Set the selected node data
  isDetailsModalVisible.value = true; // Show the modal
};

const handleNodeCreate = (newNode: Node) => {
  // Add the new node to the tree (assuming you have a store method for this)
  store.add({
    label: newNode.label,
    parentId: newNode.parentId,
    createdAt: new Date().getTime(),
    numberOfEmployees: newNode.numberOfEmployees,
    description: newNode.description,
  });
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
    <div class="flex justify-between items-end mb-10 py-4">
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

    <!-- Loading State -->
    <div v-if="store.isLoading" class="flex justify-center items-center py-8">
      <div
        class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F2CE00]"
      ></div>
    </div>

    <!-- Tree Rendering -->
    <div v-else>
      <div
        v-for="(node) in store.nodes"
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
          @node-move="store.handleNodeMove"
        />
      </div>

      <!-- Pagination Controls -->
      <div :dir="isRTL ? 'rtl' : 'ltr'">
        <div class="flex justify-center mt-8">
          <button
            :disabled="store.currentPage === store.totalPages"
            @click="goToNextPage"
            class="px-4 py-2 bg-slate-800 text-white hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            :class="{
              'rounded-r': isRTL,
              'rounded-l': !isRTL,
            }"
          >
            {{ isRTL ? "التالي" : "Next" }}
          </button>
          <span class="px-4 py-2 bg-slate-800 text-white">
            {{
              isRTL
                ? `صفحة ${store.currentPage} من ${store.totalPages}`
                : `Page ${store.currentPage} of ${store.totalPages}`
            }}
          </span>
          <button
            :disabled="store.currentPage === 1"
            @click="goToPreviousPage"
            class="px-4 py-2 bg-slate-800 text-white hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            :class="{
              'rounded-l': isRTL,
              'rounded-r': !isRTL,
            }"
          >
            {{ isRTL ? "السابق" : "Previous" }}
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
