import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";

// The course's central promise is that it is one compounding argument rather
// than twelve topics: weeks 2-8 introduce one physical channel each, and the
// remaining weeks do something to that accumulated list rather than adding to
// it. Two things have to stay true for that promise to survive later passes
// over the content.
//
// First, each week has to say what it *changes* about the thesis, not only
// what it covers, and no two weeks may change the same thing. That is the
// `claim:` field, rendered as the argument chain on /lectures/.
//
// Second --- and this is the failure that actually happened --- the number of
// channels has to be the same number everywhere. Before this test, the
// week-10 lecture said "six channels" while enumerating six and silently
// dropping timing, its deck agreed with the wrong number, the week-8 Bench
// said "six" while listing seven Benches' worth of notes to bring, and the
// home page said "twelve". Nothing in the repo agreed, and nothing could
// catch it, because every one of those numbers was hand-written prose.
//
// So the count is derived from `channel:` frontmatter here and prose is
// checked against it. This deliberately tests no particular wording: a page
// may say "seven channels" or nothing at all, but it may not say a number
// that disagrees with the data.

interface ApiNode {
  id: string;
  type: string;
  meta?: Record<string, unknown>;
}

const api = JSON.parse(readFileSync(resolve("dist/api/index.json"), "utf8")) as {
  nodes: ApiNode[];
};

const lectures = api.nodes.filter((node) => node.type === "lectures");

// "none" marks a week that introduces no new channel: the opening lecture,
// the colocation precondition, and the three closing weeks.
const channelsOf = (node: ApiNode) => String(node.meta?.channel ?? "");
const measured = lectures.filter((node) => channelsOf(node) !== "none" && channelsOf(node) !== "");
const channelNames = measured.map(channelsOf);
const CHANNEL_COUNT = new Set(channelNames).size;

const NUMBER_WORDS: Record<string, number> = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12,
};

const parseCount = (token: string): number | undefined =>
  /^\d+$/.test(token) ? Number(token) : NUMBER_WORDS[token.toLowerCase()];

const CONTENT_ROOTS = ["src/content", "src/pages", "src/decks"];
const EXTENSIONS = [".md", ".mdx", ".astro"];

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) return walk(full);
    return EXTENSIONS.includes(entry.slice(entry.lastIndexOf("."))) ? [full] : [];
  });
}

const files = CONTENT_ROOTS.flatMap((root) => walk(resolve(root))).map((file) => ({
  path: file.replace(`${resolve(".")}/`, ""),
  body: readFileSync(file, "utf8"),
}));

/**
 * Counts written in prose that assert a *total* rather than a subset.
 *
 * "the six axes" and "all seven channels" claim to be the whole set; so does
 * a count opening a line, which is how headings and topic sentences state
 * one. "four axes you can fill in from your notes" does not, and must stay
 * legal --- a taxonomy whose prose cannot refer to part of itself is worse
 * than one whose totals are hand-written.
 */
function totalsClaimed(body: string, noun: "channels" | "axes"): number[] {
  const pattern = new RegExp(
    `(?:(?:^|\\n)[\\s#>*-]*|\\b(?:the|all)\\s+)([A-Za-z]+|\\d+)\\s+${noun}\\b`,
    "gi",
  );
  const found: number[] = [];
  for (const match of body.matchAll(pattern)) {
    const value = parseCount(match[1]);
    if (value !== undefined) found.push(value);
  }
  return found;
}

describe("the argument chain", () => {
  it("gives every week a claim", () => {
    for (const lecture of lectures) {
      expect(
        typeof lecture.meta?.claim === "string" && (lecture.meta.claim as string).length > 0,
        `${lecture.id} has no claim:`,
      ).toBe(true);
    }
  });

  it("never makes the same claim twice", () => {
    const claims = lectures.map((lecture) => String(lecture.meta?.claim).trim().toLowerCase());
    expect(new Set(claims).size, "two weeks change the same thing about the thesis").toBe(
      claims.length,
    );
  });

  it("declares a channel for every week, teaching each one exactly once", () => {
    for (const lecture of lectures) {
      expect(channelsOf(lecture), `${lecture.id} has no channel:`).not.toBe("");
    }
    expect(channelNames.length, `a channel is introduced in two different weeks`).toBe(
      CHANNEL_COUNT,
    );
  });

  it("teaches at least one channel", () => {
    expect(CHANNEL_COUNT).toBeGreaterThan(0);
  });
});

describe("prose agrees with the data", () => {
  for (const { path, body } of files) {
    const counts = totalsClaimed(body, "channels");
    if (counts.length === 0) continue;
    it(`${path} counts the channels the way the frontmatter does`, () => {
      expect(
        counts.filter((count) => count !== CHANNEL_COUNT),
        `${path} names a channel count other than ${CHANNEL_COUNT} (found ${counts.join(", ")})`,
      ).toEqual([]);
    });
  }
});

describe("the taxonomy", () => {
  const taxonomy = lectures.find((lecture) => Array.isArray(lecture.meta?.axes));

  it("is declared as data on exactly one lecture", () => {
    expect(taxonomy, "no lecture declares axes:").toBeDefined();
    expect(lectures.filter((lecture) => Array.isArray(lecture.meta?.axes))).toHaveLength(1);
  });

  it("is counted consistently wherever it is counted", () => {
    const axisCount = (taxonomy!.meta!.axes as unknown[]).length;
    for (const { path, body } of files) {
      const counts = totalsClaimed(body, "axes");
      expect(
        counts.filter((count) => count !== axisCount),
        `${path} names an axis count other than ${axisCount} (found ${counts.join(", ")})`,
      ).toEqual([]);
    }
  });

  it("has a deck that names every channel it claims to place", () => {
    const slides = String(taxonomy!.meta!.slides ?? "");
    expect(slides, "the taxonomy lecture links no deck").not.toBe("");

    const deckName = slides.replace(/^\/decks\//, "").replace(/\/$/, "");
    const deck = readFileSync(resolve(`src/decks/${deckName}.deck.mdx`), "utf8").toLowerCase();
    for (const channel of new Set(channelNames)) {
      expect(deck.includes(channel), `${deckName} never mentions the ${channel} channel`).toBe(
        true,
      );
    }
  });
});
