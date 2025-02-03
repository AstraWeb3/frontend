/**
 * @file This file contains the implementation of the Result Pattern. This is used for API calls
 * or any external servics across the codebase.
 *
 * @copyright (C) Giovanny Hernandez.  All rights reserved.
 */

export class Result<T> {
  public isSuccess: boolean;
  public isFailure: boolean;

  private value: T;

  private constructor(isSuccess: boolean, value?: T) {
    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this.value = value as T;
  }

  public static ok<U>(value?: U): Result<U> {
    return new Result<U>(true, value);
  }

  public static fail<U>(error: U): Result<U> {
    return new Result<U>(false, error);
  }

  public getData(): T {
    if (!this.isSuccess) {
      throw new Error(
        "Cannot get the value of an error result. Use 'getError' method instead."
      );
    }

    return this.value;
  }

  public getValue(): T | null {
    return this.isSuccess ? this.value : null;
  }

  public getError(): T | null {
    return this.isSuccess ? null : this.value;
  }

  public getFormattedError(): string {
    if (this.isSuccess) return "";

    const v = this.value as any;

    if (!v.response?.data?.error) {
      return "An error occurred";
    }

    const error = new Error(v.response.data.error);
    return `${v.response.status} ${v.response.statusText}: ${error.formattedError}`;
  }

  public statusCode(): number {
    const v = this.value as any;
    if (v.status) {
      return v.status;
    }

    if (v.response?.status) {
      return v.response.status;
    }
    return -1;
  }
}

export class Error {
  constructor(public errorObj: any) {}

  get isDocumentedErrorType(): boolean {
    if (typeof this.errorObj === "object") {
      if (
        typeof this.errorObj?.message === "string" &&
        typeof this.errorObj?.code === "number" &&
        Array.isArray(this.errorObj?.errors)
      ) {
        return true;
      }
    }
    return false;
  }

  get formattedError(): string {
    if (this.isDocumentedErrorType) {
      const { message, code, errors } = this.errorObj;
      return `${code}: ${message} - ${errors.join(", ")}`;
    }
    if (typeof this.errorObj?.message === "string") {
      if (this.errorObj.message.startsWith("%{")) {
        return this.errorObj.message
          .split(/[\"%{}\[\]]/)
          .filter((x: string) => Boolean(x))
          .map((x: string) => x.trim().replace(/:$/, ""))
          .join(" - ");
      }
      return this.errorObj.message;
    }
    return "unknown error";
  }
}
