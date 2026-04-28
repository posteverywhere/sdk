import { HttpClient } from './client';
import { Accounts } from './resources/accounts';
import { Posts } from './resources/posts';
import { Media } from './resources/media';
import { AI } from './resources/ai';
import type { PostEverywhereConfig } from './types';

/**
 * PostEverywhere SDK
 *
 * Schedule and publish to all social media platforms from code.
 *
 * @example
 * ```typescript
 * import PostEverywhere from 'posteverywhere';
 *
 * const client = new PostEverywhere({ apiKey: 'pe_live_...' });
 *
 * // List connected accounts
 * const { accounts } = await client.accounts.list();
 *
 * // Create and publish a post
 * const post = await client.posts.create({
 *   content: 'Hello from the API!',
 *   account_ids: [accounts[0].id],
 *   publish_now: true,
 * });
 *
 * // Upload media and attach to a post
 * const fs = require('fs');
 * const media = await client.media.upload(
 *   fs.readFileSync('photo.jpg'),
 *   { filename: 'photo.jpg', contentType: 'image/jpeg' }
 * );
 * await client.posts.create({
 *   content: 'Check out this photo!',
 *   media_ids: [media.id],
 *   publish_now: true,
 * });
 *
 * // Generate an AI image
 * const image = await client.ai.generateImage({
 *   prompt: 'A sunset over mountains',
 *   model: 'flux-schnell',
 * });
 * ```
 */
class PostEverywhere {
  public readonly accounts: Accounts;
  public readonly posts: Posts;
  public readonly media: Media;
  public readonly ai: AI;

  constructor(config: PostEverywhereConfig) {
    const client = new HttpClient(config);
    this.accounts = new Accounts(client);
    this.posts = new Posts(client);
    this.media = new Media(client);
    this.ai = new AI(client);
  }
}

export default PostEverywhere;

// Named export for ESM
export { PostEverywhere };

// Re-export types and errors
export type {
  PostEverywhereConfig,
  Account,
  ListAccountsResponse,
  Post,
  PostDestination,
  PostStatus,
  ListPostsParams,
  ListPostsResponse,
  CreatePostParams,
  CreatePostResponse,
  UpdatePostParams,
  PostResultsResponse,
  MediaItem,
  MediaType,
  ListMediaParams,
  ListMediaResponse,
  UploadMediaParams,
  UploadResponse,
  CompleteMediaResponse,
  AIModel,
  AspectRatio,
  GenerateImageParams,
  GenerateImageResponse,
} from './types';

export {
  PostEverywhereError,
  AuthenticationError,
  RateLimitError,
  ValidationError,
  InsufficientCreditsError,
} from './errors';
