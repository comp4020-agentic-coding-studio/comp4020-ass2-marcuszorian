#!/usr/bin/env node
// Is focus actually visible, and does anything overflow sideways on a phone?
//
// CLAUDE.md has asked for both since the first commit --- "no default browser
// blue box around text links, keyboard focus must still be clearly visible,
// never `outline: none` with nothing replacing it" --- and until this script
// the rule was prose with no instrument behind it. It held, every time it was
// checked by hand. That is the problem: it held because of what the theme
// happens to do in `base.css`, not because of anything this repo asserts, and
// a rule satisfied by someone else's default is a rule that will break
// silently on a dependency bump.
//
// Neither existing sensor can see it. axe reads the DOM and the computed
// styles of the resting state; `:focus-visible` only computes when something
// is actually focused by keyboard, and axe never presses Tab. The link checker
// reads hrefs. `pnpm check:decks` lays out decks, not pages. So the only
// instrument that answers the question is a browser with a keyboard, which is
// what this is.
//
// Three things, per page type, at both marking viewports:
//
//   1. nothing scrolls horizontally --- the 390px failure that makes a page
//      feel broken before a reader has read a word
//   2. the skip link leads the tab order and becomes visible when focused ---
//      it is `.visually-hidden` at rest, so a missing focus reveal means
//      keyboard users tab into nothing on every page
//   3. the first link inside <main>, focused by real Tab presses, draws an
//      outline in a brand colour at a non-zero offset --- not the UA default
//      ring, and not nothing
//
// The brand colour is not hardcoded here. It is read back out of the page's
// own `--at-accent` token and normalised through a probe element, so this
// measures agreement between the focus ring and the brand rather than
// agreement with a hex string someone typed into a test once.
//
// Decks are out of scope: reveal owns their layout and tab order, and
// `check-decks.ts` already measures them in a real browser on their real
// canvas.
//
// The skip, like check-decks', is loud. Chrome is an optional peer of an
// optional peer and a machine without one should not fail the whole run, but a
// check that quietly passes when it did not run is worse than no check.
import { execFileSync } from "node:child_process";
import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";
import type { AddressInfo } from "node:net";
import puppeteer from "puppeteer-core";
import { resolveDeployment } from "./pages-base.ts";

// puppeteer-core ships no browser. Same candidate list as check-decks.ts;
// CHROME_PATH overrides, as puppeteer itself reads it.
const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  "/usr/bin/google-chrome",
  "/usr/bin/google-chrome-stable",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
];

