# __NAME__

Live at https://__NAME__.__DOMAIN__. This is a personal project, so keep running costs at zero or close to it and prefer Cloudflare's free tiers.

- Package manager: pnpm, never npm or yarn. pnpm blocks dependency install scripts; allow one with `pnpm approve-builds <pkg>`, which records it under `allowBuilds` in `pnpm-workspace.yaml`
- Frontend: Vue 3 + Vite, in `src/`
- API: Hono on Cloudflare Workers, in `worker/index.ts`, served under `/api/*`
- Test locally with `pnpm dev`, which runs the frontend and Worker together in the local Workers runtime at http://localhost:5173 (reachable from the Windows browser). `pnpm preview` serves the production build locally. Local runs have no Cloudflare Access in front
- Auth: if Cloudflare Access protects `*.__DOMAIN__`, it's configured in the Zero Trust dashboard, not in code. `workers_dev` and `preview_urls` are off so it can't be bypassed; keep them off. The logged-in user's email is available through `ctx.access.getIdentity()` or the `Cf-Access-Authenticated-User-Email` header
- Pushes run CI (build only). **Production** deploys only when a `v*` tag is pushed or the Deploy workflow is run by hand. Never do either, or run `wrangler deploy`, unless the user explicitly asks to deploy; `.claude/settings.json` makes those commands ask first
- TypeScript is pinned to 6.x because vue-tsc doesn't support TS 7 yet
- After changing bindings in `wrangler.jsonc`, run `pnpm cf-typegen`

## Project notes

<!-- What this project is for, who uses it, and any decisions made -->
