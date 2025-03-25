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
 * Gets the current application language
 * @returns The current language code from localStorage or i18n locale
 */
export const getCurrentLanguage = () => {
  if (localStorage.getItem("language")) {
    return localStorage.getItem("language");
  }
  const { locale } = useI18n();
  return locale;
};

/**
 * Creates a debounced function that delays execution
 * @param func - The function to debounce
 * @param wait - Number of milliseconds to delay
 * @returns A debounced version of the passed function
 */
export const debounce = (func: Function, wait: number) => {
  let timeout: number;

  return function (this: any, ...args: any[]) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};
