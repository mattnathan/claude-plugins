---
name: screenshot
description: Screenshot a web page (usually the local dev server) with headless Windows Edge from WSL, to see the UI yourself, including canvas/animation-heavy pages and phone widths. Use on WSL when you need to look at what the app renders.
---

# Screenshot

Only for WSL with Windows Edge installed. Run `screenshot.mjs`, next to this file, then read the PNG it prints:

```
node <this dir>/screenshot.mjs <url> [out.png] [width=1280] [height=800] [wait-seconds=9]
```

Start the dev server first, e.g. `pnpm dev` at http://localhost:5173. Screenshot a phone layout with a width such as 390.

How it works, in case you need to change it:

- Edge captures as soon as the page's load event fires. It ignores `--timeout`, and `--virtual-time-budget` doesn't let canvas or `requestAnimationFrame` animations build up. So the script serves a wrapper page that holds the app in an `<iframe>` plus an `<img>` the script's server only returns after the wait. The capture happens after that image loads.
- Edge won't make its window narrower than ~500px. The iframe is the requested width, so for narrower widths the PNG has blank space on the right.

To show the user a page in their own Windows browser, run `winbrowser <url>`.
