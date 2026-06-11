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

export type CaptionTone = 'professional' | 'casual' | 'witty' | 'enthusiastic' | 'urgent' | 'inspirational';
export type CaptionLength = 'short' | 'medium' | 'long';
export type CaptionPlatform = 'instagram' | 'facebook' | 'x' | 'twitter' | 'linkedin' | 'youtube' | 'tiktok' | 'threads' | 'pinterest' | 'bluesky';

export interface GenerateCaptionParams {
  topic: string;
  platform?: CaptionPlatform;
  tone?: CaptionTone;
  length?: CaptionLength;
  include_hashtags?: boolean;
  include_emojis?: boolean;
  count?: number;
}

export interface GenerateCaptionResponse {
  captions: string[];
  platform: CaptionPlatform | null;
  tone: CaptionTone;
  length: CaptionLength;
  count_requested: number;
  count_returned: number;
  credits_used: number;
  credits_remaining: number;
}

// ─── Introspection ──────────────────────────────────────────

export interface MeResponse {
  api_key: {
    id: string;
    key_prefix: string;
    name: string;
    scopes: string[];
    last_used_at: string;
    created_at: string;
    expires_at: string | null;
  } | null;
  scopes: string[];
  user: { id: number; email: string; name: string };
  organization: {
    id: string;
    name: string;
    subscription_plan: string;
    subscription_status: string;
    subscription_source: string | null;
    trial_end: string | null;
    current_period_end: string | null;
    cancel_at_period_end: boolean;
    entitled: boolean;
  };
  workspace: { id: string; name: string };
  quota: {
    accounts: { used: number; limit: number };
    ai_credits: { used: number; limit: number; bonus: number };
    storage_bytes: { used: number; limit: number };
    team_seats: { limit: number };
  };
  stats: { posts_last_30d: number; total_posts: number };
}

// ─── Campaigns ──────────────────────────────────────────────

export interface Campaign {
  id: number;
  name: string;
  description: string | null;
  color: string;
  status: 'active' | 'archived';
  post_count: number;
  created_at: string;
  updated_at: string;
}

export interface ListCampaignsParams {
  status?: 'active' | 'archived';
  limit?: number;
  offset?: number;
}

export interface ListCampaignsResponse {
  campaigns: Campaign[];
  pagination: { limit: number; offset: number; total: number; has_more: boolean };
}

export interface CreateCampaignParams {
  name: string;
  description?: string;
  color?: string; // hex #RRGGBB
  status?: 'active' | 'archived';
}

export interface UpdateCampaignParams {
  name?: string;
  description?: string;
  color?: string;
  status?: 'active' | 'archived';
}

// ─── Analytics ──────────────────────────────────────────────

export interface AnalyticsSummaryParams {
  period?: 'today' | 'week' | 'month' | 'all' | 'custom';
  from?: string;
  to?: string;
}

export interface AnalyticsSummaryResponse {
  period: string;
  range: { from: string | null; to: string };
  posts: {
    total: number;
    draft: number;
    scheduled: number;
    publishing: number;
    published: number;
    partially_failed: number;
    failed: number;
  };
  by_platform: Array<{
    platform: string;
    total: number;
    scheduled: number;
    published: number;
    failed: number;
  }>;
  metrics: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
    impressions: number;
    clicks: number;
  };
  ai_credits: { used_this_period: number; bonus: number };
}

// ─── Account Health ─────────────────────────────────────────

export interface AccountHealth {
  account_id: number;
  platform: string;
  account_name: string;
  platform_account_id: string;
  status: 'healthy' | 'warning' | 'broken';
  can_post: boolean;
  reasons: string[];
  is_active: boolean;
  needs_reconnection: boolean;
  needs_reconnection_since: string | null;
  token: {
    expires_at: string | null;
    last_refresh: string | null;
    expired: boolean;
    expiring_soon: boolean;
  };
  activity: {
    last_published_at: string | null;
    failures_last_7d: number;
    permanent_failures_last_7d: number;
    queued_count: number;
  };
  connected_at: string;
}

// ─── Webhooks ───────────────────────────────────────────────

export type WebhookEventType =
  | 'post.scheduled'
  | 'post.publishing'
  | 'post.published'
  | 'post.failed'
  | 'post.partially_failed'
  | 'post.updated'
  | 'post.deleted'
  | 'account.connected'
  | 'account.disconnected'
  | 'account.reconnect_needed'
  | 'media.uploaded'
  | 'media.deleted';

export interface Webhook {
  id: string;
  url: string;
  events: WebhookEventType[];
  name: string | null;
  description: string | null;
  is_active: boolean;
  consecutive_failures: number;
  auto_disabled_at: string | null;
  last_delivery_at: string | null;
  last_success_at: string | null;
  last_failure_at: string | null;
  created_at: string;
  updated_at: string;
}

/** The secret field is returned ONLY ONCE — on create. Never on read. */
export interface WebhookWithSecret extends Webhook {
  secret: string;
  secret_warning: string;
}

export interface ListWebhooksResponse {
  webhooks: Webhook[];
}

export interface CreateWebhookParams {
  url: string;
  events: WebhookEventType[];
  name?: string;
  description?: string;
}

export interface UpdateWebhookParams {
  url?: string;
  events?: WebhookEventType[];
  name?: string;
  description?: string;
  is_active?: boolean;
}

export interface TestWebhookResponse {
  ok: boolean;
  status: number;
  duration_ms: number;
  error: string | null;
  message: string;
}

// ─── Advanced Post Filters ──────────────────────────────────

export interface ListPostsAdvancedParams {
  /** Comma-separated, e.g. 'scheduled,published'. Valid: scheduled, publishing, published, partially_failed, failed, draft. */
  status?: string;
  /** Comma-separated, e.g. 'instagram,facebook'. */
  platform?: string;
  account_id?: number;
  campaign_id?: number;
  created_after?: string;
  created_before?: string;
  scheduled_after?: string;
  scheduled_before?: string;
  published_after?: string;
  published_before?: string;
  /** For incremental sync polling — only return posts whose updated_at >= this. */
  updated_after?: string;
  /** Full-text search on post content. */
  search?: string;
  sort?: 'created_at' | 'scheduled_for' | 'published_at' | 'updated_at';
  order?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

// ─── Bulk Posts ─────────────────────────────────────────────

export interface BulkCreatePostResult {
  index: number;
  ok: boolean;
  post?: CreatePostResponse;
  error?: { code: string; message: string; status?: number; details?: any };
}

export interface BulkCreatePostsResponse {
  summary: { total: number; succeeded: number; failed: number };
  results: BulkCreatePostResult[];
}

export interface RetryFailedPostsParams {
  /** Up to 200 specific post UUIDs to retry failed destinations on. */
  post_ids?: string[];
  account_id?: number;
  platform?: string;
  failed_after?: string;
  failed_before?: string;
  max_attempts?: number;
}

export interface RetryFailedPostsResponse {
  retried_count: number;
  destinations: Array<{
    destination_id: string;
    post_id: string;
    platform: string;
    new_status: 'queued';
  }>;
  message: string;
}
