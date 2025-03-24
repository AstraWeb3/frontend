/**
 * @file This file contains the implementation of a reliable Http Client. This is used for API calls
 * or any external servics across the system.
 *
 * @copyright (C) Astra.  All rights reserved.
 * @author Giovanny Hernandez
 */

import axios, { AxiosRequestConfig, AxiosResponse, Method, AxiosHeaders, AxiosInstance } from 'axios';

export class ReliableHttpClientResponseContent<T> {
  readonly content: T;
  readonly serializedContent: string;
  readonly responseHeaders: AxiosHeaders;

  constructor(content: T, serializedContent: string, responseHeaders: AxiosHeaders) {
    this.content = content;
    this.serializedContent = serializedContent;
    this.responseHeaders = responseHeaders;
  }
}

export class ReliableHttpClientRequest<T> {
  readonly httpMethod: Method | string;
  readonly uri: string;
  readonly content: T;
  readonly headers: Record<string, string>;
  readonly callName: string | null;

  constructor(
    httpMethod: Method,
    uri: string,
    content: T,
    headers: Record<string, string> = {},
    callName: string | null = null
  ) {
    this.httpMethod = httpMethod;
    this.uri = uri;
    this.content = content;
    this.headers = headers;
    this.callName = callName;

    // Validate HTTP method
    if (!['GET', 'PUT', 'POST', 'DELETE'].includes(this.httpMethod)) {
      throw new Error(`HTTP method ${this.httpMethod} is not supported.`);
    }
  }
}

export class ReliableHttpClient {
  private static readonly retryDelayBackOffMultiplier = 1.5;
  private static readonly retryDelayScalingLogBase = 5;

  public static createHttpClient(timeout: number, baseUri: string | null = null): AxiosInstance {
    const config: AxiosRequestConfig = {
      baseURL: baseUri || undefined,
      timeout: timeout > 0 ? timeout : 1,
    };

    return axios.create(config);
  }

  public static async tryDeserializeResponseContent<TResult>(
    response: AxiosResponse,
    ignoreErrors = true,
    traceContent = false
  ): Promise<ReliableHttpClientResponseContent<TResult>> {
    let serializedResponseContent = '';
    let responseContent: TResult | null = null;

    try {
      if (response.data != null) {
        serializedResponseContent = JSON.stringify(response.data);

        if (traceContent) {
          console.debug('Response Content:', {
            method: response.config.method,
            url: response.config.url,
            status: response.status,
            statusText: response.statusText,
            content: serializedResponseContent,
          });
        }

        responseContent = response.data as TResult;
      } else {
        console.warn('No content in the response.');
      }
    } catch (error) {
      console.error('Failed to deserialize the response content:', error);

      if (!ignoreErrors) {
        throw error;
      }
    }

    if (!ignoreErrors && !responseContent) {
      throw new Error(
        `${response.config.method?.toUpperCase()} ${response.config.url} has no content in the response.`
      );
    }

    // Add each header manually
    const axiosHeaders = new AxiosHeaders();
    Object.entries(response.headers).forEach(([key, value]) => {
      if (key && value) {
        axiosHeaders.set(key, value as string);
      }
    });

    return new ReliableHttpClientResponseContent<TResult>(
      responseContent!,
      serializedResponseContent,
      axiosHeaders
    );
  }
}

