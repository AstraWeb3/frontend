import { CommandResult } from "@/models/CommandResult";
import { CustomerBasket } from "@/models/CustomerBasket";
import { BaseClient, HttpRequestType, HttpResponseMessage } from "./BaseClient";

/**
 * Represents a client for interacting with the basket API.
 */
class BasketClient extends BaseClient {
  private baseUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

  /**
   * Creates a new instance of the `BasketClient` class.
   * @param accessToken The access token used for authentication. Defaults to `null`.
   */
  constructor(accessToken: string | null = null) {
    super(accessToken);
  }

  /**
   * Retrieves the customer basket asynchronously.
   * @param customerId The ID of the customer.
   * @returns A promise that resolves to the customer basket.
   * @throws An error if the request fails or the response is not successful.
   */
  async getBasketAsync(customerId: string): Promise<CustomerBasket> {
    const response =
      await this.serviceClient.routeRequestWithRetries<HttpResponseMessage>(
        `${this.baseUrl}/baskets/${customerId}`
      );

    if (!response.ok) {
      const errorMessages = await this.serviceClient.handleRequestError(
        response
      );
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
    const response =
      await this.serviceClient.routeRequestWithRetries<HttpResponseMessage>(
        `${this.baseUrl}/baskets/${updatedBasket.customerId}`,
        {
          method: HttpRequestType.PUT,
          body: JSON.stringify(dto),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

    if (!response.ok) {
      const errorMessages = await this.serviceClient.handleRequestError(
        response
      );
      throw new Error(errorMessages.join("\n"));
    }

    return { succeeded: true, errors: [] };
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
