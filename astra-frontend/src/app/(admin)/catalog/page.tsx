"use client";

import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import GamesClient from "@/clients/GamesClient";
import { GameSummary } from "@/models/GameSummary";
import { useAuth } from "react-oidc-context";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import "../catalog/Catalog.styles.scss";

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

  const pageSize = 5;

  const fetchGames = async () => {
    const pageNumber = parseInt(searchParams.get("page") || "1", 10);

    try {
      const gamesClient = new GamesClient(auth.user?.access_token || null);
      const response = await gamesClient.getGamesAsync(
        pageNumber,
        pageSize,
        nameSearch
      );

      setGamesPage(response);
      setPaginationInfo({
        currentPage: pageNumber,
        totalPages: response.totalPages,
      });
    } catch (error) {
      setLoadingErrorList([
        error instanceof Error ? error.message : "An unknown error occurred",
      ]);
    }
  };

  useEffect(() => {
    document.title = "Game Catalog";
    fetchGames();
  }, [searchParams, auth.user?.access_token]);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push(`/catalog?name=${nameSearch}&page=1`);
  };

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setNameSearch(value);

    if (value === "") {
      router.push("/catalog?page=1");
    }
  };

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

  if (gamesPage === null || paginationInfo === null) {
    return (
      <p className="mt-3">
        <em>Loading...</em>
      </p>
    );
  }

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
