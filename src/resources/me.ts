import type { HttpClient } from '../client';
import type { MeResponse } from '../types';

/**
 * Introspection — `/v1/me`.
 * Returns current API key context, organization, scopes, plan limits, and quota.
 */
export class Me {
  constructor(private client: HttpClient) {}

  /** Get current API key + organization + quota context. */
  async get(): Promise<MeResponse> {
    return this.client.get('/api/v1/me');
  }
}
