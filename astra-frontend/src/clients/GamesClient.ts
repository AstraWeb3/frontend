/**
 * @file This file contains the implementation of the Game client class.
 *
 * @copyright (C) Giovanny Hernandez.  All rights reserved.
 */

import { CommandResult } from "@/models/CommandResult";
import { GameDetails } from "@/models/GameDetails";
import { GamesPage } from "@/models/GamesPage";
import { Result } from "@/uitls/Result";
import { BaseClient, HttpRequestType, HttpResponseMessage } from "./BaseClient";

/**
 * Represents a client for interacting with the games API.
 */
class GamesClient extends BaseClient {
  private baseUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

  /**
   * Creates a new instance of the GamesClient class.
   *
   * @param accessToken The access token to be used for authentication. Defaults to null.
   */
  constructor(accessToken: string | null = null) {
    super(accessToken);
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

    const response =
      await this.serviceClient.routeRequestWithRetries<HttpResponseMessage>(
        url.toString()
      );

    if (!response.ok) {
      const errorMessages = await this.serviceClient.handleRequestError(
        response
      );
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
    const response =
      await this.serviceClient.routeRequestWithRetries<HttpResponseMessage>(
        `${this.baseUrl}/games/${updatedGame.id}`,
        {
          method: HttpRequestType.PUT,
          body: this.toMultiPartFormDataContent(updatedGame),
        }
      );

    if (!response.ok) {
      const errorMessages = await this.serviceClient.handleRequestError(
        response
      );
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
    const response =
      await this.serviceClient.routeRequestWithRetries<HttpResponseMessage>(
        `${this.baseUrl}/games/${id}`,
        {
          method: HttpRequestType.DELETE,
        }
      );

    if (!response.ok) {
      const errorEMessages = await this.serviceClient.handleRequestError(
        response
      );
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
}

export default GamesClient;
