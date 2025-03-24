import { useSnackbarStore } from "@/stores/snackbar";

/**
 * Type for supported HTTP methods.
 */
type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE";

/**
 * Type for a function that sets response data.
 */
type SetterFunction<T> = (data: T) => void;

/**
 * Type for a function that sets loading status.
 */
type LoadingFunction = (isLoading: boolean) => void;

/**
 * Type for a function that sets error messages.
 */
type ErrorFunction = (errorMessage: string) => void;

/**
 * Interface for the options to be passed to the API service.
 */
interface APIServiceOptions<T = any> {
  /**
   * The API endpoint (e.g., "/auth/user").
   * @example "/auth/login"
   */
  endpoint: string;

  /**
   * The HTTP method (GET, POST, PUT, DELETE). Default is "GET".
   * @default "GET"
   */
  method?: HTTPMethod;

  /**
   * The body content for POST/PUT requests. Can be an object or a string.
   * @default ""
   */
  body?: Record<string, any> | string;

  /**
   * Additional URL path parameters to append to the endpoint (optional).
   * @example "/123" (appends to the endpoint).
   */
  pathParams?: string;

  /**
   * A function to set the response data (optional).
   * @example (data) => { console.log(data); }
   */
  setterFunction?: SetterFunction<T> | null;

  /**
   * A function to set the loading status (optional).
   * @example (isLoading) => { this.isLoading = isLoading; }
   */
  setLoading?: LoadingFunction | null;

  /**
   * A function to set the error message (optional).
   * @example (errorMessage) => { this.errorMessage = errorMessage; }
   */
  setError?: ErrorFunction | null;
}

/**
 * A service for making API requests.
 *
 * @class APIService
 */
export class APIService {
  /**
   * Makes an API request to the specified endpoint with the given options.
   *
   * @async
   * @param {APIServiceOptions<T>} options - The options for the API request.
   * @returns {Promise<T>} The response data from the API.
   * @throws {Error} If the request fails or the response is not successful.
   *
   * @example
   * const data = await APIService.request({
   *   endpoint: "/auth/user",
   *   method: "GET",
   *   setterFunction: (data) => { console.log(data); },
   *   setLoading: (loading) => { this.isLoading = loading; }
   * });
   */
  static async request<T = any>({
    endpoint,
    method = "GET",
    body = "",
    pathParams = "",
    setterFunction = null,
    setLoading = null,
    setError = null,
  }: APIServiceOptions<T>): Promise<T> {
    const snackbarStore = useSnackbarStore();

    if (setLoading) setLoading(true);

    const headers: Record<string, string> = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    const url = `${import.meta.env.VITE_API_BASE_URL}/${endpoint}${pathParams}`;

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null,
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        if (method !== "GET")
          snackbarStore.showSnackbar(`API Error: ${errorMessage}`, "error");
        throw new Error(errorMessage);
      }

      const contentType = response.headers.get("Content-Type");

      if (!contentType?.includes("application/json")) {
        const textResponse = await response.text();
        if (method !== "GET") {
          snackbarStore.showSnackbar(`API Error: ${textResponse}`, "error");
        }
      }

      const data: T = await response.json();

      if (method !== "GET") {
        snackbarStore.showSnackbar("Request successful!", "success");
      }
      if (setterFunction) {
        setterFunction(data);
      }

      return data;
    } catch (error) {
      if (method !== "GET") {
        snackbarStore.showSnackbar(`Error: ${String(error)}`, "error");
      }
      if (
        String(error) === 'Error: "Not found"' &&
        setError !== null &&
        method !== "GET"
      ) {
        console.log(String(error) === 'Error: "Not found"');
        setError("No sub-sections avaliable.");
      }

      throw error;
    } finally {
      if (setLoading) setLoading(false);
    }
  }
}
