import type { HttpClient } from '../client';
import type { Account, ListAccountsResponse } from '../types';

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
}
