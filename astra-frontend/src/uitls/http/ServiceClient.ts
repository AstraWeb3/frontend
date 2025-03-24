import { v4 as uuidv4 } from "uuid"; // Use this for generating GUIDs
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  Method,
} from "axios";
import { ReliableHttpClient, ReliableHttpClientRequest } from "./HttpClient";

export class ServiceClient {
  public async routeRequestWithRetries<TRequest, TResult>(
    subscriptionId: string,
    resourceGroupName: string,
    resourceName: string,
    requestInput: TRequest,
    request: AxiosRequestConfig,
    httpRequestHandlingDeadline: Date
  ): Promise<TResult> {
    const requestPathAndQuery = request.url || "";

    const cloudServiceResourcePath = ""; // Define this based on your logic
    const httpClient = this.getHttpClient(subscriptionId);
    const cloudServiceAbsoluteUri = new URL(
      cloudServiceResourcePath,
      httpClient.defaults.baseURL
    );

    const httpMethod = request.method as Method; // Cast it to the correct type

    if (!httpMethod) throw new Error("HTTP Method is undefined.");

    console.log(
      `Forwarding request ${
        request.method
      } ${cloudServiceAbsoluteUri.toString()}`
    );

    // Generate or retrieve the correlation ID
    let correlationId = uuidv4();
    if (!correlationId) {
      correlationId = this.getCorrelationId(request); // Custom helper method
    }

    const headers = this.createCloudServiceRequestHeaders(
      correlationId,
      resourceGroupName,
      resourceName,
      httpRequestHandlingDeadline
    );

    const reliableHttpClientRequest: ReliableHttpClientRequest<TRequest> = {
      httpMethod,
      uri: cloudServiceAbsoluteUri.toString(),
      content: requestInput,
      headers,
      callName: "RouteRequestWithRetries", // Example value; adapt as needed
    };

    return this.callCloudServiceWithRetries<TRequest, TResult>(
      httpClient,
      reliableHttpClientRequest
    );
  }

  private getHttpClient(subscriptionId: string): AxiosInstance {
    return axios.create({
      baseURL: `https://example.com/subscriptions/${subscriptionId}`,
      timeout: 10000,
    });
  }

  private createCloudServiceRequestHeaders(
    correlationId: string,
    resourceGroupName: string,
    resourceName: string,
    httpRequestHandlingDeadline: Date
  ): Record<string, string> {
    return {
      "Correlation-Id": correlationId,
      "Resource-Group": resourceGroupName,
      "Resource-Name": resourceName,
      "Request-Deadline": httpRequestHandlingDeadline.toISOString(),
    };
  }

  private getCorrelationId(request: AxiosRequestConfig): string {
    return request.headers?.["Correlation-Id"] || uuidv4();
  }

  private async callCloudServiceWithRetries<TRequest, TResult>(
    httpClient: AxiosInstance,
    request: ReliableHttpClientRequest<TRequest>
  ): Promise<TResult> {
    try {
      // Use ReliableHttpClient to make the request and deserialize the response
      const response =
        await ReliableHttpClient.tryDeserializeResponseContent<TResult>(
          await httpClient.request({
            method: request.httpMethod,
            url: request.uri,
            data: request.content,
            headers: request.headers,
          }),
          true // ignoreErrors (optional)
        );

      console.log("GOT DATA FROM SERVICE: " + response);

      return response.content; // Return the deserialized content
    } catch (error) {
      console.log(`Error during cloud service call: ${error}`);
      throw error;
    }
  }
}
