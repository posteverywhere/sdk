import type { HttpClient } from '../client';
import type { Account, ListAccountsResponse, AccountHealth } from '../types';

export class Accounts {
  constructor(private client: HttpClient) {}

  /** List all connected social accounts */
  async list(): Promise<ListAccountsResponse> {
    return this.client.get('/api/v1/accounts');
  }

  /** Get a single account by ID */
  async get(id: number): Promise<Account> {
    return this.client.get(`/api/v1/accounts/${id}`);
  }

  /**
   * Get the health state of an account: token expiry, last publish, recent
   * failure counts, `needs_reconnection` flag, can-post boolean.
   * Use this before publishing to detect a dead token in advance.
   */
  async health(id: number): Promise<AccountHealth> {
    return this.client.get(`/api/v1/accounts/${id}/health`);
  }
}
