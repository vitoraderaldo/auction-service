export interface ErrorParser {
  getErrorCode(): string;
  getErrorDetails(): any;
  getNonSensitiveErrorDetails(): any;
  getHttpStatus(): number;
}
