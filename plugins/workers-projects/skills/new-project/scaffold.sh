#!/usr/bin/env bash
# Usage: scaffold.sh <domain> [name]   (run from inside the new, empty project directory)
# Scaffolds a Vue + Hono Cloudflare Workers project in the current directory,
# served at <name>.<domain>. name defaults to the directory's basename.
set -euo pipefail

DOMAIN="${1:?usage: scaffold.sh <domain> [name]}"
DIR="$PWD"
NAME="${2:-$(basename "$DIR")}"
TEMPLATE="$(cd "$(dirname "$0")" && pwd)/template"

if ! [[ "$NAME" =~ ^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$ ]]; then
  echo "error: '$NAME' must be a valid subdomain label (lowercase letters, digits, hyphens)" >&2
  exit 1
fi

if [ -n "$(ls -A "$DIR" 2>/dev/null | grep -v '^\.claude$')" ]; then
  echo "error: $DIR is not empty" >&2
  exit 1
fi

cp -r "$TEMPLATE"/. "$DIR"/
cd "$DIR"

DATE="$(date +%F)"
grep -rl --exclude-dir=node_modules -e '__NAME__' -e '__DATE__' -e '__DOMAIN__' . \
  | xargs sed -i -e "s/__NAME__/$NAME/g" -e "s/__DATE__/$DATE/g" -e "s/__DOMAIN__/$DOMAIN/g"

# Record the pnpm version so CI (pnpm/action-setup) uses the same one
npm pkg set packageManager="pnpm@$(pnpm --version)"
pnpm add hono vue
# typescript pinned to 6.x: vue-tsc needs the JS compiler API, which TS 7 (native port) lacks
pnpm add -D vite @vitejs/plugin-vue @cloudflare/vite-plugin wrangler \
  "typescript@^6" vue-tsc @vue/tsconfig @types/node

pnpm exec wrangler types
pnpm build

git init -q -b main
git add -A
git commit -q -m "Initial scaffold for $NAME" -m "Co-Authored-By: Claude <noreply@anthropic.com>"
echo "Scaffolded $NAME at $DIR"
