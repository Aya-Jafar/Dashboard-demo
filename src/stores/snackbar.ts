import { defineStore } from "pinia";
import { ref } from "vue";

export const useSnackbarStore = defineStore("snackbar", () => {
  const visible = ref(false);
  const message = ref("");
  const type = ref<"info" | "success" | "error">("info");


  const showSnackbar = (
    newMessage: string,
    newType: "info" | "success" | "error" = "info"
  ) => {
    message.value = newMessage;
    type.value = newType;
    visible.value = true;

    // Auto-hide after 3 seconds
    setTimeout(() => {
      visible.value = false;
    }, 3000);
  };

  return {
    visible,
    message,
    type,
    showSnackbar,
  };
});
