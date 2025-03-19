import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { APIService } from "../services/ApiService.ts";
import API_ENDPOINTS from "../utils/endpoints.ts";

export const useDynamicTreeStore = defineStore("tree-node", () => {
  const isLoading = ref(false);
  const nodes = ref<any[]>([]);
  const currentPage = ref(1); // Track the current page
  const pageSize = ref(10); // Number of items per page (limit)
  const searchLabel = ref(""); // Search input for node label
  const totalItems = ref(20); // Total items

  // Calculate total pages based on total items and page size
  const totalPages = computed(() =>
    Math.ceil(totalItems.value / pageSize.value)
  );

  // Fetch data with dynamic search
  const fetchData = async (page: number, label: string = "") => {
    try {
      isLoading.value = true;
      const data = await APIService.request({
        endpoint: API_ENDPOINTS.getAllNodeWithoutChildren,
        method: "GET",
        pathParams: `?parentId=null&page=${page}&limit=${
          pageSize.value
        }&label=${encodeURIComponent(label)}`,
        setLoading: (loading: boolean) => (isLoading.value = loading),
        setterFunction: (data: any) => {
          nodes.value = data;
        },
      });
      console.log(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      isLoading.value = false;
    }
  };

  // Toggle the visibility of nodes
  const toggleNodeVisibility = (nodeId: string) => {
    const node = nodes.value.find((node: any) => node.id === nodeId);
    if (node) {
      node.visible = !node.visible;
    }
  };

  // Recursive function to open or close nodes based on the search label
  const toggleNodesBySearch = (label: string) => {
    nodes.value.forEach((node) => {
      if (label === "") {
        node.isOpen = false;
      } else if (node.label.toLowerCase().includes(label.toLowerCase())) {
        node.isOpen = true;
      }
    });
  };

  return {
    isLoading,
    nodes,
    currentPage,
    pageSize,
    searchLabel,
    totalItems,
    totalPages,
    fetchData,
    toggleNodeVisibility,
    toggleNodesBySearch,
  };
});
