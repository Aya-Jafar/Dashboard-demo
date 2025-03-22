import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { APIService } from "../services/ApiService.ts";
import API_ENDPOINTS from "../utils/endpoints.ts";
import { useSnackbarStore } from "./snackbar.ts";
import { filterByExactParentID } from "../utils/helpers.ts";

interface Node {
  id?: string;
  parentId: string | null;
  label: string;
  createdAt: number;
}

export const useDynamicTreeStore = defineStore("tree-node", () => {
  const isLoading = ref(false);
  const nodes = ref<any[]>([]);
  const currentPage = ref(1); // Track the current page
  const pageSize = ref(10); // Number of items per page (limit)
  const searchLabel = ref(""); // Search input for node label
  const totalItems = ref(20); // Total items

  const snackbarStore = useSnackbarStore();

  // Calculate total pages based on total items and page size
  const totalPages = computed(() =>
    Math.ceil(totalItems.value / pageSize.value)
  );

  // Fetch Initial data (parentId = null)
  const fetchMainData = async (
    page: number,
    label: string = ""
  ): Promise<void> => {
    try {
      isLoading.value = true;

      const data = await APIService.request<Node[]>({
        endpoint: API_ENDPOINTS.getAllNodeWithoutChildren,
        method: "GET",
        pathParams: `?parentId=null&page=${page}&limit=${
          pageSize.value
        }&label=${encodeURIComponent(label)}&sortBy=createdAt&order=desc`,
        setLoading: (loading: boolean) => (isLoading.value = loading),
        setterFunction: (data: any) => {
          nodes.value = data;
        },
      });
    } catch (error) {
      snackbarStore.showSnackbar(`API Error: ${error}`, "error");
    } finally {
      isLoading.value = false;
    }
  };

  // Toggle the visibility of nodes
  const toggleNodeVisibility = (nodeId: string): void => {
    const node = nodes.value.find((node: any) => node.id === nodeId);
    if (node) {
      node.visible = !node.visible;
    }
  };

  // Recursive function to open or close nodes based on the search label
  const toggleNodesBySearch = (label: string): void => {
    nodes.value.forEach((node) => {
      if (label === "") {
        node.isOpen = false;
      } else if (node.label.toLowerCase().includes(label.toLowerCase())) {
        node.isOpen = true;
      }
    });
  };

  const refetch = async (parentId: string | null): Promise<void> => {
    try {
      const data = await APIService.request<Node[]>({
        endpoint: API_ENDPOINTS.getAllNodeWithoutChildren,
        method: "GET",
        pathParams: `?parentId=${parentId}&page=1&limit=${pageSize.value}&sortBy=createdAt&order=desc`, // Fetch the first page
        setLoading: (loading: boolean) => (isLoading.value = loading),
        setterFunction: (data: any) => {
          nodes.value = nodes.value.map((node) => {
            if (node.id === parentId) {
              // If the node is the parent, update its children
              return {
                ...node,
                children: data.filter(
                  (item: Node) => item.parentId === parentId
                ),
                // filterByExactParentID(data,parentId)
              };
            }
            return node; // Otherwise, return the node as is
          });
        },
      });
    } catch (error) {
      snackbarStore.showSnackbar(`API Error: ${error}`, "error");
    }
  };

  /**
   * Sends a POST request to the mock API
   * @param newNode
   * @return the new node with successfull request
   */
  const add = async (newNode: Node): Promise<void> => {
    try {
      isLoading.value = true;
      const response = await APIService.request<Node>({
        endpoint: API_ENDPOINTS.getAllNodeWithoutChildren,
        method: "POST",
        body: newNode,
        setLoading: (loading: boolean) => (isLoading.value = loading),
      });

      if (newNode.parentId === null) {
        nodes.value.unshift({ ...response });
      }

      // If the new node has a parent, update the parent's children
      if (newNode.parentId) {
        const parentNode = nodes.value.find(
          (node) => node.id === newNode.parentId
        );
        if (parentNode) {
          if (!parentNode.children) {
            parentNode.children = [];
          }
          parentNode.children.unshift({ ...response }); // Use spread operator for reactivity
        }
      }

      //   Refetch data after adding
      refetch(newNode.parentId);
    } catch (error) {
      snackbarStore.showSnackbar(`API Error: ${error}`, "error");
    } finally {
      isLoading.value = false;
    }
  };

  const updateNodeParent = async (
    draggedNodeId: string,
    newParentId: string | null
  ): Promise<void> => {
    try {
      isLoading.value = true;

      // Fetch the node to be updated
      const node = nodes.value.find((n) => n.id === draggedNodeId);
      if (!node) {
        throw new Error("Node not found");
      }

      // Update the parentId of the node
      const updatedNode = { ...node, parentId: newParentId };

      // Send a PUT request to update the node
      const response = await APIService.request<Node>({
        endpoint: `${API_ENDPOINTS.getAllNodeWithoutChildren}/${draggedNodeId}`,
        method: "PUT",
        body: updatedNode,
        setLoading: (loading: boolean) => (isLoading.value = loading),
      });

      // Refetch data after updating
      refetch(newParentId);
    } catch (error) {
      snackbarStore.showSnackbar(`API Error: ${error}`, "error");
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isLoading,
    nodes,
    currentPage,
    pageSize,
    searchLabel,
    totalItems,
    totalPages,
    fetchMainData,
    toggleNodeVisibility,
    toggleNodesBySearch,
    add,
    updateNodeParent,
  };
});

export type { Node };
