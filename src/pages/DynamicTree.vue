<script setup lang="ts">
import { ref, watch, computed, watchEffect, nextTick } from "vue";
import Button from "@components/common/Button.vue";
import TreeNode from "@components/dynamic-tree/TreeNode.vue";
import CreateNodeModal from "@components/dynamic-tree/CreateNodeModal.vue";
import { useDynamicTreeStore } from "@stores/dyanmicTree";
import NodeDetailsModal from "@components/dynamic-tree/NodeDetailsModal.vue";
import Loading from "@/components/common/Loading.vue";
import type { Node } from "@stores/dyanmicTree";
import { useVirtualList, useInfiniteScroll } from "@vueuse/core";
import { debounce } from "@/utils/helpers";

// Store and states
const store = useDynamicTreeStore();
const isOnline = ref(navigator.onLine);
const selectedParentId = ref<string | null>(null);
const selectedNode = ref<Node | null>(null);

// Modal visibility states
const isCreateNodeModalVisible = ref(false);
const isDetailsModalVisible = ref(false);
const listEndRef = ref<HTMLElement | null>(null);

// Virtualization setup
const {
  list: virtualNodes,
  containerProps,
  wrapperProps,
} = useVirtualList(
  computed(() => store.nodes),
  {
    itemHeight: 75,
  }
);

// Function to handle creating a new node
const handleCreateNode = (parentId: string | null) => {
  selectedParentId.value = parentId;
  isCreateNodeModalVisible.value = true;
};

// Debounced search handler
const handleSearch = debounce(async (newLabel: string) => {
  if (!isOnline.value) return;

  store.currentPage = 1;
  store.searchLabel = newLabel;

  try {
    await store.fetchMainData(store.currentPage, newLabel);
    // Ensure nodes are toggled after data is fully loaded
    nextTick(() => {
      store.toggleNodesBySearch(newLabel);
    });
  } catch (error) {
    console.error("Search failed:", error);
  }
}, 300); // 300ms delay

// Watch for search changes with debounce
watch(
  () => store.searchLabel,
  (newLabel) => {
    handleSearch(newLabel);
  },
  { immediate: true }
);

// watch(
//   () => store.searchLabel,
//   (newLabel) => {
//     if (isOnline.value) {
//       store.currentPage = 1; // Reset to first page on new search
//       store.fetchMainData(store.currentPage, newLabel).then(() => {
//         // Only toggle nodes after data is loaded
//         store.toggleNodesBySearch(newLabel);
//       });
//     }
//   },
//   { immediate: true } // Run this on component mount
// );

//  Load More Data
const loadMore = () => {
  if (isOnline.value && store.currentPage < store.totalPages) {
    store.currentPage++;
    store.fetchMainData(store.currentPage, store.searchLabel);
  }
};

useInfiniteScroll(listEndRef, loadMore, { distance: 10 });

// Node details handler
const showNodeDetails = (node: Node) => {
  selectedNode.value = node;
  isDetailsModalVisible.value = true;
};

// Node creation handler
const handleNodeCreate = async (newNode: Node) => {
  if (isOnline.value) {
    await store.add({
      ...newNode,
      createdAt: new Date().getTime(),
    });
  }
  isCreateNodeModalVisible.value = false;
};
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

    <!-- Offline State -->
    <div v-if="!isOnline" class="flex items-center justify-center py-10">
      <p class="text-2xl text-center">
        {{ $t("connection_error") }}
      </p>
    </div>

    <!-- Loading State -->
    <div v-else-if="store.isLoading && store.currentPage === 1">
      <Loading />
    </div>

    <!-- Empty State -->
    <div
      v-else-if="!store.isLoading && store?.nodes?.length === 0"
      class="flex justify-center items-center py-8"
    >
      {{ $t("noDepartmentsAvailable") }}
    </div>

    <!-- Virtualized Tree -->
    <div v-else>
      <div v-bind="containerProps" class="h-screen">
        <div v-bind="wrapperProps">
          <div
            v-for="node in virtualNodes"
            :key="node.data.id"
            class="mb-4 p-4 bg-slate-900 rounded-lg shadow-md tree-node"
          >
            <TreeNode
              :node="node.data"
              :visible="node.data.visible !== false"
              @toggle="store.toggleNodeVisibility(node.data.id)"
              @show-details="showNodeDetails"
              @create-node="handleCreateNode"
              @node-move="store.moveNode"
            />
          </div>
        </div>
      </div>

      <!-- Lazy Load Trigger -->
      <div ref="listEndRef" class="h-10 flex justify-center items-center">
        <Loading v-if="store.isLoading && store.currentPage > 1" />
      </div>
    </div>
  </div>

  <!-- Modals -->
  <CreateNodeModal
    v-if="isCreateNodeModalVisible"
    :parentId="selectedParentId"
    @close="isCreateNodeModalVisible = false"
    @submit="handleNodeCreate"
  />
  <NodeDetailsModal
    v-if="isDetailsModalVisible && selectedNode"
    :nodeData="selectedNode"
    @close="isDetailsModalVisible = false"
  />
</template>

<style scoped></style>
