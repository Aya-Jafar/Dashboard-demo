<script setup lang="ts">
import { onMounted } from "vue";
import { APIService } from "../services/ApiService.ts";
import Button from "../components/Button.vue";

const handleAction = () => {
  console.log("newww");
};

// Call the APIService.request method with the given options
async function fetchData() {
  try {
    const data = await APIService.request({
      endpoint: "/mock-api/dynamic-tree",
      method: "GET",
      pathParams: "?page=2&limit=2", // Query parameters for the request
    });

    console.log(data); // Log the response data to the console
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
onMounted(() => {
  fetchData();
});
</script>

<template>
  <div class="flex justify-between">
    Task 1 will be here
    <Button :loading="false" :action="handleAction" class="w-30"> New </Button>
  </div>
</template>
