import type { Node } from "../stores/dyanmicTree";
import { useI18n } from "vue-i18n";

/**
 * Filters by the exact parent ID to get the correct children
 * @param data
 * @param parentId
 * @returns the filtered children that match the parentID
 */
export const filterByExactParentID = (data: Node[], parentId: string) => {
  return data.filter((item: any) => item.parentId === parentId);
};


/**
 * 
 * @returns the current language
 */
export const getCurrentLanguage = () => {
  const { locale } = useI18n();

  if (localStorage.getItem("language")) {
    return localStorage.getItem("language");
  }
  return locale;
};
