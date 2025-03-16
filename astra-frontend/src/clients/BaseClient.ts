import { ServiceClientProvider } from "./ServiceClientProvider";

/**
 * Represents a base client for interacting with a service.
 */
export class BaseClient {
  /**
   * The access token used for authentication.
   */
  public accessToken: string | null = null;

  /**
   * The service client instance.
   */
  public serviceClient: IServiceClient =
    ServiceClientProvider.getServiceClient();

  /**
   * Creates a new instance of the BaseClient class.
   * @param accessToken The access token used for authentication. Defaults to null.
   */
  public constructor(accessToken: string | null = null) {
    this.serviceClient.accessToken = accessToken;
    console.log("Access token: " + this.serviceClient.accessToken);
  }
}

export enum HttpRequestType {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

// optional
export class HttpHeader {
  key!: string;
  value!: string;
}

// optional
export class HttpRequest {
  uri!: string;
  method: HttpRequestType = HttpRequestType.GET;
  headers: HttpHeader[] = [];
  body: string = "";
}

export class HttpResponseMessage extends Response {
  statusCode: number = 0;
}

/**
 * Represents a service client.
 */
export interface IServiceClient {
  /**
   * The access token for the service client.
   */
  accessToken: string | null;

  /**
   * Sends a request to the specified URL with optional request options and retries the request if necessary.
   *
   * @param url - The URL to send the request to.
   * @param options - Optional request options.
   * @returns A promise that resolves to the response data.
   */
  routeRequestWithRetries<T>(url: string, options?: RequestInit): Promise<T>;

  /**
   * Handles the error response from a request.
   *
   * @param response - The HTTP response message.
   * @returns A promise that resolves to an array of error messages.
   */
  handleRequestError(response: HttpResponseMessage): Promise<string[]>;
}

/**
 * Represents a service client that handles HTTP requests with retries.
 */
export class ServiceClient implements IServiceClient {
  public accessToken: string | null = null;

  private maxRetries = 3;
  private baseDelay = 500;

  async routeRequestWithRetries<T>(
    url: string,
    options?: RequestInit
  ): Promise<T> {
    console.log("Fetching URL:", url); // Add this log
    console.log("Options:", options); // Add this log to see headers, method, etc.
    const headers = new Headers(options?.headers || {});

    if (this.accessToken) {
      headers.set("Authorization", `Bearer ${this.accessToken}`);
    }

    const updatedOptions: RequestInit = {
      ...options,
      headers,
    };

    let attempt = 0;

    while (attempt < this.maxRetries) {
      try {
        // Send the request
        const response = await fetch(url, updatedOptions);
        return response as T;
      } catch (error) {
        if (attempt >= this.maxRetries - 1) {
          console.error("Request failed after maximum retries:", error);
          throw new Error("Unable to connect to the server.");
        }

        // Log retry attempt
        console.warn(`Request failed (attempt ${attempt + 1}):`, error);

        // Apply exponential backoff
        const delay = this.getExponentialBackoffDelay(attempt);
        await this.delay(delay);

        attempt++;
      }
    }

    throw new Error("Failed to fetch after retries.");
  }

  async handleRequestError(response: HttpResponseMessage): Promise<string[]> {
    let errorMessages: string[] = ["Unknown error"];
    try {
      const errorData = await response.json();
      if (errorData.title) {
        errorMessages = [errorData.title];
        if (errorData.errors && Array.isArray(errorData.errors)) {
          errorMessages = errorMessages.concat(errorData.errors);
        }
      } else if (errorData.errors && Array.isArray(errorData.errors)) {
        errorMessages = errorData.errors;
      } else if (errorData.detail) {
        errorMessages = [errorData.detail];
      }
    } catch (e) {
      console.error("Error parsing error response:", e);
    }
    return errorMessages;
  }

  /**
   * Calculates the delay for exponential backoff.
   *
   * @param attempt - The current retry attempt number.
   * @returns The delay in milliseconds.
   */
  private getExponentialBackoffDelay(attempt: number): number {
    const jitter = Math.random() * 100; // Random jitter between 0 and 100ms
    return Math.pow(2, attempt) * this.baseDelay + jitter;
  }

  /**
   * Delays execution for a specified number of milliseconds.
   *
   * @param ms - The number of milliseconds to delay.
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
