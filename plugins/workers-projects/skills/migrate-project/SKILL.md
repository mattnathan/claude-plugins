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

- **Look before changing anything.** Give the user a short plan: what changes, what can't run on Workers as it is, what's missing from the target, and anything that's their decision. **Get approval before modifying anything.**
- **Keep what works.** Keep the project's framework and structure where Workers supports them, using its Cloudflare adapter where one exists. Don't rewrite code to match the template's style. Port a Node server (Express and similar) to Hono only when it's needed, and say so in the plan, because that's the big item.
- **Raise blockers early.** Flag anything Workers can't run, and anything that costs money. For data, offer the free-tier options (D1, KV, R2) or keeping the existing service. The user decides.
- **Keep secrets out of git.** Existing env vars become Worker secrets or vars, with `.dev.vars` for local development. Never commit them or print them.
- **Protect the existing repo.** Work on a branch and keep the history. If the remote isn't `<GITHUB_OWNER>/<name>` (another owner, another host, or none), ask whether to transfer it, move it or create a new repo. Moving the local checkout is the user's call; they'll restart Claude in the new location.
- **Don't deploy without asking.** Deploying is outward-facing and may replace a live site on another host. Merge and tag `v*` only after the user has seen the project working locally and explicitly asks. Remind them to switch off the old hosting afterwards, and to check that its DNS doesn't conflict with `<name>.<DOMAIN>`.

## Done means

- The user approved the plan, and any items they deferred are listed under "Project notes" in `CLAUDE.md`.
- `pnpm install --frozen-lockfile && pnpm build` passes, and `pnpm dev` serves the app locally.
- The migration branch is pushed to `<GITHUB_OWNER>/<name>` and CI is green.
- If the user asked for a deploy: it succeeded and `https://<name>.<DOMAIN>` is live. If it isn't behind Access, say so.
- You've reported what changed, what was deferred, and what the user still has to do by hand, such as old hosting, DNS or data migration.
- Anything learned that would help future migrations or new projects has been fed back into `new-project`'s template or facts.
