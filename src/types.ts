// ─── Configuration ──────────────────────────────────────────

export interface PostEverywhereConfig {
  apiKey: string;
  timeout?: number;
  maxRetries?: number;
}

// ─── API Response Envelope ──────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  error: null;
  meta: { request_id: string; timestamp: string };
}

export interface ApiError {
  data: null;
  error: { message: string; code?: string; details?: any };
  meta: { request_id: string; timestamp: string };
}

// ─── Accounts ───────────────────────────────────────────────

export interface Account {
  id: number;
  platform: 'instagram' | 'facebook' | 'x' | 'linkedin' | 'youtube' | 'tiktok' | 'threads';
  platform_user_id: string;
  platform_username: string;
  display_name: string;
  avatar_url: string | null;
  is_active: boolean;
  health: {
    status: 'healthy' | 'expired' | 'expiring_critical' | 'rate_limited' | 'api_error';
    message: string | null;
  } | null;
}

export interface ListAccountsResponse {
  accounts: Account[];
  total: number;
}

// ─── Posts ───────────────────────────────────────────────────

export type PostStatus = 'queued' | 'done' | 'failed';

export interface PostDestination {
  id: string;
  platform: string;
  social_account_id: number;
  status: PostStatus;
  platform_post_id: string | null;
  published_at: string | null;
  last_error: any | null;
}

export interface Post {
  id: string;
  content: string;
  scheduled_for: string;
  post_status: string;
  created_at: string;
  updated_at: string;
  destinations?: PostDestination[];
}

export interface ListPostsParams {
  status?: PostStatus;
  platform?: string;
  limit?: number;
  offset?: number;
}

export interface ListPostsResponse {
  posts: Post[];
  total: number;
  limit: number;
  offset: number;
}

export interface CreatePostParams {
  content: string;
  /** Array of social account IDs (from GET /v1/accounts). */
  account_ids: number[];
  /** ISO 8601 datetime to schedule the post (e.g. '2026-04-01T09:00:00Z'). Omit to publish immediately. */
  scheduled_for?: string;
  /** @deprecated Use `scheduled_for` instead. Accepted as an alias for backwards compatibility. */
  scheduled_at?: string;
  /** IANA timezone (e.g. 'America/New_York'). Defaults to 'UTC'. */
  timezone?: string;
  /** Media UUIDs from uploads to attach. */
  media_ids?: string[];
  /** Platform-specific content overrides (e.g. shorter X caption). */
  platform_content?: Record<string, any>;
}

export interface CreatePostResponse {
  post_id: string;
  post_group_id: string;
  destinations: number;
  status: string;
  scheduled_for: string;
  message: string;
}

export interface UpdatePostParams {
  content?: string;
  /** New ISO 8601 datetime to reschedule the post. */
  scheduled_for?: string;
  /** @deprecated Use `scheduled_for` instead. Accepted as an alias for backwards compatibility. */
  scheduled_at?: string;
  timezone?: string;
  account_ids?: number[];
  media_ids?: string[];
}

export interface PostResultsResponse {
  post_id: string;
  content: string;
  scheduled_for: string;
  results: PostDestination[];
}

// ─── Media ──────────────────────────────────────────────────

export type MediaType = 'image' | 'video' | 'document';

export interface MediaItem {
  id: string;
  filename: string;
  media_type: MediaType;
  mime_type: string;
  file_size: number;
  upload_status: 'uploading' | 'ready' | 'failed';
  thumbnail_url: string | null;
  created_at: string;
}

export interface ListMediaParams {
  type?: MediaType;
  limit?: number;
  offset?: number;
}

export interface ListMediaResponse {
  media: MediaItem[];
  total: number;
}

export interface UploadMediaParams {
  filename: string;
  content_type: string;
  file_size: number;
}

export interface UploadResponse {
  media_id: string;
  upload_url: string;
  provider: string;
  expires_in: number;
}

export interface CompleteMediaResponse {
  id: string;
  status: string;
  type: string;
  thumbnail_url?: string;
  message: string;
}

// ─── AI ─────────────────────────────────────────────────────

export type AIModel = 'nano-banana-pro' | 'ideogram-v2' | 'gemini-3-pro' | 'flux-schnell';
export type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4' | '4:5' | '5:4';

export interface GenerateImageParams {
  prompt: string;
  model?: AIModel;
  aspect_ratio?: AspectRatio;
}

export interface GenerateImageResponse {
  media_id: string;
  model: string;
  aspect_ratio: string;
  credits_used: number;
  credits_remaining: number;
  message: string;
}
