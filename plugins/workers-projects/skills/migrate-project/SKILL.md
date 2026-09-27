---
name: migrate-project
description: Bring an existing project onto the standard workers-projects setup (pnpm, Cloudflare Workers at <name>.<your-domain>, private GitHub repo, CI plus tag-only deploys). Also updates projects made with an older /new-project template.
argument-hint: "[name]"
disable-model-invocation: true
---

# Migrate project

Brings the project in the current directory onto the standard setup.

## The target

The `new-project` skill in this plugin (`../new-project/`) defines the target setup. Read its `SKILL.md` ("Setup facts", including the per-user config) and everything in its `template/` before doing anything else. A migrated project should end up equivalent to a fresh scaffold, adapted to the project's own code. Beyond what the template shows:

- Merge the template's `CLAUDE.md` sections into any existing `CLAUDE.md`, filled in for this project; don't replace it.
- A private repo `<GITHUB_OWNER>/<name>`, conventionally checked out at `~/projects/<GITHUB_OWNER>/<name>`

## How to approach it

- **Plan first.** Propose a short plan and get approval before modifying anything.
- **Keep what works.** Keep the project's framework and structure where Workers supports them, using its Cloudflare adapter where one exists. Don't rewrite code to match the template's style. Port a Node server (Express and similar) to Hono only when it's needed, and say so in the plan, because that's the big item.
- **Raise blockers in the plan.** Include anything Workers can't run, and anything that costs money. For data, offer the free-tier options (D1, KV, R2) or keeping the existing service.
- **Keep secrets out of git.** Existing env vars become Worker secrets or vars, with `.dev.vars` for local development.
- **Protect the existing repo.** Work on a branch and keep the history. If the remote isn't `<GITHUB_OWNER>/<name>` (another owner, another host, or none), ask whether to transfer it, move it or create a new repo. If the local checkout moves, the user restarts Claude there.
- **Deploy last.** The first deploy may replace a live site on another host, so merge and tag `v*` only after the user has seen the project working locally and asked for it.

## Done means

- Any items the user deferred are listed under "Project notes" in `CLAUDE.md`.
- `pnpm install --frozen-lockfile && pnpm build` passes, and `pnpm dev` serves the app locally.
- The migration branch is pushed to `<GITHUB_OWNER>/<name>` and CI is green.
- If the user asked for a deploy: it succeeded, `https://<name>.<DOMAIN>` is live, and you've said whether it's behind Access.
- You've told the user what they still have to do by hand, such as switching off the old hosting, removing DNS that conflicts with `<name>.<DOMAIN>`, or migrating data.
- Anything learned that would help future migrations or new projects has been fed back into `new-project`'s template or facts.
