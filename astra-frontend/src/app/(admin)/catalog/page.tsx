"use client";

import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import GamesClient from "@/clients/GamesClient";
import { GameSummary } from "@/models/GameSummary";
import { useAuth } from "react-oidc-context";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import "../catalog/Catalog.styles.scss";

/**
 * Renders the CatalogPage component.
 * This component displays a catalog of games and provides search and delete functionality.
 */
export default function CatalogPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const auth = useAuth();

  const [nameSearch, setNameSearch] = useState(searchParams.get("name") || "");
  const [gamesPage, setGamesPage] = useState<{ data: GameSummary[] } | null>(
    null
  );

  const [paginationInfo, setPaginationInfo] = useState<{
    currentPage: number;
    totalPages: number;
  } | null>(null);

  const [loadingErrorList, setLoadingErrorList] = useState<string[]>([]);
  const [errorList, setErrorList] = useState<string[]>([]);
  const [gameToDelete, setGameToDelete] = useState<GameSummary | null>(null);

  /**
   * Number of games to display per page.
   */
  const pageSize = 5;

  /**
   * Fetches the games based on the search parameters.
   */
  const fetchGames = async () => {
    const pageNumber = parseInt(searchParams.get("page") || "1", 10);

    try {
      const gamesClient = new GamesClient(auth.user?.access_token || null);
      const response = await gamesClient.getGamesAsync(
        pageNumber,
        pageSize,
        nameSearch
      );

      if (response.isSuccess) {
        const gamePage = response.getData();

        setGamesPage(gamePage);
        setPaginationInfo({
          currentPage: pageNumber,
          totalPages: gamePage.totalPages,
        });
      }
    } catch (error) {
      setLoadingErrorList([
        error instanceof Error ? error.message : "An unknown error occurred",
      ]);
    }
  };

  /**
   * Sets the document title and fetches the games when the component mounts
   * or when the search parameters change.
   */
  useEffect(() => {
    document.title = "Game Catalog";
    fetchGames();
  }, [searchParams, auth.user?.access_token]);

  /**
   * Handles the search form submission.
   * Navigates to the catalog page with the search parameters.
   *
   * @param event - The form event.
   */
  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push(`/catalog?name=${nameSearch}&page=1`);
  };

  /**
   * Handles the input change for the search input field.
   * Updates the search input value and navigates to the catalog page with the updated search parameters.
   *
   * @param event - The change event.
   */
  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setNameSearch(value);

    if (value === "") {
      router.push("/catalog?page=1");
    }
  };

  /**
   * Handles the deletion of a game.
   * Deletes the game using the GamesClient and fetches the updated list of games.
   *
   * @param gameId - The ID of the game to delete.
   */
  const handleDelete = async (gameId: string) => {
    setErrorList([]);
    try {
      const gamesClient = new GamesClient(auth.user?.access_token || null);
      const result = await gamesClient.deleteGameAsync(gameId);

      if (result.succeeded) {
        fetchGames();
      } else {
        setErrorList(result.errors);
      }
    } catch (error) {
      setErrorList([
        error instanceof Error ? error.message : "An unknown error occurred",
      ]);
    }
  };

  /**
   * Renders the loading error messages if there are any.
   *
   * @returns JSX element containing the loading error messages.
   */
  if (loadingErrorList.length > 0) {
    return (
      <div>
        {loadingErrorList.map((error, index) => (
          <div key={index} className="mt-3 text-danger">
            <em>{error}</em>
          </div>
        ))}
      </div>
    );
  }

  /**
   * Renders the loading message if the gamesPage or paginationInfo is null.
   *
   * @returns JSX element containing the loading message.
   */
  if (gamesPage === null || paginationInfo === null) {
    return (
      <p className="mt-3">
        <em>Loading...</em>
      </p>
    );
  }

  /**
   * Renders the CatalogPage component.
   *
   * @returns JSX element containing the CatalogPage component.
   */
  return (
    <div className="container">
      <div className="search-bar">
        <Button onClick={() => router.push("/catalog/editgame")}>
          New Game
        </Button>
        <form onSubmit={handleSearch}>
          <input
            type="search"
            value={nameSearch}
            onChange={handleInput}
            placeholder="Search games..."
            aria-label="Search games"
          />
          <Button type="submit">Search</Button>
        </form>
      </div>

      {errorList.length > 0 && (
        <div className="mt-3">
          {errorList.map((error, index) => (
            <div key={index} className="alert alert-danger">
              {error}
            </div>
          ))}
        </div>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Genre</th>
              <th className="text-end">Price</th>
              <th>Release Date</th>
              <th>Last Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {gamesPage.data.map((game) => (
              <tr key={game.id}>
                <td>
                  <Image
                    src={game.imageUri}
                    alt={game.name}
                    height={80}
                    width={80}
                  />
                </td>
                <td>{game.name}</td>
                <td>{game.genre}</td>
                <td className="text-end">${game.price}</td>
                <td>{game.releaseDate}</td>
                <td>{game.lastUpdatedBy}</td>
                <td className="actions">
                  <Button
                    className="edit"
                    onClick={() => router.push(`/catalog/editgame/${game.id}`)}
                  >
                    Edit
                  </Button>
                  <Button
                    className="delete"
                    onClick={() => setGameToDelete(game)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
