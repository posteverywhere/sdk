import type { HttpClient } from '../client';
import type {
  Post,
  ListPostsParams,
  ListPostsResponse,
  CreatePostParams,
  CreatePostResponse,
  UpdatePostParams,
  PostResultsResponse,
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

  /** Get a single post by ID */
  async get(id: string): Promise<Post> {
    return this.client.get(`/api/v1/posts/${id}`);
  }

  /** Create and schedule a post */
  async create(params: CreatePostParams): Promise<CreatePostResponse> {
    return this.client.post('/api/v1/posts', params);
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
}
