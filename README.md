# PostEverywhere — Official Node.js SDK

[![npm version](https://img.shields.io/npm/v/posteverywhere.svg?style=flat-square)](https://www.npmjs.com/package/posteverywhere)
[![npm downloads](https://img.shields.io/npm/dw/posteverywhere.svg?style=flat-square)](https://www.npmjs.com/package/posteverywhere)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg?style=flat-square)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/posteverywhere/sdk?style=flat-square)](https://github.com/posteverywhere/sdk)

The official Node.js / TypeScript SDK for [PostEverywhere](https://posteverywhere.ai) — schedule and publish posts to **Instagram, TikTok, YouTube, LinkedIn, Facebook, X (Twitter), Threads, and Pinterest** from a single API. Build social media scheduling, content automation, and AI agent workflows in minutes.

> 💡 **Building an AI agent?** Try the companion [`@posteverywhere/mcp`](https://www.npmjs.com/package/@posteverywhere/mcp) package — a [Model Context Protocol](https://modelcontextprotocol.io) server that lets Claude Code, Claude Desktop, Cursor, and other MCP-compatible clients schedule posts using natural language.

## 🔗 Quick Links

| Resource | URL |
|---|---|
| 🌐 **Homepage** | [posteverywhere.ai](https://posteverywhere.ai) |
| 🛠️ **Developers landing page** | [posteverywhere.ai/developers](https://posteverywhere.ai/developers) |
| 📖 **API Documentation** | [developers.posteverywhere.ai](https://developers.posteverywhere.ai) |
| 📦 **This SDK on npm** | [npmjs.com/package/posteverywhere](https://www.npmjs.com/package/posteverywhere) |
| 💻 **This SDK on GitHub** | [github.com/posteverywhere/sdk](https://github.com/posteverywhere/sdk) |
| 🤖 **MCP server (npm)** | [npmjs.com/package/@posteverywhere/mcp](https://www.npmjs.com/package/@posteverywhere/mcp) |
| 🤖 **MCP server (GitHub)** | [github.com/posteverywhere/mcp](https://github.com/posteverywhere/mcp) |
| 🎛️ **Dashboard** | [app.posteverywhere.ai](https://app.posteverywhere.ai) |
| 🔑 **Get an API key** | [app.posteverywhere.ai/developers](https://app.posteverywhere.ai/developers) |
| 💵 **Pricing** | [posteverywhere.ai/pricing](https://posteverywhere.ai/pricing) |
| 📚 **Help Center** | [posteverywhere.ai/support](https://posteverywhere.ai/support) |
| 🐛 **Issues / bug reports** | [github.com/posteverywhere/sdk/issues](https://github.com/posteverywhere/sdk/issues) |
| 📧 **Support** | [support@posteverywhere.ai](mailto:support@posteverywhere.ai) |

## Why PostEverywhere SDK?

- **One API, eight platforms** — write once, publish to Instagram, TikTok, YouTube, LinkedIn, Facebook, X, Threads, and Pinterest
- **Schedule posts** at any future time with timezone awareness
- **AI image generation** built in (Flux, Ideogram, Gemini 3, Nano Banana Pro)
- **Multi-platform publishing** with per-platform content overrides
- **Robust error handling** with typed exceptions, automatic retries, and rate-limit awareness
- **Full TypeScript support** with rich type definitions
- **AI-agent friendly** — clean REST envelope, `retryable` flags on every error, idempotency keys, circuit breaker
- **Transparent pricing** — flat plans from $19/mo, 7-day free trial, cancel anytime

A modern, API-first alternative to legacy social media management tools — designed for developers, AI agents, and automation-heavy workflows.

## Install

```bash
npm install posteverywhere
```

```bash
pnpm add posteverywhere
```

```bash
yarn add posteverywhere
```

## Quick Start

```typescript
import PostEverywhere from 'posteverywhere';

const client = new PostEverywhere({
  apiKey: 'pe_live_your_api_key_here',
});

// List connected social accounts
const { accounts } = await client.accounts.list();
console.log(accounts);

// Publish to all accounts immediately
const post = await client.posts.create({
  content: 'Hello from the PostEverywhere SDK! 🚀',
  publish_now: true,
});

// Or schedule for later
const scheduled = await client.posts.create({
  content: 'Tomorrow morning',
  scheduled_for: '2026-04-30T09:00:00Z',
  timezone: 'America/New_York',
});
```

## Getting Started

1. **[Sign up free](https://app.posteverywhere.ai/signup)** at posteverywhere.ai — 7-day free trial
2. **[Connect your social accounts](https://app.posteverywhere.ai/accounts)** in the dashboard (Instagram, TikTok, YouTube, LinkedIn, Facebook, X, Threads, Pinterest)
3. **[Create an API key](https://app.posteverywhere.ai/developers)** under Settings → Developers
4. **Install the SDK** (above) and start building
5. **[Read the full API docs](https://developers.posteverywhere.ai)** for every endpoint

## Accounts

```typescript
// List all connected social accounts across all platforms
const { accounts } = await client.accounts.list();

// Get a single account by ID
const account = await client.accounts.get(123);
```

Each account has a `health` field showing token status and whether it can post — useful for surfacing reconnect prompts to your users.

## Posts

The core of the SDK. Create, schedule, edit, retry, and delete posts across all platforms.

```typescript
// Publish immediately to ALL connected accounts
const post = await client.posts.create({
  content: 'My post content',
  publish_now: true,
});

// Schedule for later (timezone-aware)
const scheduled = await client.posts.create({
  content: 'Scheduled post',
  scheduled_for: '2026-03-20T09:00:00Z',
  timezone: 'America/New_York',
});

// Target specific accounts only
const targeted = await client.posts.create({
  content: 'Just for Instagram and TikTok',
  account_ids: [456, 789],
  publish_now: true,
});

// Attach media (upload first, then reference)
const withMedia = await client.posts.create({
  content: 'Check out this photo!',
  media_ids: ['media-uuid-here'],
  publish_now: true,
});

// Per-platform content overrides — same post, different copy per network
const customized = await client.posts.create({
  content: 'Default content',
  platform_content: {
    twitter: { content: 'Short version for X' },
    linkedin: { content: 'Longer professional version for LinkedIn...' },
  },
  publish_now: true,
});

// List posts with filters
const { posts } = await client.posts.list({ status: 'done', limit: 10 });

// Get per-platform publishing results (with platform_post_url for each)
const results = await client.posts.results('post-id');

// Retry failed destinations
await client.posts.retry('post-id');

// Update a scheduled or draft post
await client.posts.update('post-id', { content: 'Updated content' });

// Delete a post
await client.posts.delete('post-id');
```

📖 [Full posts API reference →](https://developers.posteverywhere.ai/api/create-post)

## Bulk Scheduling

Scheduled posts (with a future `scheduled_for`) bypass the per-minute publishing limit, so you can fire a month of content in parallel:

```typescript
const posts = [
  { content: 'Monday morning', scheduled_for: '2026-04-01T09:00:00Z' },
  { content: 'Wednesday update', scheduled_for: '2026-04-03T12:00:00Z' },
  { content: 'Friday wrap-up', scheduled_for: '2026-04-05T16:00:00Z' },
];

const results = await Promise.allSettled(
  posts.map(p =>
    client.posts.create({
      content: p.content,
      account_ids: [2280, 2282],
      scheduled_for: p.scheduled_for,
    })
  )
);
```

## Media

Three-step upload flow handled automatically — get presigned URL → upload bytes → mark complete.

```typescript
import fs from 'fs';

// Upload (full 3-step flow handled internally)
const media = await client.media.upload(
  fs.readFileSync('photo.jpg'),
  { filename: 'photo.jpg', contentType: 'image/jpeg' }
);

// Use it in a post
await client.posts.create({
  content: 'Photo post!',
  media_ids: [media.id],
  publish_now: true,
});

// List your media library
const { media: files } = await client.media.list({ type: 'image' });

// Delete media
await client.media.delete('media-id');
```

📖 [Media requirements per platform →](https://developers.posteverywhere.ai/media-requirements)

## AI Image Generation

Generate images from text prompts using state-of-the-art models, then post them directly.

```typescript
const image = await client.ai.generateImage({
  prompt: 'A professional social media banner with abstract green shapes',
  model: 'flux-schnell',
  aspect_ratio: '16:9',
});

await client.posts.create({
  content: 'AI-generated visual!',
  media_ids: [image.media_id],
  publish_now: true,
});
```

**Available models:** `nano-banana-pro`, `ideogram-v2`, `gemini-3-pro`, `flux-schnell`

**Aspect ratios:** `1:1`, `16:9`, `9:16`, `4:3`, `3:4`, `4:5`, `5:4`

## AI Agent Integration

The PostEverywhere API is designed to be agent-friendly:

- **`retryable: false`** on every permanent error — agents know when to stop retrying
- **Circuit breaker** on identical-content failures (after 5 retries, returns `422` with `permanent_failure_circuit_breaker`) so runaway loops can't burn rate limits
- **Stable error codes** — programmatic error handling
- **Comprehensive validation** with explicit per-platform `validation_errors`

**Using a Claude/MCP-style agent?** Skip this SDK and use [`@posteverywhere/mcp`](https://github.com/posteverywhere/mcp) instead — natural-language scheduling via the [Model Context Protocol](https://modelcontextprotocol.io). Works with [Claude Code](https://docs.claude.com/en/docs/claude-code/overview), Claude Desktop, [Cursor](https://cursor.sh), and other MCP-compatible clients.

📖 [LLM agent system prompt template →](https://developers.posteverywhere.ai/integrations/agent-system-prompt)

## Error Handling

```typescript
import PostEverywhere, {
  AuthenticationError,
  RateLimitError,
  ValidationError,
  InsufficientCreditsError,
  PostEverywhereError,
} from 'posteverywhere';

try {
  await client.posts.create({ content: 'Hello!' });
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.error('Invalid API key — check your key at posteverywhere.ai/developers');
  } else if (error instanceof RateLimitError) {
    console.error('Rate limited, retry after:', error.retryAfter, 'seconds');
  } else if (error instanceof ValidationError) {
    console.error('Bad request:', error.details);
  } else if (error instanceof InsufficientCreditsError) {
    console.error('Not enough AI credits — upgrade or wait for monthly reset');
  } else if (error instanceof PostEverywhereError) {
    console.error('API error:', error.message, error.requestId);
  }
}
```

Every error includes a `retryable` boolean — use it instead of inferring retry behavior from status codes.

📖 [Full error reference →](https://developers.posteverywhere.ai/errors)

## Configuration

```typescript
const client = new PostEverywhere({
  apiKey: 'pe_live_...',  // Required
  timeout: 120000,        // Default: 120s (AI generation can be slow)
  maxRetries: 2,          // Default: 2 — automatic retry on 429/5xx with backoff
});
```

## Rate Limits

| Resource | Per minute | Per hour | Per day |
|---|---|---|---|
| **General API calls** | 60 | 1,000 | — |
| **Posts** | 60 | 200 | 1,000 |
| **AI generation** | — | 60 | — |

The SDK auto-retries on 429 with exponential backoff, respecting the `Retry-After` header. See [`Rate Limits`](https://developers.posteverywhere.ai/rate-limits) for the full breakdown.

## Supported Platforms

All eight platforms work on every plan — no per-network add-ons:

- **[Instagram Scheduler](https://posteverywhere.ai/instagram-scheduler)** — feed, reels, stories, carousels
- **[TikTok Scheduler](https://posteverywhere.ai/tiktok-scheduler)** — videos, photo carousels
- **[YouTube Scheduler](https://posteverywhere.ai/youtube-scheduler)** — videos with thumbnails, tags, descriptions
- **[LinkedIn Scheduler](https://posteverywhere.ai/linkedin-scheduler)** — text, images, video, documents (carousels)
- **[Facebook Scheduler](https://posteverywhere.ai/facebook-scheduler)** — pages, video, reels, multi-image
- **X (Twitter) Scheduler** — text, threads, media, tier-aware char limits
- **Threads Scheduler** — text and media posts
- **Pinterest Scheduler** — pins to boards

## Documentation

- 📖 [Full API Reference](https://developers.posteverywhere.ai) — every endpoint, every parameter
- 🔐 [Authentication](https://developers.posteverywhere.ai/authentication) — API keys and scopes
- ⚠️ [Error Handling](https://developers.posteverywhere.ai/errors) — error codes, retry strategies, `retryable` flag
- ⏱️ [Rate Limits](https://developers.posteverywhere.ai/rate-limits) — per-minute, per-hour, per-day caps
- 🖼️ [Media Requirements](https://developers.posteverywhere.ai/media-requirements) — file size, format, aspect ratio per platform
- 🤖 [Building AI Agents](https://developers.posteverywhere.ai/integrations/agents) — system prompt templates and best practices
- 🚀 [Quick Start Guide](https://developers.posteverywhere.ai/quick-start) — first post in 60 seconds
- 🔗 [Webhooks](https://developers.posteverywhere.ai/webhooks) — receive publish events on your endpoints
- 🏷️ [API Scopes](https://developers.posteverywhere.ai/scopes) — fine-grained permission control
- 📋 [Changelog](https://developers.posteverywhere.ai/changelog) — what's new in the API
- 🧪 [Testing](https://developers.posteverywhere.ai/testing) — sandbox + local development tips

## PostEverywhere Around the Web

- 🌐 [PostEverywhere Homepage](https://posteverywhere.ai)
- 🛠️ [Developers Landing Page](https://posteverywhere.ai/developers) — overview of API, SDK, MCP, integrations
- 🤖 [AI Agents Page](https://posteverywhere.ai/agents) — using PostEverywhere with Claude, ChatGPT, Cursor
- 💵 [Pricing](https://posteverywhere.ai/pricing) — Starter ($19), Growth ($39), Pro ($79); 7-day free trial
- ✍️ [Blog](https://posteverywhere.ai/blog) — guides, tutorials, product updates
- 📚 [Help Center](https://posteverywhere.ai/support) — guides, troubleshooting, FAQs
- 🎛️ [Dashboard (sign in)](https://app.posteverywhere.ai)
- ✨ [Sign Up — 7-day free trial](https://app.posteverywhere.ai/signup)
- 🔑 [Get an API key](https://app.posteverywhere.ai/developers)
- 📦 [Node.js SDK (npm — this package)](https://www.npmjs.com/package/posteverywhere)
- 💻 [Node.js SDK (GitHub — this repo)](https://github.com/posteverywhere/sdk)
- 📦 [MCP Server (npm)](https://www.npmjs.com/package/@posteverywhere/mcp)
- 💻 [MCP Server (GitHub)](https://github.com/posteverywhere/mcp)
- 🏢 [PostEverywhere on GitHub](https://github.com/posteverywhere)

## Per-Platform Schedulers

Every plan includes every platform — these are the per-platform landing pages:

- 📷 [Instagram Scheduler](https://posteverywhere.ai/instagram-scheduler)
- 🎵 [TikTok Scheduler](https://posteverywhere.ai/tiktok-scheduler)
- 📺 [YouTube Scheduler](https://posteverywhere.ai/youtube-scheduler)
- 💼 [LinkedIn Scheduler](https://posteverywhere.ai/linkedin-scheduler)
- 👍 [Facebook Scheduler](https://posteverywhere.ai/facebook-scheduler)
- 🐦 X (Twitter), Threads, Pinterest also supported on every plan

## Related

- 🤖 **[`@posteverywhere/mcp`](https://github.com/posteverywhere/mcp)** — MCP server for Claude Code, Claude Desktop, and Cursor ([npm](https://www.npmjs.com/package/@posteverywhere/mcp))
- 🌐 **[posteverywhere.ai](https://posteverywhere.ai)** — Web dashboard, calendar UI, AI Studio
- 📚 **[Help Center](https://posteverywhere.ai/support)** — Guides, troubleshooting, FAQ
- 💵 **[Pricing](https://posteverywhere.ai/pricing)** — From $19/mo, 7-day free trial

## Support

- 📧 Email: [support@posteverywhere.ai](mailto:support@posteverywhere.ai)
- 🐛 Issues: [github.com/posteverywhere/sdk/issues](https://github.com/posteverywhere/sdk/issues)
- 💬 [Help Center](https://posteverywhere.ai/support)

## License

MIT — see [LICENSE](LICENSE).

---

Built by the team at [PostEverywhere](https://posteverywhere.ai). The smarter way to schedule social media posts to [Instagram](https://posteverywhere.ai/instagram-scheduler), [TikTok](https://posteverywhere.ai/tiktok-scheduler), [YouTube](https://posteverywhere.ai/youtube-scheduler), [LinkedIn](https://posteverywhere.ai/linkedin-scheduler), [Facebook](https://posteverywhere.ai/facebook-scheduler), X, Threads, and Pinterest from one place.
