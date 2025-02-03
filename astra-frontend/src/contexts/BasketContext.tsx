"use client";

/**
 * @file This file contains the implementation of the BasketContext and BasketProvider components.
 * The BasketContext provides a context for managing the customer's basket state, including adding,
 * updating, and removing items from the basket.
 */

import BasketClient from "@/clients/BasketClient";
import { BasketItem } from "@/models/BasketItem";
import { CommandResult } from "@/models/CommandResult";
import { CustomerBasket } from "@/models/CustomerBasket";
import BasketState from "@/services/BasketState";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "react-oidc-context";

/**
 * Represents the properties of the BasketContext component.
 */
interface BasketContextProps {
  basket: CustomerBasket | null;
  loading: boolean;
  error: string | null;
  addItem: (newItem: BasketItem) => Promise<CommandResult>;
  updateQuantity: (id: string, quantity: number) => Promise<CommandResult>;
  removeItem: (itemId: string) => Promise<CommandResult>;
}

interface BasketProviderProps {
  children: React.ReactNode;
}

/**
 * The context for managing the customer's basket state.
 */
export const BasketContext = createContext<BasketContextProps | null>(null);

/**
 * The provider component for the BasketContext.
 * Manages the basket state and provides functions for adding, updating, and removing items from the basket.
 * @param children - The child components to be wrapped by the BasketProvider.
 */
export const BasketProvider = ({ children }: BasketProviderProps) => {
  const fakeAuth = {
    isLoading: false,
    isAuthenticated: true,
    user: {
      profile: { sub: "test-user-id" },
      access_token: "test-access-token",
    },
  };

  const auth = useAuth() || fakeAuth;
  console.log(auth.user);
  const userId = auth.user?.profile?.sub || null;
  const accessToken = auth.user?.access_token || null;

  const basketClient = useMemo(
    () => new BasketClient(accessToken),
    [accessToken]
  );

  const basketState = useMemo(
    () => new BasketState(basketClient, userId),
    [basketClient, userId]
  );

  const [basket, setBasket] = useState<CustomerBasket | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches the customer's basket and updates the basket state.
   */
  const fetchBasket = useCallback(async () => {
    if (!userId) {
      setBasket({ customerId: ``, items: [], totalAmount: 0 });
      setLoading(false);
      return;
    }

    try {
      const fetchedBasket = await basketState.getBasketAsync();
      setBasket(fetchedBasket);
    } catch (err) {
      setError("Failed to fetch basket");
      console.error("Failed to fetch basket:", err);
    } finally {
      setLoading(false);
    }
  }, [userId, basketState]);

  // Initialize the basket and set up update notifications
  useEffect(() => {
    fetchBasket();
    basketState.setOnBasketUpdated(fetchBasket);
  }, [fetchBasket, basketState]);

  /**
   * Adds a new item to the customer's basket.
   * @param newItem - The new item to be added to the basket.
   * @returns A promise that resolves to a CommandResult indicating the success or failure of the operation.
   */
  const addItem = async (newItem: BasketItem): Promise<CommandResult> => {
    const result = await basketState.addItemAsync(newItem);
    if (result.succeeded) {
      fetchBasket();
    }
    return result;
  };

  /**
   * Updates the quantity of an item in the customer's basket.
   * @param id - The ID of the item to be updated.
   * @param quantity - The new quantity of the item.
   * @returns A promise that resolves to a CommandResult indicating the success or failure of the operation.
   */
  const updateQuantity = async (
    id: string,
    quantity: number
  ): Promise<CommandResult> => {
    const result = await basketState.updateQuantityAsync(id, quantity);
    if (result.succeeded) {
      fetchBasket();
    }
    return result;
  };

  /**
   * Removes an item from the customer's basket.
   * @param itemId - The ID of the item to be removed.
   * @returns A promise that resolves to a CommandResult indicating the success or failure of the operation.
   */
  const removeItem = async (itemId: string): Promise<CommandResult> => {
    const result = await basketState.removeItemAsync(itemId);
    if (result.succeeded) {
      fetchBasket();
    }
    return result;
  };

  const value = {
    basket,
    loading,
    error,
    addItem,
    updateQuantity,
    removeItem,
  };

  return (
    <BasketContext.Provider value={value}>{children}</BasketContext.Provider>
  );
};
