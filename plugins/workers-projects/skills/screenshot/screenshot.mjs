#!/usr/bin/env node
// Usage: screenshot.mjs <url> [out.png] [width=1280] [height=800] [wait-seconds=9]
// Screenshots <url> with headless Windows Edge from WSL, after waiting for animations to build up.
import { createServer } from 'node:http';
import { execFileSync, execFile } from 'node:child_process';
import { resolve } from 'node:path';

const EDGE = '/mnt/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const MIN_WINDOW_WIDTH = 500;

const [url, outArg = `${process.env.TMPDIR || '/tmp'}/screenshot.png`, w = '1280', h = '800', wait = '9'] = process.argv.slice(2);
if (!url) {
  console.error('Usage: screenshot.mjs <url> [out.png] [width] [height] [wait-seconds]');
  process.exit(2);
}
const width = Number(w), height = Number(h), waitMs = Number(wait) * 1000;
const out = resolve(outArg);

// Edge captures as soon as the page's load event fires, so the wrapper page holds the app in an
// iframe plus an image that this server only returns after the wait. The iframe also lets the app
// render narrower than Edge's minimum window width.
const gif = Buffer.from('R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==', 'base64');
const wrapper = `<!doctype html><html><body style="margin:0;background:#fff">
<iframe src="${url.replace(/"/g, '&quot;')}" style="border:0;display:block;width:${width}px;height:${height}px"></iframe>
<img src="/wait.gif" style="position:absolute;left:0;top:0;width:1px;height:1px;opacity:0">
</body></html>`;

const server = createServer((req, res) => {
  if (req.url === '/wait.gif') {
    setTimeout(() => res.end(gif), waitMs);
  } else {
    res.setHeader('content-type', 'text/html');
    res.end(wrapper);
  }
});

server.listen(0, () => {
  const { port } = server.address();
  const winOut = execFileSync('wslpath', ['-w', out], { encoding: 'utf8' }).trim();
  const args = [
    '--headless=new',
    '--hide-scrollbars',
    `--window-size=${Math.max(width, MIN_WINDOW_WIDTH)},${height}`,
    `--screenshot=${winOut}`,
    `http://localhost:${port}/`,
  ];
  execFile(EDGE, args, (err) => {
    server.close();
    server.closeAllConnections();
    if (err) {
      console.error(err.message);
      process.exit(1);
    }
    console.log(out);
  });
});
