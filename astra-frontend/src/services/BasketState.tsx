import BasketClient from "@/clients/BasketClient";
import { BasketItem } from "@/models/BasketItem";
import { CommandResult } from "@/models/CommandResult";
import { CustomerBasket } from "@/models/CustomerBasket";

/**
 * Represents the state of a customer's basket.
 */
class BasketState {
  private client: BasketClient;
  private userId: string | null;
  private cachedBasket: Promise<CustomerBasket> | null = null;
  private onBasketUpdate: (() => void) | null = null;

  /**
   * Constructs a new instance of the `BasketState` class.
   * @param client - The `BasketClient` used to interact with the basket service.
   * @param userId - The ID of the user associated with the basket.
   */
  constructor(client: BasketClient, userId: string | null) {
    this.client = client;
    this.userId = userId;
  }

  /**
   * Retrieves the customer's basket asynchronously.
   * @returns A promise that resolves to the customer's basket.
   */
  public async getBasketAsync(): Promise<CustomerBasket> {
    if (!this.cachedBasket) {
      this.cachedBasket = this.fetchBasketAsync();
    }

    return this.cachedBasket;
  }

  /**
   * Adds a new item to the customer's basket asynchronously.
   * @param newItem - The new item to add to the basket.
   * @returns A promise that resolves to the result of the add operation.
   */
  public async addItemAsync(newItem: BasketItem): Promise<CommandResult> {
    const basket = await this.getBasketAsync();
    basket.items.push(newItem);

    // update the basket with the new item
    const result = await this.client.updateBasketAsync(basket);

    if (result.succeeded) {
      this.cachedBasket = null;
      this.notifyBasketUpdate();
    }

    return result;
  }

  /**
   * Updates the quantity of an item in the customer's basket asynchronously.
   * @param id - The ID of the item to update.
   * @param quantity - The new quantity of the item.
   * @returns A promise that resolves to the result of the update operation.
   */
  public async updateQuantityAsync(
    id: string,
    quantity: number
  ): Promise<CommandResult> {
    const basket = await this.getBasketAsync();
    const basketItem = basket.items.find((item) => item.id === id);

    if (!basketItem) {
      return { succeeded: true, errors: [] };
    }

    basketItem.quantity = quantity;

    // update the basket with the new item
    const result = await this.client.updateBasketAsync(basket);

    if (result.succeeded) {
      this.cachedBasket = null;
      this.notifyBasketUpdate();
    }

    return result;
  }

  /**
   * Removes an item from the customer's basket asynchronously.
   * @param itemId - The ID of the item to remove.
   * @returns A promise that resolves to the result of the remove operation.
   */
  public async removeItemAsync(itemId: string): Promise<CommandResult> {
    const basket = await this.getBasketAsync();
    basket.items = basket.items.filter((item) => item.id !== itemId);

    // remove the item from the basket
    const result = await this.client.updateBasketAsync(basket);

    if (result.succeeded) {
      this.cachedBasket = null;
      this.notifyBasketUpdate();
    }

    return result;
  }

  /**
   * Sets the callback function to be executed when the basket is updated.
   * @param callback - The callback function to be executed.
   */
  public setOnBasketUpdated(callback: () => void): void {
    this.onBasketUpdate = callback;
  }

  /**
   * Fetches the customer basket asynchronously.
   * @returns A promise that resolves to a CustomerBasket object.
   */
  private async fetchBasketAsync(): Promise<CustomerBasket> {
    if (!this.userId) {
      return { customerId: "", items: [], totalAmount: 0 };
    }
    return await this.client.getBasketAsync(this.userId);
  }

  /**
   * Notifies the subscribers when the basket is updated.
   */
  private notifyBasketUpdate() {
    if (this.onBasketUpdate) {
      this.onBasketUpdate();
    }
  }
}

export default BasketState;
