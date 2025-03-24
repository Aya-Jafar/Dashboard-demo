import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { APIService } from "../services/ApiService.ts";
import API_ENDPOINTS from "../utils/endpoints.ts";
import { useSnackbarStore } from "./snackbar.ts";

// ==================== TYPE DEFINITIONS ====================
interface Node {
  id?: string;
  parentId: string | null;
  label: string;
  createdAt: number;
  description: string;
  numberOfEmployees: number;
}

// ==================== STORE DEFINITION ====================
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
        endpoint: API_ENDPOINTS.DEPARTMENTS,
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
    const searchTerm = label.toLowerCase();

    if (!searchTerm) {
      // If search is empty, close all nodes
      nodes.value.forEach((node) => {
        node.isOpen = false;
      });
      return;
    }

    // Recursive function to check if node or any children match search
    const checkNodeMatches = (node: any): boolean => {
      const nodeMatches = node.label.toLowerCase().includes(searchTerm);

      if (node.children) {
        const childMatches = node.children.some(checkNodeMatches);
        return nodeMatches || childMatches;
      }

      return nodeMatches;
    };

    nodes.value.forEach((node) => {
      // Open the node if it matches or has matching children
      node.isOpen = checkNodeMatches(node);

      // If node matches, ensure its parent is also open
      if (node.label.toLowerCase().includes(searchTerm)) {
        node.isOpen = true;
      }
    });
  };

  const refetch = async (parentId: string | null): Promise<void> => {
    try {
      const data = await APIService.request<Node[]>({
        endpoint: API_ENDPOINTS.DEPARTMENTS,
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
        endpoint: API_ENDPOINTS.DEPARTMENTS,
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



  const handleNodeMove = ({
    nodeId,
    targetNodeId,
  }: {
    nodeId: string;
    targetNodeId: string;
  }) => {
    // Find the node being moved
    const nodeToMoveIndex = nodes.value.findIndex((node) => node.id === nodeId);
    const targetNodeIndex = nodes.value.findIndex(
      (node: Node) => node.id === targetNodeId
    );

    if (nodeToMoveIndex !== -1 && targetNodeIndex !== -1) {
      // Swap the positions in the root-level nodes array
      const [movedNode] = nodes.value.splice(nodeToMoveIndex, 1);
      nodes.value.splice(targetNodeIndex, 0, movedNode);
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
    handleNodeMove,
  };
});

export type { Node };
