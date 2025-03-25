<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

// Props to accept node data
defineProps({
  nodeData: {
    type: Object,
    default: () => ({
      label: "",
      description: "",
      numberOfEmployees: 0,
    }),
  },
});

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

//  event listener when the component is mounted
onMounted(() => {
  // a slight delay to ensure the modal is fully rendered before adding the event listener
  setTimeout(() => {
    document.addEventListener("click", handleClickOutside);
  }, 0);
});

//  event listener when the component is unmounted
onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <div
    class="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50"
  >
    <div ref="modalRef" class="bg-slate-900 rounded-lg p-6 w-96">
      <h2 class="text-xl font-bold mb-4 text-white">{{ nodeData.label }}</h2>

      <!-- Display Node Data -->
      <div class="mb-4">
        <p class="text-white">
          {{ nodeData.description }}
        </p>
        <br />
        <p class="text-white">
          <strong> {{$t("employeesCount")}}</strong>
          <span class="text-[#F2CE00] font-bold">
            {{ nodeData.numberOfEmployees || 10 }}
          </span>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
