<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useDynamicTreeStore } from "../../stores/dyanmicTree.ts";


// Define props to accept node data
const props = defineProps({
  nodeData: {
    type: Object,
    default: () => ({
      label: "",
      departmentDescription: "",
      numberOfEmployees: 0,
    }),
  },
});

// Use the store
const nodeStore = useDynamicTreeStore();

// New node label input (if needed for editing)
const newNodeLabel = ref(props.nodeData.label);

// Emit events to close the modal
const emit = defineEmits(["close"]);

// Ref for the modal container
const modalRef = ref<HTMLElement | null>(null);

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
    <div ref="modalRef" class="bg-gray-800 rounded-lg p-6 w-96">
      <h2 class="text-xl font-bold mb-4 text-white">{{ nodeData.label }}</h2>

      <!-- Display Node Data -->
      <div class="mb-4">
        <p class="text-white">
          <strong>Description:</strong>
          {{
            nodeData.departmentDescription ||
            "This department is responsible for overseeing various projects, ensuring smooth operations, and coordinating between different teams. It plays a crucial role in strategic planning and execution, driving efficiency and innovation within the organization."
          }}
        </p>
        <br />
        <p class="text-white">
          <strong>Number of Employees: </strong>
          <span class="text-[#F2CE00] font-bold">
            {{ nodeData.numberOfEmployees || 10 }}
          </span>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
