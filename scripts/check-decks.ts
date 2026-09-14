#!/usr/bin/env node
// Does every slide actually fit on the slide?
//
// Nothing else in this repo can answer that. `pnpm build` runs astromotion's
// structural check, which reads the parsed MDX -- separators, directives,
// frontmatter -- and is satisfied by a slide whose last three lines are
// underneath the footer. axe reads the DOM without reveal's CSS applied, so a
// clipped SVG is invisible to it too. The only instrument that sees the
// failure is a browser laying the deck out on its real 1280x720 canvas, which
// is what `astromotion-check` drives.
//
// It found three on the first run against four new decks: two figures whose
// series labels ran off the right edge of their viewBox, and a closing slide
// 89px too tall. All three look fine in the source and none of them would
// have been caught before standing in front of the room.
//
// Two things this wrapper adds over calling the bin directly:
//
// - the base path. The site deploys under /<repo>/, so the deck URLs are
//   /<repo>/decks/<slug>/. Called without --prefix the bin asks for
//   /decks/<slug>/ and gets six 404s, which reads like six broken decks.
//   Derived here from the same resolver astro.config uses, never typed.
// - a skip that is loud. Chrome is an optional peer of an optional peer, and
//   a machine without one should not fail the whole check run -- but a check
//   that quietly passes when it did not run is worse than no check, so the
//   skip prints what it skipped and why.
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolveDeployment } from "./pages-base.ts";

// puppeteer-core ships no browser. These are where the platform's package
// managers put one; CHROME_PATH overrides, as puppeteer itself reads it.
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

function findChrome(): string | undefined {
  return CHROME_CANDIDATES.find((path) => path && existsSync(path));
}

const chrome = findChrome();
if (!chrome) {
  console.log("⊘ check:decks SKIPPED — no Chrome or Chromium found.");
  console.log("  Slide fit is unverified. Set CHROME_PATH, or install one,");
  console.log("  and re-run before shipping any deck change.");
  process.exit(0);
}

const { base } = resolveDeployment(process.env, gitOrigin);
const prefix = `${base.replace(/\/$/, "")}/decks`;

const result = spawnSync(
  "node_modules/.bin/astromotion-check",
  [`--prefix=${prefix}`, ...process.argv.slice(2)],
  { stdio: "inherit", env: { ...process.env, CHROME_PATH: chrome } },
);

process.exit(result.status ?? 1);
