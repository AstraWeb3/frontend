import { Genre } from "@/models/Genre";
import { Result } from "@/uitls/Result";
import { BaseClient, HttpResponseMessage } from "./BaseClient";

class GenresClient extends BaseClient {
  private baseUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

  async getGenresAsync(): Promise<Result<Genre[]>> {
    const response =
      await this.serviceClient.routeRequestWithRetries<HttpResponseMessage>(
        `${this.baseUrl}/genres`
      );

    if (!response.ok) {
      return Result.fail<any>(new Error("Failed to fetch genres"));
    }

    const data: Genre[] = await response.json();

    return Result.ok<Genre[]>(data);
  }
}
