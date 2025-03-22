import type { Node } from "../stores/dyanmicTree";

/**
 * Filters by the exact parent ID to get the correct children
 * @param data
 * @param parentId
 * @returns the filtered children that match the parentID
 */
export const filterByExactParentID = (data: Node[], parentId: string) => {
  return data.filter((item: any) => item.parentId === parentId);
};
