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
}