function gitOrigin(): string | undefined {
  try {
    return execFileSync("git", ["remote", "get-url", "origin"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
  } catch {
    return undefined;
  }
}

const chrome = CHROME_CANDIDATES.find((path) => path && existsSync(path));
if (!chrome) {
  console.log("⊘ check:viewports SKIPPED — no Chrome or Chromium found.");
  console.log("  Focus visibility and 390px overflow are unverified. Set");
  console.log("  CHROME_PATH, or install one, and re-run before shipping.");
  process.exit(0);
}

const DIST = resolve("dist");
if (!existsSync(DIST)) {
  console.error("check:viewports needs a build: run `pnpm build` first.");
  process.exit(1);
}

// One representative of every layout a reader can land on. Detail routes go
// through ContentLayout, index pages through PageLayout/MdxPageLayout, the home
// page through its own .astro, and the 404 through PageLayout with
// `unlisted: true` --- four different paths to an <h1> and a first link.
const ROUTES = [
  "/",
  "/lectures/",
  "/lectures/week-01/",
  "/sessions/",
  "/sessions/06-mapping-a-shared-cache/",
  "/assessments/",
  "/assessments/trace-analysis-lab/",
  "/people/",
  "/people/idris-fenn/",
  "/policies/",
  "/404.html",
];

const VIEWPORTS = [
  { name: "1920x1080", width: 1920, height: 1080 },
  { name: "390x844", width: 390, height: 844 },
];

const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".avif": "image/avif",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".ico": "image/x-icon",
};

const { base } = resolveDeployment(process.env, gitOrigin);
const basePath = base.endsWith("/") ? base : `${base}/`;

// The build emits every URL under /<repo>/, so a server rooted at dist would
// 404 on its own stylesheets. Strip the base, then resolve directory URLs to
// their index.html --- `trailingSlash: "always"` means that is every route.
const server = createServer((req, res) => {
  const url = new URL(req.url ?? "/", "http://localhost");
  let pathname = decodeURIComponent(url.pathname);
  if (pathname.startsWith(basePath)) pathname = `/${pathname.slice(basePath.length)}`;

  // normalize collapses any ".." before it can climb out of dist.
  let file = join(DIST, normalize(pathname));
  if (!file.startsWith(DIST)) {
    res.writeHead(403).end();
    return;
  }
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");
  if (!existsSync(file)) {
    res.writeHead(404, { "content-type": "text/plain" }).end(`not found: ${pathname}`);
    return;
  }

  res.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream" });
  createReadStream(file).pipe(res);
});

await new Promise<void>((ready) => server.listen(0, "127.0.0.1", ready));
const { port } = server.address() as AddressInfo;
const origin = `http://127.0.0.1:${port}`;

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: "shell",
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

interface Failure {
  route: string;
  viewport: string;
  detail: string;
}

const failures: Failure[] = [];
let measured = 0;

// Tab order on a page here runs: skip link, nav (links, search, theme toggle),
// then main. 60 presses is well past that and still bounded if focus gets
// stuck on a single element.
const MAX_TABS = 60;

try {
  for (const viewport of VIEWPORTS) {
    for (const route of ROUTES) {
      const page = await browser.newPage();
      await page.setViewport({ width: viewport.width, height: viewport.height });

      const fail = (detail: string) =>
        failures.push({ route, viewport: viewport.name, detail });

      try {
        const response = await page.goto(`${origin}${basePath}${route.slice(1)}`, {
          waitUntil: "networkidle0",
        });
        if (!response || response.status() >= 400) {
          fail(`served ${response?.status() ?? "no response"} — route missing from dist`);
          continue;
        }

        // 1. Horizontal overflow, measured before anything is focused: focus
        //    can scroll the page, and the question is what a reader meets on
        //    arrival. 2px of slack absorbs sub-pixel layout rounding.
        const overflow = await page.evaluate(() => {
          const root = document.documentElement;
          const widest = [...document.body.querySelectorAll("*")]
            .map((el) => {
              const rect = el.getBoundingClientRect();
              return { right: Math.round(rect.right), tag: el.tagName.toLowerCase(), cls: el.className };
            })
            .sort((a, b) => b.right - a.right)[0];
          return { scrollWidth: root.scrollWidth, clientWidth: root.clientWidth, widest };
        });
        if (overflow.scrollWidth > overflow.clientWidth + 2) {
          const w = overflow.widest;
          fail(
            `scrolls horizontally: scrollWidth ${overflow.scrollWidth} > clientWidth ${overflow.clientWidth}` +
              (w ? ` — widest element <${w.tag} class="${String(w.cls).slice(0, 60)}"> ends at ${w.right}px` : ""),
          );
        }

        // 2. One Tab from a fresh load must land on the skip link, and it must
        //    stop being visually-hidden while it is focused.
        await page.keyboard.press("Tab");
        const skip = await page.evaluate(() => {
          const el = document.activeElement as HTMLElement | null;
          if (!el || el === document.body) return { focused: false } as const;
          const rect = el.getBoundingClientRect();
          const style = getComputedStyle(el);
          return {
            focused: true,
            tag: el.tagName.toLowerCase(),
            href: el.getAttribute("href") ?? "",
            text: (el.textContent ?? "").trim(),
            width: Math.round(rect.width),
            height: Math.round(rect.height),
            clipPath: style.clipPath,
            visibility: style.visibility,
            inViewport:
              rect.top >= -1 &&
              rect.left >= -1 &&
              rect.bottom <= window.innerHeight + 1 &&
              rect.right <= window.innerWidth + 1,
          } as const;
        });

        if (!skip.focused) {
          fail("first Tab focused nothing — no skip link in the tab order");
        } else if (!(skip.tag === "a" && skip.href.endsWith("#main"))) {
          fail(
            `first Tab focused <${skip.tag} href="${skip.href}">, not the skip link — ` +
              "a keyboard reader has to walk the nav on every page before reaching content",
          );
        } else if (skip.clipPath !== "none" || skip.width <= 1 || skip.height <= 1) {
          fail(
            `the skip link stays hidden while focused (clip-path: ${skip.clipPath}, ${skip.width}x${skip.height}px) — ` +
              "sighted keyboard users tab into an invisible link",
          );
        } else if (!skip.inViewport) {
          fail(`the focused skip link renders outside the viewport (${skip.width}x${skip.height}px)`);
        }

        // 3. Keep tabbing to the first link inside <main> and read its focus
        //    ring. Real key presses, because `:focus-visible` is what the rule
        //    is about and element.focus() is not reliably keyboard focus.
        let reached = false;
        for (let i = 0; i < MAX_TABS && !reached; i += 1) {
          reached = await page.evaluate(() => {
            const el = document.activeElement;
            return !!el && el.tagName === "A" && !!el.closest("main");
          });
          if (!reached) await page.keyboard.press("Tab");
        }

        if (!reached) {
          fail(`no link inside <main> reachable within ${MAX_TABS} Tab presses`);
          continue;
        }

        const focus = await page.evaluate(() => {
          const el = document.activeElement as HTMLElement;
          const style = getComputedStyle(el);

          // Normalise the brand token through a probe: the custom property is
          // whatever was authored (`#b97d1c`, a colour function, another var)
          // while `outline-color` computes to rgb(). Comparing the two as
          // strings would fail on formatting alone.
          const token = getComputedStyle(document.documentElement)
            .getPropertyValue("--at-accent")
            .trim();
          const probe = document.createElement("span");
          probe.style.color = token;
          document.body.append(probe);
          const accent = getComputedStyle(probe).color;
          probe.remove();

          return {
            text: (el.textContent ?? "").trim().slice(0, 40),
            outlineStyle: style.outlineStyle,
            outlineWidth: style.outlineWidth,
            outlineColor: style.outlineColor,
            outlineOffset: style.outlineOffset,
            boxShadow: style.boxShadow,
            token,
            accent,
          };
        });

        const width = Number.parseFloat(focus.outlineWidth);
        const offset = Number.parseFloat(focus.outlineOffset);
        const where = `the first link in <main> ("${focus.text}")`;

        if (focus.outlineStyle === "none" && focus.boxShadow === "none") {
          fail(`${where} has no focus indicator at all: outline-style none, no box-shadow`);
        } else if (focus.outlineStyle === "none") {
          fail(`${where} has outline: none, replaced only by a box-shadow — the rule asks for a visible outline`);
        } else if (!Number.isFinite(width) || width < 1) {
          fail(`${where} draws a ${focus.outlineWidth} outline, which is not a visible ring`);
        } else if (!Number.isFinite(offset) || offset <= 0) {
          fail(
            `${where} has outline-offset ${focus.outlineOffset} — the ring sits on the text instead of around it`,
          );
        } else if (!focus.token) {
          fail("--at-accent is not defined on :root, so the focus ring cannot be checked against the brand");
        } else if (focus.outlineColor !== focus.accent) {
          fail(
            `${where} draws its focus ring in ${focus.outlineColor}, not the brand accent ${focus.accent} ` +
              `(--at-accent: ${focus.token}) — this is what the UA default blue box looks like`,
          );
        }

        measured += 1;
      } finally {
        await page.close();
      }
    }
  }
} finally {
  await browser.close();
  server.close();
}

const total = ROUTES.length * VIEWPORTS.length;

if (failures.length > 0) {
  console.error(`✗ check:viewports — ${failures.length} failure(s) across ${total} page/viewport pairs:\n`);
  for (const { route, viewport, detail } of failures) {
    console.error(`  ${route} @ ${viewport}`);
    console.error(`    ${detail}\n`);
  }
  process.exit(1);
}

console.log(
  `✓ Checked ${measured} page/viewport pair(s) — no horizontal overflow, skip link leads and shows, focus ring is brand-coloured.`,
);
