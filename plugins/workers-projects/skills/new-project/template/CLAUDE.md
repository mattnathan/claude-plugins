# __NAME__

Live at https://__NAME__.__DOMAIN__. This is a personal project, so keep running costs at zero or close to it and prefer Cloudflare's free tiers.

Vue 3 + Vite frontend in `src/` and a Hono API in `worker/index.ts` (under `/api/*`), served together by one Cloudflare Worker; `pnpm dev` runs both locally.

- Use pnpm, never npm or yarn. pnpm blocks dependency install scripts; allow one with `pnpm approve-builds <pkg>`
- Auth: if Cloudflare Access protects `*.__DOMAIN__`, it's configured in the Zero Trust dashboard, not in code, and local runs don't have it. `workers_dev` and `preview_urls` are off so it can't be bypassed; keep them off. The logged-in user's email is available through `ctx.access.getIdentity()` or the `Cf-Access-Authenticated-User-Email` header
- Pushes run CI (build only). **Production** deploys only when a `v*` tag is pushed or the Deploy workflow is run by hand. Never do either, or run `wrangler deploy`, unless the user explicitly asks to deploy
- TypeScript is pinned to 6.x because vue-tsc doesn't support TS 7 yet
- After changing bindings in `wrangler.jsonc`, run `pnpm cf-typegen`

## Project notes

<!-- What this project is for, who uses it, and any decisions made -->
