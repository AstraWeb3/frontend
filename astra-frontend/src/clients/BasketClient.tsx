import { CommandResult } from "@/models/CommandResult";
import { CustomerBasket } from "@/models/CustomerBasket";

/**
 * Represents a client for interacting with the basket API.
 */
class BasketClient {
  private baseUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  private accessToken: string | null;

  /**
   * Creates a new instance of the `BasketClient` class.
   * @param accessToken The access token used for authentication. Defaults to `null`.
   */
  constructor(accessToken: string | null = null) {
    this.accessToken = accessToken;
  }

  /**
   * Retrieves the customer basket asynchronously.
   * @param customerId The ID of the customer.
   * @returns A promise that resolves to the customer basket.
   * @throws An error if the request fails or the response is not successful.
   */
  async getBasketAsync(customerId: string): Promise<CustomerBasket> {
    const response = await this.fetchWithHandling(
      `${this.baseUrl}/baskets/${customerId}`
    );
    if (!response.ok) {
      const errorMessages = await this.handleFetchError(response);
      throw new Error(errorMessages.join("\n"));
    }

    return await response.json();
  }

  /**
   * Updates the customer basket asynchronously.
   * @param updatedBasket The updated customer basket.
   * @returns A promise that resolves to the command result.
   * @throws An error if the request fails or the response is not successful.
   */
  async updateBasketAsync(
    updatedBasket: CustomerBasket
  ): Promise<CommandResult> {
    const dto: UpdateBasketDto = {
      items: updatedBasket.items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
      })),
    };

    // send request to update the basket
    const response = await this.fetchWithHandling(
      `${this.baseUrl}/baskets/${updatedBasket.customerId}`,
      {
        method: "PUT",
        body: JSON.stringify(dto),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorMessages = await this.handleFetchError(response);
      throw new Error(errorMessages.join("\n"));
    }

    return { succeeded: true, errors: [] };
  }

  /**
   * Fetches the specified URL with optional request options and handles common error scenarios.
   * @param url The URL to fetch.
   * @param options The request options.
   * @returns A promise that resolves to the response.
   * @throws An error if the request fails or there is a network error.
   */
  private async fetchWithHandling(
    url: string,
    options?: RequestInit
  ): Promise<Response> {
    {
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

      try {
        const response = await fetch(url, updatedOptions);
        return response;
      } catch (error) {
        if (error instanceof TypeError) {
          throw new Error(
            "Unable to connect to the server. Please check your internet connection."
          );
        }
        throw error;
      }
    }
  }

  /**
   * Handles the fetch error response and extracts the error messages.
   * @param response The fetch response.
   * @returns A promise that resolves to an array of error messages.
   */
  private async handleFetchError(response: Response): Promise<string[]> {
    let errorMessages: string[] = ["Unknown error"];

    try {
      // Log status and headers for debugging
      console.error("Fetch error response:", {
        status: response.status,
        statusText: response.statusText,
        headers: Array.from(response.headers.entries()),
      });

      // Check if the response is JSON
      if (response.headers.get("content-type")?.includes("application/json")) {
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
      } else {
        // Handle cases where the response is not JSON
        const text = await response.text();
        if (text) {
          errorMessages = [text];
        }
      }
    } catch (e) {
      console.error("Error parsing error response:", e);
    }

    // Log the final error messages for debugging
    console.error("Final error messages:", errorMessages);

    return errorMessages;
  }
}

export default BasketClient;

export interface UpdateBasketItemDto {
  id: string;
  quantity: number;
}

export interface UpdateBasketDto {
  items: UpdateBasketItemDto[];
}
