# claude-plugins

Claude Code plugins by Matt Nathan.

## workers-projects

Skills for low-cost personal web projects on Cloudflare's free tier:

- **`/new-project`** scaffolds a Vue + Vite frontend and a Hono API in one Cloudflare Worker. It creates a private GitHub repo, adds CI, and deploys to `https://<name>.<your-domain>`.
- **`/migrate-project`** brings an existing project onto the same setup. It looks at the project first and proposes a plan, then changes nothing until you approve it.
- **`screenshot`** lets Claude see your app's UI on WSL, using headless Windows Edge. Claude uses it on its own, and it handles animated pages and phone widths.

Pushes only run CI. Production deploys happen when you push a `v*` tag, or run the Deploy workflow by hand. Each project includes Claude Code permission rules that make Claude ask before deploying.

### Install

```
/plugin marketplace add mattnathan/claude-plugins
/plugin install workers-projects@mattnathan
```

### Prerequisites

- **Tools:** git, Node, [pnpm](https://pnpm.io), and the [GitHub CLI](https://cli.github.com), logged in with `gh auth login`.
- **Cloudflare:** an account with a domain (zone) on Cloudflare.
- **Cloudflare API token:** create one from the **Edit Cloudflare Workers** template, scoped to your account and that zone. Save it with your account ID in a file only you can read (`chmod 600`):
  ```
  CLOUDFLARE_API_TOKEN=...
  CLOUDFLARE_ACCOUNT_ID=...
  ```
- **Config:** create `~/.config/workers-projects/config.env`. The skill offers to create it the first time it runs.
  ```
  GITHUB_OWNER=your-github-user
  DOMAIN=example.com
  CLOUDFLARE_CREDENTIALS=~/.config/workers-projects/cloudflare.env
  ```
- **Recommended:** add a Cloudflare Access application for `*.<your-domain>` (Zero Trust → Access → Applications → Self-hosted) with an email allow-list. This puts a login page in front of every project. Access is free for up to 50 users.

### Usage

```bash
mkdir -p ~/projects/<owner>/my-app && cd $_ && claude "/new-project"
```

To test locally, run `pnpm dev`. To release, run `git tag v0.2.0 && git push origin v0.2.0`.
