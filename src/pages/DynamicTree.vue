<script setup lang="ts">
/**
 * Tree structure component with:
 * - Hierarchical node display
 * - Search, lazy loading, and virtualization
 * - Node/sub-node creation
 * - Drag-and-drop
 * - RTL language support
 *
 * @example <DynamicTree />
 */
import { ref, watch, computed, watchEffect } from "vue";
import Button from "@components/common/Button.vue";
import TreeNode from "@components/dynamic-tree/TreeNode.vue";
import CreateNodeModal from "@components/dynamic-tree/CreateNodeModal.vue";
import { useDynamicTreeStore } from "@stores/dyanmicTree";
import NodeDetailsModal from "@components/dynamic-tree/NodeDetailsModal.vue";
import Loading from "@/components/common/Loading.vue";
import type { Node } from "@stores/dyanmicTree";
import { useInfiniteScroll, useVirtualList } from "@vueuse/core";

// Store and states
const store = useDynamicTreeStore();
const isOnline = ref(navigator.onLine);
const selectedParentId = ref<string | null>(null);
const selectedNode = ref(null);

// Modal visibility states
const isCreateNodeModalVisible = ref(false);
const isDetailsModalVisible = ref(false);

// Virtualization setup and states
const isLoadingMore = ref(false);
const listEndRef = ref<HTMLElement | null>(null);
const hasMore = ref(true);

const {
  list: virtualNodes,
  containerProps,
  wrapperProps,
} = useVirtualList(
  computed(() => store.nodes),
  { itemHeight: 20 }
);

// Function to handle creating a new node
const handleCreateNode = (parentId: string | null) => {
  selectedParentId.value = parentId ?? null;
  isCreateNodeModalVisible.value = true;
};

// Watch for changes in the search label
watch(
  () => store.searchLabel,
  (newLabel) => {
    if (isOnline.value) {
      store.currentPage = 1;
      store.nodes = []; 
      isLoadingMore.value = true;
      store.fetchMainData(store.currentPage, newLabel).finally(() => {
        isLoadingMore.value = false;
      });
    }
  },
  { immediate: true }
);

const loadMore = async () => {
  if (!isOnline.value || !hasMore.value || isLoadingMore.value) {
    return;
  }
  store.currentPage++;
  const previousLength = store.nodes.length;

  try {
    isLoadingMore.value = true;
    await store.fetchMainData(store.currentPage, store.searchLabel);
    isLoadingMore.value = false;
  } catch (error) {
    return;
  }
  // If no new data was added, stop further requests
  if (store.nodes.length === previousLength) {
    hasMore.value = false;
  }
};
// Lazy loading
useInfiniteScroll(listEndRef, loadMore, { distance: 10 });

// Handle showing the details modal
const showNodeDetails = (node: any) => {
  selectedNode.value = node;
  isDetailsModalVisible.value = true;
};

const handleNodeCreate = async (newNode: Node) => {
  if (isOnline.value) {
    await store.add({
      label: newNode.label,
      parentId: newNode.parentId,
      createdAt: new Date().getTime(),
      numberOfEmployees: newNode.numberOfEmployees,
      description: newNode.description,
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

    <div class="flex items-center justify-center py-10" v-if="!isOnline">
      <p class="text-2xl text-center">
        {{ $t("connection_error") }}
      </p>
    </div>

    <!-- Initial Loading State -->
    <div v-if="store.isLoading && store.currentPage === 1">
      <Loading />
    </div>

    <div
      v-else-if="!store.isLoading && store.nodes?.length === 0 && isOnline"
      class="flex justify-center items-center py-8"
    >
      {{ $t("noDepartmentsAvailable") }}
    </div>

    <!-- Virtualized Tree Rendering -->
    <div v-else>
      <div v-bind="containerProps" class="h-screen">
        <div v-bind="wrapperProps">
          <div
            v-for="node in virtualNodes"
            :key="node.data.id"
            class="mb-4 p-4 bg-slate-900 rounded-lg shadow-md"
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
    </div>

    <!-- Lazy Load Trigger -->
    <div class="h-10 flex justify-center items-center" ref="listEndRef">
      <Loading v-if="isLoadingMore && store.currentPage > 1" />
      <p v-else-if="!hasMore" class="text-gray-400">
        {{ $t("noMoreItems") }}
      </p>
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
