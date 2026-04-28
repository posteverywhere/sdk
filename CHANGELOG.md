# Changelog — `posteverywhere` Node.js SDK

All notable changes to the [PostEverywhere Node.js SDK](https://www.npmjs.com/package/posteverywhere) are documented in this file. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.1] — 2026-04-28

### Added
- Comprehensive SEO-optimized README with quick-links table covering all 8 supported platforms (Instagram, TikTok, YouTube, LinkedIn, Facebook, X/Twitter, Threads, Pinterest), the [companion MCP server](https://www.npmjs.com/package/@posteverywhere/mcp), the [public GitHub repo](https://github.com/posteverywhere/sdk), the [API documentation](https://developers.posteverywhere.ai), and the [PostEverywhere dashboard](https://app.posteverywhere.ai)
- `engines.node` field declaring Node.js 18+ as the minimum supported runtime
- `publishConfig.access: public` to make future publishes explicit
- `sideEffects: false` for better tree-shaking by bundlers (Webpack, Rollup, Vite, esbuild)
- Eight additional SEO-relevant npm keywords (e.g. `pinterest`, `twitter-api`, `x-api`, `ai-agents`, `typescript`)
- MIT `LICENSE` file shipped in the published tarball

### Changed
- Repository URL now resolves to the public [`github.com/posteverywhere/sdk`](https://github.com/posteverywhere/sdk) repo instead of the private monorepo
- `bugs.url` points to [GitHub Issues](https://github.com/posteverywhere/sdk/issues) (was a stale 404 link)
- Description text expanded to enumerate all 8 platforms and the AI-agent positioning
- Trial period claim corrected to **7-day free trial** (was incorrectly 14-day in earlier docs)

### Fixed
- Broken `posteverywhere.ai/docs/help-center` link replaced with the working [`/support`](https://posteverywhere.ai/support) Help Center
- Removed references to `/hootsuite-alternative` and `/buffer-alternative` marketing pages that did not exist

## [1.2.0] — 2026-04-12

### Added
- Media upload helpers covering the full 3-step flow (presigned URL → upload bytes → mark complete)
- AI image generation supporting `flux-schnell`, `ideogram-v2`, `gemini-3-pro`, and `nano-banana-pro` models with 7 aspect ratios
- Per-platform content overrides (`platform_content` parameter) — same post, different copy per network
- Bulk scheduling support — scheduled posts (with future `scheduled_for`) bypass the per-minute publishing limit
- `retryable` flag on every error response, plus typed error classes: `AuthenticationError`, `RateLimitError`, `ValidationError`, `InsufficientCreditsError`, `PostEverywhereError`
- Automatic 429 retry with exponential backoff, respecting `Retry-After` headers

### Changed
- `scheduled_for` is now the canonical field name (replacing the deprecated `scheduled_at` alias) for clearer semantics — see the [API docs](https://developers.posteverywhere.ai/api/create-post)

## [1.0.0] — Earlier 2026

### Added
- Initial public release of the SDK
- Core resources: `accounts`, `posts`, `media`, `ai`
- TypeScript types for every endpoint
- Configurable timeout and retry policy

---

## Resources

- 📦 **[npm package](https://www.npmjs.com/package/posteverywhere)**
- 💻 **[GitHub repository](https://github.com/posteverywhere/sdk)**
- 🤖 **[Companion MCP server](https://github.com/posteverywhere/mcp)** for Claude Code, Claude Desktop, and Cursor
- 📖 **[Full API documentation](https://developers.posteverywhere.ai)**
- 🌐 **[PostEverywhere homepage](https://posteverywhere.ai)**
- 💵 **[Pricing](https://posteverywhere.ai/pricing)** — Starter ($19), Growth ($39), Pro ($79); 7-day free trial
- 📚 **[Help Center](https://posteverywhere.ai/support)**
- 📧 **[support@posteverywhere.ai](mailto:support@posteverywhere.ai)**
