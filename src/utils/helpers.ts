import type { Node } from "../stores/dyanmicTree";


/**
 * Filters by the exact parent ID to get the correct children
 * @param data 
 * @param parentId 
 * @returns 
 */
export const filterByExactParentID = (data: Array<Node>, parentId: string) => {
  return data.filter((item: any) => item.parentId == parentId);
};
