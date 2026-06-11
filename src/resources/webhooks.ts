import type { HttpClient } from '../client';
import type {
  Webhook,
  WebhookWithSecret,
  ListWebhooksResponse,
  CreateWebhookParams,
  UpdateWebhookParams,
  TestWebhookResponse,
} from '../types';

/**
 * Webhooks — subscribe to event streams (post.published, post.failed,
 * account.reconnect_needed, etc.) instead of polling.
 *
 * See the [Webhooks guide](https://docs.posteverywhere.ai/webhooks) for
 * signature verification, retry policy, and event payload reference.
 */
export class Webhooks {
  constructor(private client: HttpClient) {}

  /** List webhook subscriptions for the current organization. */
  async list(): Promise<ListWebhooksResponse> {
    return this.client.get('/api/v1/webhooks');
  }

  /** Get one webhook subscription (secret is NOT included). */
  async get(id: string): Promise<Webhook> {
    return this.client.get(`/api/v1/webhooks/${id}`);
  }

  /**
   * Create a webhook subscription.
   *
   * The `secret` field in the response is shown ONLY ONCE — save it now.
   * Use it to verify the `X-PostEverywhere-Signature` header on every
   * incoming webhook request.
   */
  async create(params: CreateWebhookParams): Promise<WebhookWithSecret> {
    return this.client.post('/api/v1/webhooks', params);
  }

  /** Update a webhook (url/events/name/description/is_active). */
  async update(id: string, params: UpdateWebhookParams): Promise<Webhook> {
    return this.client.patch(`/api/v1/webhooks/${id}`, params);
  }

  /** Delete a webhook (cascades the delivery history). */
  async delete(id: string): Promise<{ id: string; deleted: boolean }> {
    return this.client.delete(`/api/v1/webhooks/${id}`);
  }

  /**
   * Send a synthetic test ping to a webhook so you can verify your
   * endpoint received the request + correctly validated the signature.
   */
  async test(id: string): Promise<TestWebhookResponse> {
    return this.client.post(`/api/v1/webhooks/${id}/test`);
  }
}
