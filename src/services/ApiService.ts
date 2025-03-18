/**
 * Interface for the options to be passed to the API service.
 *
 * @interface
 */
interface APIServiceOptions {
  /**
   * The API endpoint (e.g., "/auth/user").
   * @example "/auth/login"
   */
  endpoint: string;
  /**
   * The HTTP method (GET, POST, PUT, DELETE). Default is "GET".
   * @default "GET"
   */
  method?: "GET" | "POST" | "PUT" | "DELETE";

  /**
   * The body content for POST/PUT requests. Can be an object or a string.
   * @default ""
   */
  body?: object | string;

  /**
   * Additional URL path parameters to append to the endpoint (optional).
   * @example "/123" (appends to the endpoint).
   */
  pathParams?: string;

  /**
   * A function to set the response data (optional).
   * @example (data) => { console.log(data); }
   */
  setterFunction?: ((data: any) => void) | null;

  /**
   * A function to set the loading status (optional).
   * @example (isLoading) => { this.isLoading = isLoading; }
   */
  setLoading?: ((isLoading: boolean) => void) | null;
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
   * @param {APIServiceOptions} options - The options for the API request.
   * @returns {Promise<any>} The response data from the API.
   * @throws {Error} If the request fails or the response is not successful.
   *
   * @example
   * const data = await APIService.request({
   *   endpoint: "/auth/user",
   *   method: "GET",
   *   needAuth: true,
   *   setterFunction: (data) => { console.log(data); },
   *   setLoading: (loading) => { this.isLoading = loading; }
   * });
   */
  static async request({
    endpoint,
    method = "GET",
    body = "",
    pathParams = "",
    setterFunction = null,
    setLoading = null,
  }: APIServiceOptions): Promise<any> {
    // Start loading
    if (setLoading && typeof setLoading === "function") {
      setLoading(true);
    }

    const headers: { [key: string]: string } = {
      "Content-Type": "application/json",
    };

    // Construct the full URL
    const url = `${import.meta.env.VITE_API_BASE_URL}${endpoint}${
      pathParams || ""
    }`;

    try {
      // Make the fetch request
      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null,
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      // Parse the response data
      const data = await response.json();

      // If a setter function is provided, call it with the data
      if (setterFunction && typeof setterFunction === "function") {
        setterFunction(data);
      }
      return data;
    } catch (error) {
      console.error("APIService Error:", error);
      throw error;
    } finally {
      // Stop loading
      if (setLoading && typeof setLoading === "function") {
        setLoading(false);
      }
    }
  }
}
