import type { HttpClient } from '../client';
import type {
  Post,
  ListPostsParams,
  ListPostsResponse,
  CreatePostParams,
  CreatePostResponse,
  UpdatePostParams,
  PostResultsResponse,
  ListPostsAdvancedParams,
  BulkCreatePostsResponse,
  RetryFailedPostsParams,
  RetryFailedPostsResponse,
} from '../types';

export class Posts {
  constructor(private client: HttpClient) {}

  /** List posts with optional filters */
  async list(params?: ListPostsParams): Promise<ListPostsResponse> {
    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    if (params?.platform) query.set('platform', params.platform);
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.offset) query.set('offset', String(params.offset));
    const qs = query.toString();
    return this.client.get(`/api/v1/posts${qs ? `?${qs}` : ''}`);
  }

  /**
   * List posts with the FULL set of v1 filters (since 2026-06-11):
   * comma-separated multi-status, multi-platform, account_id, campaign_id,
   * date ranges, content search, sort + order.
   *
   * The basic `list()` method is kept for backwards compatibility; use this
   * for any non-trivial query.
   */
  async listAdvanced(params?: ListPostsAdvancedParams): Promise<ListPostsResponse> {
    const query = new URLSearchParams();
    for (const [k, v] of Object.entries(params || {})) {
      if (v !== undefined && v !== null) query.set(k, String(v));
    }
    const qs = query.toString();
    return this.client.get(`/api/v1/posts${qs ? `?${qs}` : ''}`);
  }

  /** Get a single post by ID */
  async get(id: string): Promise<Post> {
    return this.client.get(`/api/v1/posts/${id}`);
  }

  /** Create and schedule a post */
  async create(params: CreatePostParams): Promise<CreatePostResponse> {
    return this.client.post('/api/v1/posts', params);
  }

  /**
   * Create up to 50 posts in a single API call (counts as ONE API-rate-limit hit).
   * Returns per-item success/error so you can handle partial failures.
   */
  async bulkCreate(posts: CreatePostParams[]): Promise<BulkCreatePostsResponse> {
    return this.client.post('/api/v1/posts/bulk', { posts });
  }

  /** Update a scheduled or draft post */
  async update(id: string, params: UpdatePostParams): Promise<Post> {
    return this.client.patch(`/api/v1/posts/${id}`, params);
  }

  /** Delete a post */
  async delete(id: string): Promise<{ message: string }> {
    return this.client.delete(`/api/v1/posts/${id}`);
  }

  /** Get per-platform publish results */
  async results(id: string): Promise<PostResultsResponse> {
    return this.client.get(`/api/v1/posts/${id}/results`);
  }

  /** Retry all failed destinations for a post */
  async retry(id: string): Promise<{ message: string; retried: number }> {
    return this.client.post(`/api/v1/posts/${id}/retry`);
  }

  /**
   * Bulk-retry every failed destination matching a filter (account_id,
   * platform, date range, post_ids). Refuses when no filter is supplied.
   */
  async retryFailed(params: RetryFailedPostsParams): Promise<RetryFailedPostsResponse> {
    return this.client.post('/api/v1/posts/retry-failed', params);
  }
}
