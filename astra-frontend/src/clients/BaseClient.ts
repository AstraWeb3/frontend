import { ServiceClientProvider } from "./ServiceClientProvider";

export class BaseClient {
  public accessToken: string | null = null;

  public serviceClient: ServiceClient =
    ServiceClientProvider.getServiceClient();

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

export interface IServiceClient {
  accessToken: string | null;
  routeRequestWithRetries<T>(url: string, options?: RequestInit): Promise<T>;
  handleRequestError(response: HttpResponseMessage): Promise<string[]>;
}

export class ServiceClient implements IServiceClient {
  public accessToken: string | null = null;

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

    try {
      const response = await fetch(url, updatedOptions);
      return response as T;
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error(
          "Unable to connect to the server. Please check your internet connection."
        );
      }
      throw error;
    }
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
}
