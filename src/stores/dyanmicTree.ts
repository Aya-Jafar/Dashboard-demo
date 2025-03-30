import { defineStore } from "pinia";
import { ref, computed, type Ref } from "vue";
import { APIService } from "@/services/ApiService";
import API_ENDPOINTS from "@/utils/endpoints";
import { useSnackbarStore } from "@/stores/snackbar";
import { filterByExactParentID } from "@/utils/helpers";

// ==================== TYPE DEFINITIONS ====================
interface Node {
  id?: string;
  parentId: string | null;
  label: string;
  createdAt: number;
  description: string;
  numberOfEmployees: number;
  children?: Array<any>;
  isOpen?: boolean;
  visible?:boolean
}

// ==================== STORE DEFINITION ====================
export const useDynamicTreeStore = defineStore("tree-node", () => {
  const isLoading = ref(false);
  const nodes = ref<any[]>([]);
  const currentPage = ref(1);
  const pageSize = ref(7);
  const searchLabel = ref("");

  const snackbarStore = useSnackbarStore();

  // Fetch Initial data (parentId = null)
  const fetchMainData = async (
    page: number,
    label: string = ""
  ): Promise<void> => {
    try {
      isLoading.value = true;

      await APIService.request<Node[]>({
        endpoint: API_ENDPOINTS.DEPARTMENTS,
        method: "GET",
        pathParams: `?parentId=null&page=${page}&limit=${
          pageSize.value
        }&label=${encodeURIComponent(label)}&sortBy=createdAt&order=desc`,
        setLoading: (loading: boolean) => (isLoading.value = loading),
        setterFunction: (data: any) => {
          if (page === 1) {
            nodes.value = data;
          } else {
            nodes.value = [...nodes.value, ...data]; // Append new nodes
          }
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
      await APIService.request<Node[]>({
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

  const openNode = async (
    node: Node,
    noChildrenText: Ref<string | null>,
    isLoading: Ref<boolean | false>
  ) => {
    await APIService.request({
      endpoint: `${API_ENDPOINTS.DEPARTMENTS}?parentId=${node.id}`,
      method: "GET",
      setLoading: (loading: boolean) => (isLoading.value = loading),
      setError: (message) => {
        node.isOpen = true;
        noChildrenText.value = message;
      },
      setterFunction: (data: any) => {
        /**
         * The mock API's path parameter is NOT filtering with the exact ID
         * So if ?parentId=2/ the response conatins children with any parentId
         * that contain "2" like "dept-1-2-1-1"
         * That's why we need the filtering here
         *  */
        node.children = filterByExactParentID(data, node.id || null);
        if (node.children?.length === 0) {
          noChildrenText.value = "noSubSectionsAvailable";
        }
        node.isOpen = true;
      },
    });
  };

  const deepFind = (
    nodes: Node[],
    id: string
  ): { node: Node | null; parent: Node | null; siblings: Node[] } => {
    for (const node of nodes) {
      if (node.id === id) return { node, parent: null, siblings: nodes };
      if (node.children) {
        const childMatch = node.children.find((child) => child.id === id);
        if (childMatch)
          return { node: childMatch, parent: node, siblings: node.children };
        const found = deepFind(node.children, id);
        if (found.node) return found;
      }
    }
    return { node: null, parent: null, siblings: [] };
  };

  const moveNode = async ({
    nodeId,
    targetNodeId,
  }: {
    nodeId: string;
    targetNodeId: string;
  }) => {
    // Find contexts for both nodes
    const source = deepFind(nodes.value, nodeId);
    const target = deepFind(nodes.value, targetNodeId);

    if (!source.node || !target.node) {
      snackbarStore.showSnackbar(`Nodes not found`, "error");
      return;
    }

    // Determine new parent (use target's parent)
    const newParentId = target.parent?.id ?? null;

    // Clone state for immutability
    const newNodes = JSON.parse(JSON.stringify(nodes.value));

    // Remove from original position
    const updatedSource = deepFind(newNodes, nodeId);
    if (!updatedSource.node) return;

    updatedSource.siblings.splice(
      updatedSource.siblings.findIndex((n) => n.id === nodeId),
      1
    );

    // Update parent reference
    updatedSource.node.parentId = newParentId;

    // Determine new siblings array
    let newSiblings: Node[];
    if (newParentId === null) {
      newSiblings = newNodes;
    } else {
      const newParent = deepFind(newNodes, newParentId).node;
      if (!newParent) return;
      newParent.children = newParent.children || [];
      newSiblings = newParent.children;
    }

    // Find insertion position
    const targetIndex = newSiblings.findIndex((n) => n.id === targetNodeId);
    if (targetIndex === -1) {
      // If target not found in new siblings, append to end
      newSiblings.push(updatedSource.node);
    } else {
      // Insert before target node
      newSiblings.splice(targetIndex, 0, updatedSource.node);
    }

    //  Update state
    nodes.value = newNodes;

    //   await APIService.request({
    //     endpoint: `${API_ENDPOINTS.DEPARTMENTS}/${nodeId}`,
    //     method: "PUT",
    //     body: updatedNode,
    //     setLoading: (loading: boolean) => (isLoading.value = loading),
    //   });
  };
  return {
    isLoading,
    nodes,
    currentPage,
    pageSize,
    searchLabel,
    fetchMainData,
    toggleNodeVisibility,
    toggleNodesBySearch,
    add,
    moveNode,
    openNode,
  };
});

export type { Node };
