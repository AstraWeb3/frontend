/**
 * @file This file contains the implementation of the Game client class.
 *
 * @copyright (C) Giovanny Hernandez.  All rights reserved.
 */

import { CommandResult } from "@/models/CommandResult";
import { GameDetails } from "@/models/GameDetails";
import { GamesPage } from "@/models/GamesPage";
import { Result } from "@/uitls/Result";

/**
 * Represents a client for interacting with the games API.
 */
class GamesClient {
  private baseUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  private accessToken: string | null;

  /**
   * Creates a new instance of the GamesClient class.
   *
   * @param accessToken The access token to be used for authentication. Defaults to null.
   */
  constructor(accessToken: string | null = null) {
    this.accessToken = accessToken;
  }

  /**
   * Retrieves a page of games from the API.
   *
   * @param pageNumber The page number to retrieve.
   * @param pageSize The number of games per page.
   * @param nameSearch Optional. The name to search for in the game titles.
   * @returns A Promise that resolves to a GamesPage object.
   */
  async getGamesAsync(
    pageNumber: number,
    pageSize: number,
    nameSearch?: string
  ): Promise<Result<GamesPage>> {
    // Construct the parameters for the request
    const url = new URL(`${this.baseUrl}/games`);
    url.searchParams.append("pageNumber", pageNumber.toString());
    url.searchParams.append("pageSize", pageSize.toString());

    if (nameSearch) {
      url.searchParams.append("name", nameSearch);
    }

    const response = await this.fetchWithHandling(url.toString());

    if (!response.ok) {
      const errorMessages = await this.handleFetchError(response);
      return Result.fail<any>(new Error(errorMessages.join("\n")));
    }

    const data: GamesPage = await response.json();
    return Result.ok<GamesPage>(data);
  }

  /**
   * Updates a game in the API.
   *
   * @param updatedGame The updated game details.
   * @returns A Promise that resolves to a CommandResult object.
   */
  async updateGameAsync(updatedGame: GameDetails): Promise<CommandResult> {
    const response = await this.fetchWithHandling(
      `${this.baseUrl}/games/${updatedGame.id}`,
      {
        method: "PUT",
        body: this.toMultiPartFormDataContent(updatedGame),
      }
    );

    if (!response.ok) {
      const errorMessages = await this.handleFetchError(response);
      return { succeeded: false, errors: errorMessages };
    }

    return { succeeded: true, errors: [] };
  }

  /**
   * Deletes a game from the API.
   *
   * @param id The ID of the game to delete.
   * @returns A Promise that resolves to a CommandResult object.
   */
  async deleteGameAsync(id: string): Promise<CommandResult> {
    const response = await this.fetchWithHandling(
      `${this.baseUrl}/games/${id}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      const errorEMessages = await this.handleFetchError(response);
      return { succeeded: false, errors: errorEMessages };
    }
    return { succeeded: true, errors: [] };
  }

  /**
   * Converts a GameDetails object to FormData for multipart/form-data requests.
   *
   * @param game The game details to convert.
   * @returns The FormData object.
   */
  private toMultiPartFormDataContent(game: GameDetails): FormData {
    const formData = new FormData();
    formData.append("name", game.name);
    if (game.genreId !== null) {
      formData.append("genreId", game.genreId);
    }
    formData.append("description", game.description);
    formData.append("price", game.price.toString());
    formData.append("releaseDate", game.releaseDate);
    if (game.imageFile) {
      formData.append("imageFile", game.imageFile);
    }
    return formData;
  }

  /**
   * Performs a fetch request with error handling.
   *
   * @param url The URL to fetch.
   * @param options Optional. The fetch options.
   * @returns A Promise that resolves to a Response object.
   */
  private async fetchWithHandling(
    url: string,
    options?: RequestInit
  ): Promise<Response> {
    const headers = new Headers(options?.headers);

    if (this.accessToken) {
      headers.append("Authorization", `Bearer ${this.accessToken}`);
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
        throw new Error("Unable to connect to the server.");
      }
      throw error;
    }
  }

  /**
   * Handles the error response from a fetch request.
   *
   * @param response The response object.
   * @returns A Promise that resolves to an array of error messages.
   */
  private async handleFetchError(response: Response): Promise<string[]> {
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
}

export default GamesClient;
