import type { PostEverywhereConfig, ApiResponse, ApiError } from './types';
import {
  PostEverywhereError,
  AuthenticationError,
  RateLimitError,
  ValidationError,
  InsufficientCreditsError,
} from './errors';

const BASE_URL = 'https://app.posteverywhere.ai';
const DEFAULT_TIMEOUT = 120_000; // 2 minutes (AI generation can be slow)
const DEFAULT_MAX_RETRIES = 2;

export class HttpClient {
  private apiKey: string;
  private timeout: number;
  private maxRetries: number;

  constructor(config: PostEverywhereConfig) {
    if (!config.apiKey) {
      throw new Error('PostEverywhere API key is required. Get one at https://app.posteverywhere.ai/developers');
    }
    if (!config.apiKey.startsWith('pe_live_')) {
      throw new Error('Invalid API key format. Keys start with "pe_live_"');
    }

    this.apiKey = config.apiKey;
    this.timeout = config.timeout || DEFAULT_TIMEOUT;
    this.maxRetries = config.maxRetries ?? DEFAULT_MAX_RETRIES;
  }

  async request<T>(method: string, path: string, body?: any): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        const headers: Record<string, string> = {
          'Authorization': `Bearer ${this.apiKey}`,
          'User-Agent': 'posteverywhere-sdk/1.0.0',
        };

        if (body && !(body instanceof FormData)) {
          headers['Content-Type'] = 'application/json';
        }

        const response = await fetch(`${BASE_URL}${path}`, {
          method,
          headers,
          body: body ? (body instanceof FormData ? body : JSON.stringify(body)) : undefined,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // Rate limited — retry with backoff
        if (response.status === 429 && attempt < this.maxRetries) {
          const retryAfter = parseInt(response.headers.get('Retry-After') || '5', 10);
          await this.sleep(retryAfter * 1000);
          continue;
        }

        const data = await response.json() as ApiResponse<T> | ApiError;

        if (!response.ok || data.error) {
          const error = (data as ApiError).error;
          const message = error?.message || `Request failed with status ${response.status}`;
          const code = error?.code;
          const requestId = (data as any).meta?.request_id;

          if (response.status === 401) throw new AuthenticationError(message, requestId);
          if (response.status === 429) throw new RateLimitError(message, undefined, requestId);
          if (response.status === 400) throw new ValidationError(message, error?.details, requestId);
          if (response.status === 402) throw new InsufficientCreditsError(message, error?.details, requestId);
          throw new PostEverywhereError(message, response.status, code, requestId, error?.details);
        }

        return (data as ApiResponse<T>).data;
      } catch (err: any) {
        lastError = err;

        // Don't retry on auth/validation errors
        if (err instanceof AuthenticationError || err instanceof ValidationError || err instanceof InsufficientCreditsError) {
          throw err;
        }

        // Retry on network/timeout errors
        if (err.name === 'AbortError' && attempt < this.maxRetries) {
          await this.sleep(1000 * (attempt + 1));
          continue;
        }

        if (err instanceof PostEverywhereError) throw err;
      }
    }

    throw lastError || new Error('Request failed after retries');
  }

  async get<T>(path: string): Promise<T> {
    return this.request<T>('GET', path);
  }

  async post<T>(path: string, body?: any): Promise<T> {
    return this.request<T>('POST', path, body);
  }

  async patch<T>(path: string, body?: any): Promise<T> {
    return this.request<T>('PATCH', path, body);
  }

  async delete<T>(path: string): Promise<T> {
    return this.request<T>('DELETE', path);
  }

  // Upload binary to a presigned URL (not authenticated via API key)
  async uploadToPresignedUrl(url: string, file: Blob, contentType: string): Promise<void> {
    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': contentType },
      body: file,
    });

    if (!response.ok) {
      throw new PostEverywhereError(
        `File upload failed: ${response.status} ${response.statusText}`,
        response.status
      );
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
