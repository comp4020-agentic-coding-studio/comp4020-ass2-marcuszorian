import { readdirSync, readFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { describe, expect, it } from "vitest";

// A deck is the one artefact on this site a marker opens in a separate tab,
// reads in thirty seconds, and forms an opinion from. Two things go wrong
// with them, and neither is visible in a diff.
//
// The first is a deck that should not exist: prose from the lecture page
// re-flowed into bullets, costing a click to discover it adds nothing.
// CLAUDE.md's rule is that a lecture earns a deck when its argument is
// stepwise and the steps *are* the argument, which is a judgement no test can
// make -- so what is enforced here is the mechanical half. A deck is linked
// from exactly one lecture, opens on a question rather than a title card
// restating the lecture, carries at least one figure or table, and closes by
// naming what the Bench does with it. Those are the marks of a deck someone
// designed rather than generated.
//
// The second is the promise in the other direction: week 6's Bench told
// students "the deck's outline names where to find both" when week 6 had no
// deck. A page that refers to "the deck" is making a claim about the site,
// and the site has to keep it.
//
// What this file deliberately does *not* check is whether the slides fit.
// That needs a browser laying the deck out on its real 1280x720 canvas --
// `pnpm check:decks`. Parsed markup cannot see a clipped figure, and the word
// budget below is a wall-of-text guard, not a legibility measurement.

interface ApiNode {
  id: string;
  type: string;
  meta?: Record<string, unknown>;
}

const api = JSON.parse(readFileSync(resolve("dist/api/index.json"), "utf8")) as {
  nodes: ApiNode[];
};

const lectures = api.nodes.filter((node) => node.type === "lectures");

/** Lecture week -> the deck slug its `slides:` points at. */
const deckByWeek = new Map<number, string>();
for (const lecture of lectures) {
  const slides = String(lecture.meta?.slides ?? "");
  if (!slides) continue;
  deckByWeek.set(Number(lecture.meta?.week), slides.replace(/^\/decks\//, "").replace(/\/$/, ""));
}

const DECK_DIR = resolve("src/decks");
const deckFiles = readdirSync(DECK_DIR).filter((name) => name.endsWith(".deck.mdx"));
const deckSlugs = deckFiles.map((name) => name.replace(/\.deck\.mdx$/, ""));

/** Slides, with the frontmatter gone. Separator is a `---` on its own line. */
function slidesOf(source: string): string[] {
  const body = source.replace(/^---\n[\s\S]*?\n---\n/, "");
  return body
    .split(/\n---\n/)
    .map((slide) => slide.trim())
    .filter(Boolean);
}

/**
 * Prose words on a slide: what a reader has to read.
 *
 * Tables, code and SVG are excluded because they are scanned rather than
 * read, and counting them penalises exactly the slides the rule above asks
 * for. Speaker notes are excluded because the audience never sees them --
 * which is where a figure's underlying numbers live.
 */
function proseWords(slide: string): number {
  const text = slide
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<svg[\s\S]*?<\/svg>/g, " ")
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, " ")
    .split("\n")
    .filter((line) => !line.trim().startsWith("|"))
    .join(" ")
    .replace(/[#*`>_-]/g, " ");
  return text.split(/\s+/).filter(Boolean).length;
}

const decks = deckSlugs.map((slug) => {
  const source = readFileSync(join(DECK_DIR, `${slug}.deck.mdx`), "utf8");
  return { slug, source, slides: slidesOf(source) };
});

// The budget is a guard against a slide that is a paragraph, not a
// legibility measurement -- `pnpm check:decks` does that, in a browser, on
// the real canvas. Set above the current maximum on purpose: tightening it
// to whatever the decks happen to measure today turns every later edit into
// a test failure that teaches nothing.
const PROSE_BUDGET = 70;
const MIN_SLIDES = 6;

describe("every deck", () => {
  for (const { slug, source, slides } of decks) {
    describe(slug, () => {
      it("is linked from exactly one lecture", () => {
        const owners = [...deckByWeek.entries()].filter(([, deck]) => deck === slug);
        expect(owners.length, `${slug} is an orphan deck, or two lectures claim it`).toBe(1);
      });

      it(`has at least ${MIN_SLIDES} slides`, () => {
        expect(slides.length).toBeGreaterThanOrEqual(MIN_SLIDES);
      });

      it("opens on a question rather than a title card", () => {
        expect(slides[0], `${slug}'s first slide asks nothing`).toContain("?");
      });

      it("argues with a figure or a table somewhere, not only bullets", () => {
        const hasFigure = source.includes("<svg");
        const hasTable = /^\|.*\|$/m.test(source);
        expect(hasFigure || hasTable, `${slug} is bullets all the way down`).toBe(true);
      });

      it("closes by naming what the Bench does with it", () => {
        const tail = slides.slice(-2).join(" ");
        expect(tail, `${slug} ends without handing anything to the Bench`).toMatch(/Bench/);
      });

      it(`keeps every slide under ${PROSE_BUDGET} words of prose`, () => {
        const overlong = slides
          .map((slide, index) => ({ index: index + 1, words: proseWords(slide) }))
          .filter((slide) => slide.words > PROSE_BUDGET);
        expect(overlong, `${slug} has slides a reader has to read, not glance at`).toEqual([]);
      });
    });
  }
});

describe("a week without a deck", () => {
  const CONTENT_DIR = resolve("src/content");

  function walk(dir: string): string[] {
    return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) return walk(full);
      return entry.name.endsWith(".md") ? [full] : [];
    });
  }

  for (const file of walk(CONTENT_DIR)) {
    const source = readFileSync(file, "utf8");
    if (!/\bthe deck\b/i.test(source)) continue;
    const week = Number(source.match(/^week:\s*(\d+)/m)?.[1]);

    it(`${basename(file)} does not point at a deck week ${week} lacks`, () => {
      expect(Number.isFinite(week), `${basename(file)} says "the deck" but declares no week`).toBe(
        true,
      );
      expect(deckByWeek.has(week), `week ${week} has no slides: and cannot keep that promise`).toBe(
        true,
      );
    });
  }
});
