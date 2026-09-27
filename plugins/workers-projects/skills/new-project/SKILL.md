---
name: new-project
description: Create a new personal project - Vue + Vite frontend and Hono API on Cloudflare Workers, a private GitHub repo, CI, and tag-only deploys to <name>.<your-domain>
argument-hint: "[name]"
disable-model-invocation: true
---

# New project

Creates a full-stack project from `template/` next to this file, pushes it to a private GitHub repo, and deploys it to `https://<name>.<domain>` through GitHub Actions.

## Setup facts

These facts and `template/` are also the target for `/migrate-project`, so keep them accurate for both skills.

- **Per-user config** lives in `~/.config/workers-projects/config.env`:
  - `GITHUB_OWNER`: the GitHub user or org that owns project repos
  - `DOMAIN`: a Cloudflare-managed zone; each project is served at `<name>.<DOMAIN>`
  - `CLOUDFLARE_CREDENTIALS`: path to a chmod-600 file holding `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`

  If the config is missing, ask the user for these values and create it. If the credentials file is missing, ask them to create an API token from Cloudflare's "Edit Cloudflare Workers" template, scoped to their account and that zone, and save it there themselves. Never print credentials. Custom-domain failures usually mean the token also needs Zone → DNS → Edit.
- The user creates the project directory and starts Claude inside it, conventionally `~/projects/<GITHUB_OWNER>/<name>`. Always use the current directory and never pick a path. If the directory isn't empty (a `.claude/` folder is fine), stop and tell the user.
- Name = `$ARGUMENTS` if given, otherwise the directory's basename. It becomes the repo name, the Worker name and the subdomain, so it must be a valid DNS label and must not already exist as a repo under `GITHUB_OWNER`.
- `scaffold.sh <DOMAIN> <name>`, next to this file and run from the project directory, produces a built, committed project. It needs git, gh (logged in), Node and pnpm. Improvements belong in `template/` and `scaffold.sh`, not only in the new project.
- The repo needs exactly `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` as Actions secrets before the first deploy. Set only those two, never every line in the credentials file, because it may hold other credentials.
- Pushes only run CI. Production deploys only from a pushed `v*` tag or a manual run of the Deploy workflow. Running `/new-project` counts as the user asking for the first deploy, so tag `v0.1.0` for it. After that, never deploy unless the user asks.
- The user may protect `*.<DOMAIN>` with a Cloudflare Access wildcard app, configured in the dashboard rather than in code. If they do, a healthy project redirects anonymous visitors to `*.cloudflareaccess.com`. If the site returns 200, tell the user it's publicly reachable; that may or may not be intended.

## Done means

- A private repo `<GITHUB_OWNER>/<name>` exists with the scaffold pushed.
- CI passed and the `v0.1.0` deploy succeeded.
- `https://<name>.<DOMAIN>` is live. A fresh subdomain can take a minute or two for DNS and certificates.
- You've asked the user what the project is for and recorded their answer under "Project notes" in its `CLAUDE.md`.
- You've reported the repo URL, the live URL, whether it's behind Access, and anything that went wrong.

## Options the user might ask for

- **Public site** (when an Access wildcard is in use): the user adds a self-hosted Access app for `<name>.<DOMAIN>` with a **Bypass** policy. It overrides the wildcard app.
