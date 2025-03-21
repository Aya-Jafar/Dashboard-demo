<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

const props = defineProps({
  parentId: {
    type: [String, null],
    default: null,
  },
});
// Reactive states
const modalRef = ref<HTMLElement | null>(null);
const emit = defineEmits(["close", "submit"]);
const newNodeLabel = ref("");


const resetAndEmit = (newNode: { label: string; parentId: string | null }) => {
  emit("submit", newNode); // Emit the new node data
  newNodeLabel.value = ""; // Clear the input
  emit("close"); // Close the modal
};

// Handle form submission
const handleSubmit = () => {
  if (newNodeLabel.value.trim() && props.parentId !== null) {
    const newNode = {
      label: newNodeLabel.value,
      parentId: props.parentId, // Include the parent ID
    };
    resetAndEmit(newNode);
  } else {
    // Handle Root nodes
    const newNode = {
      label: newNodeLabel.value,
      parentId: null,
    };
    resetAndEmit(newNode);
  }
};


// Click outside handler
const handleClickOutside = (event: MouseEvent) => {
  if (modalRef.value && !modalRef.value.contains(event.target as Node)) {
    emit("close");
  }
};

// Add event listener when the component is mounted
onMounted(() => {
  // Use a slight delay to ensure the modal is fully rendered before adding the event listener
  setTimeout(() => {
    document.addEventListener("click", handleClickOutside);
  }, 0);
});

// Remove event listener when the component is unmounted
onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <div
    class="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50"
  >
    <div class="bg-gray-800 rounded-lg p-6 w-96" ref="modalRef">
      <h2 class="text-xl font-semibold mb-4 text-white">
        Create New Department
      </h2>

      <!-- Form for Creating a New Node -->
      <form @submit.prevent="handleSubmit">
        <input
          v-model="newNodeLabel"
          type="text"
          placeholder="Enter node label..."
          class="w-full p-2 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 mb-4"
        />
        <div class="flex justify-end">
          <button
            type="button"
            @click="emit('close')"
            class="mr-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* Add any additional styles here */
</style>
