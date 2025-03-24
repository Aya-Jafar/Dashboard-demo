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
const description = ref("");
const numberOfEmployees = ref<number | null>(null);
const isInputValid = ref(true); 
const errorMessages = ref<Record<string, string>>({}); 

// Reset and emit new node data
const resetAndEmit = (newNode: {
  label: string;
  parentId: string | null;
  description: string;
  numberOfEmployees: number | null;
}) => {
  emit("submit", newNode); // Emit the new node data
  newNodeLabel.value = ""; // Clear the input
  description.value = ""; // Clear the description
  numberOfEmployees.value = null; // Clear the number of employees
  emit("close"); // Close the modal
};

// Validate the form
const validateForm = () => {
  const errors: Record<string, string> = {};

  // Validate label
  if (!newNodeLabel.value.trim()) {
    errors.label = "Node label cannot be empty.";
  }

  // Validate description
  if (!description.value.trim()) {
    errors.description = "Description cannot be empty.";
  }

  // Validate number of employees
  if (numberOfEmployees.value === null || numberOfEmployees.value < 0) {
    errors.numberOfEmployees =
      "Number of employees must be a non-negative number.";
  }

  // Update error messages
  errorMessages.value = errors;

  // Return true if there are no errors
  return Object.keys(errors).length === 0;
};

// Handle form submission
const handleSubmit = () => {
  // Validate the form
  if (!validateForm()) {
    isInputValid.value = false;
    return; // Stop submission if the form is invalid
  }

  // If the form is valid, proceed with submission
  isInputValid.value = true;

  const newNode = {
    label: newNodeLabel.value,
    parentId: props.parentId,
    description: description.value,
    numberOfEmployees: numberOfEmployees.value,
  };

  resetAndEmit(newNode);
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
        {{ $t("createNewDepartment") }}
      </h2>

      <!-- Form for Creating a New Node -->
      <form @submit.prevent="handleSubmit">
        <!-- Node Label Input -->
        <input
          v-model="newNodeLabel"
          type="text"
          :placeholder="$t('enterNodeLabel')"
          class="w-full p-2 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 mb-2"
          :class="{ 'border-red-400': errorMessages.label }"
          aria-label="Node label input"
        />
        <!-- Error message for label -->
        <p v-if="errorMessages.label" class="text-red-400 text-sm mb-4">
          {{ errorMessages.label }}
        </p>

        <!-- Number of Employees Input -->
        <input
          v-model.number="numberOfEmployees"
          type="number"
          :placeholder="$t('enterNumberOfEmployees')"
          class="w-full p-2 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 mb-2"
          :class="{ 'border-red-400': errorMessages.numberOfEmployees }"
          aria-label="Number of employees input"
        />
        <!-- Error message for number of employees -->
        <p
          v-if="errorMessages.numberOfEmployees"
          class="text-red-400 text-sm mb-4"
        >
          {{ errorMessages.numberOfEmployees }}
        </p>

        <!-- Description Input -->
        <textarea
          v-model="description"
          :placeholder="$t('enterDescription')"
          class="w-full p-2 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 mb-2"
          :class="{ 'border-red-400': errorMessages.description }"
          aria-label="Description input"
        ></textarea>
        <!-- Error message for description -->
        <p v-if="errorMessages.description" class="text-red-400 text-sm mb-4">
          {{ errorMessages.description }}
        </p>

        <!-- Buttons -->
        <div class="flex justify-end">
          <button
            type="button"
            @click="emit('close')"
            :aria-label="$t('cancel')"
            class="mr-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
          >
            {{ $t("cancel") }}
          </button>
          <button
            type="submit"
            :aria-label="$t('createNode')"
            class="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            {{ $t("create") }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
</style>