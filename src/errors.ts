export class PostEverywhereError extends Error {
  public readonly status: number;
  public readonly code: string | undefined;
  public readonly requestId: string | undefined;
  public readonly details: any;

  constructor(message: string, status: number, code?: string, requestId?: string, details?: any) {
    super(message);
    this.name = 'PostEverywhereError';
    this.status = status;
    this.code = code;
    this.requestId = requestId;
    this.details = details;
  }
}

export class AuthenticationError extends PostEverywhereError {
  constructor(message: string, requestId?: string) {
    super(message, 401, 'authentication_failed', requestId);
    this.name = 'AuthenticationError';
  }
}

export class RateLimitError extends PostEverywhereError {
  public readonly retryAfter: number | undefined;

  constructor(message: string, retryAfter?: number, requestId?: string) {
    super(message, 429, 'rate_limit_exceeded', requestId);
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
  }
}

export class ValidationError extends PostEverywhereError {
  constructor(message: string, details?: any, requestId?: string) {
    super(message, 400, 'validation_error', requestId, details);
    this.name = 'ValidationError';
  }
}

export class InsufficientCreditsError extends PostEverywhereError {
  constructor(message: string, details?: any, requestId?: string) {
    super(message, 402, 'insufficient_credits', requestId, details);
    this.name = 'InsufficientCreditsError';
  }
}
