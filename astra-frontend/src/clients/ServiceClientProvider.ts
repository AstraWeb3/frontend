import { IServiceClient, ServiceClient } from "./BaseClient";

export class ServiceClientProvider {
  private static serviceClient: IServiceClient;

  private constructor() {}

  public static getServiceClient(): IServiceClient {
    if (!ServiceClientProvider.serviceClient) {
      ServiceClientProvider.serviceClient = new ServiceClient();
    }

    return ServiceClientProvider.serviceClient;
  }
}
