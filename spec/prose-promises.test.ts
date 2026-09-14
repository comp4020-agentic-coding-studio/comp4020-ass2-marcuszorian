import { readdirSync, readFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { describe, expect, it } from "vitest";

// One contract: the prose may not promise something the site does not have.
//
// Three separate defects turned out to be the same defect. Week 6's Bench
// sent students to "the deck" in a week with no deck. Week 9's Bench sent
// them to "the week's readings" when the site publishes no readings at all.
// Four pages named "Assignment 1", which is not the title of any assessment
// here --- the thing they meant is called the Trace Analysis Lab, and a
// student following the reference had nothing to follow it to.
//
// Each was a one-line edit and none of them would have stayed fixed. A
// broken cross-reference is invisible to the link checker, because it is not
// a link: it is prose asserting that some other part of the site exists. The
// only way to hold it is to read the assertion out of the prose and check it
// against the data.
//
// The deck half of this contract lives in spec/deck-policy.test.ts, next to
// the rest of the deck rules.

interface ApiNode {
  id: string;
  type: string;
  title?: string;
  description?: string;
  meta?: Record<string, unknown>;
}

const api = JSON.parse(readFileSync(resolve("dist/api/index.json"), "utf8")) as {
  nodes: ApiNode[];
};

const byType = (type: string) => api.nodes.filter((node) => node.type === type);

// Titles are top-level on an API node; week and slides are under meta. An
// empty title here would make the check below vacuous, so drop empties
// rather than let one match every string.
const assessmentTitles = byType("assessments")
  .map((node) => node.title ?? "")
  .filter(Boolean);
const weeksWithSessions = new Set(byType("sessions").map((node) => Number(node.meta?.week)));
const lecturesByWeek = new Map(byType("lectures").map((node) => [Number(node.meta?.week), node]));

const ROOTS = ["src/content", "src/pages", "src/decks"];
const EXTENSIONS = [".md", ".mdx", ".astro"];

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return EXTENSIONS.some((ext) => entry.name.endsWith(ext)) ? [full] : [];
  });
}

const files = ROOTS.flatMap((root) => walk(resolve(root))).map((path) => ({
  path,
  name: basename(path),
  source: readFileSync(path, "utf8"),
}));

describe("prose promises the site can keep", () => {
  it("names assessments by a title the site actually publishes", () => {
    // "Assignment 1" is what a course site says when nobody has decided what
    // the assessment is called. The offence is the generic reference, so the
    // check is for the shape, not for a specific stale name.
    const offenders = files
      .filter(({ source }) => /\bAssignment\s+\d/i.test(source))
      .map(({ name, source }) => {
        const cited = source.match(/\bAssignment\s+\d+/i)?.[0] ?? "";
        return `${name} cites "${cited}"`;
      })
      .filter((offender) => !assessmentTitles.some((title) => offender.includes(title)));

    expect(offenders, `assessments are: ${assessmentTitles.join(", ")}`).toEqual([]);
  });

  it("sends students to readings only where readings exist", () => {
    const offenders: string[] = [];
    for (const { name, source } of files) {
      if (!/\bthe (week's|week’s) readings\b|\bthe readings\b/i.test(source)) continue;
      const week = Number(source.match(/^week:\s*(\d+)/m)?.[1]);
      const readings = lecturesByWeek.get(week)?.meta?.readings;
      if (!Array.isArray(readings) || readings.length === 0) {
        offenders.push(`${name} points at week ${week}'s readings, which are not declared`);
      }
    }
    expect(offenders).toEqual([]);
  });

  it("refers across weeks only to weeks that have the thing", () => {
    // "Week 10's Bench asks you to score several channels" is a promise made
    // on week 6's page about week 10's page, and the two drift apart the
    // moment a week is renumbered or dropped.
    const offenders: string[] = [];
    const reference = /\bweek\s+(\d+)(?:'s|’s)\s+(bench|deck|lecture)\b/gi;

    for (const { name, source } of files) {
      for (const [, digits, thing] of source.matchAll(reference)) {
        const week = Number(digits);
        const kind = thing.toLowerCase();
        const has =
          kind === "bench"
            ? weeksWithSessions.has(week)
            : kind === "lecture"
              ? lecturesByWeek.has(week)
              : Boolean(lecturesByWeek.get(week)?.meta?.slides);
        if (!has) offenders.push(`${name} refers to week ${week}'s ${kind}, which does not exist`);
      }
    }
    expect([...new Set(offenders)]).toEqual([]);
  });
});

// The fourth member of the same family, and it caught a live overstatement:
// the tutor's page said "Runs weeks 2, 6, 7, 8, 10 and 11, and most Benches"
// with the same claim in its `description:`. The week list was exactly right.
// Six Benches of twelve is half, not most --- the two teachers split them
// evenly --- and nothing could see it, because the existing checks here read
// decks, readings and assessment titles, and a teacher attribution is none of
// those.
//
// It is the same defect shape as a count in prose: a number, or a word doing
// the work of a number, hand-written next to data that can move. Reassign one
// week's Bench and every quantity word on both people pages is a candidate
// for being wrong.

interface Person {
  id: string;
  slug: string;
  name: string;
  description: string;
  body: string;
  lectureWeeks: number[];
  benchCount: number;
}

const weekOf = (node: ApiNode) => Number(node.meta?.week);
const teachersOf = (node: ApiNode) =>
  Array.isArray(node.meta?.teachers) ? (node.meta.teachers as string[]) : [];

const people: Person[] = byType("people").map((node) => {
  const slug = node.id.replace(/^people\//, "");
  const source = files.find(({ path }) => path.endsWith(`/people/${slug}.md`))?.source ?? "";
  // Frontmatter holds the description; the body is everything after it. Split
  // so a quantity word is attributed to the half it actually appears in.
  const body = source.replace(/^---[\s\S]*?\n---\n/, "");

  return {
    id: node.id,
    slug,
    name: node.title ?? slug,
    description: node.description ?? "",
    body,
    lectureWeeks: byType("lectures")
      .filter((lecture) => teachersOf(lecture).includes(slug))
      .map(weekOf)
      .sort((a, b) => a - b),
    benchCount: byType("sessions").filter((session) => teachersOf(session).includes(slug)).length,
  };
});

const benchTotal = byType("sessions").length;

// Quantity words, as fractions of the whole, with the range each one may
// honestly cover. "Most" means a majority, so half does not qualify; "half"
// is checked with slack for an odd total.
const QUANTITIES: Record<string, (part: number, total: number) => boolean> = {
  all: (part, total) => part === total,
  every: (part, total) => part === total,
  most: (part, total) => part > total / 2,
  half: (part, total) => Math.abs(part - total / 2) <= 0.5,
  some: (part, total) => part > 0 && part < total,
  several: (part) => part > 1,
  few: (part, total) => part > 0 && part <= total / 4,
  one: (part) => part === 1,
  none: (part) => part === 0,
  no: (part) => part === 0,
};

describe("people pages attribute what the data attributes", () => {
  it("finds the people and the weeks they teach", () => {
    // Vacuity guard: a renamed collection or a dropped `teachers:` key would
    // otherwise make every assertion below trivially true.
    expect(people.length).toBeGreaterThan(0);
    expect(benchTotal).toBeGreaterThan(0);
    for (const person of people) {
      expect(person.body, `${person.slug}.md was not found on disk`).not.toBe("");
      expect(
        person.lectureWeeks.length,
        `${person.slug} teaches no lecture, so no week list can be checked`,
      ).toBeGreaterThan(0);
    }
  });

  for (const person of people) {
    it(`${person.name} enumerates only the weeks they teach`, () => {
      // A sentence like "Runs weeks 2, 6, 7, 8, 10 and 11" is a complete
      // enumeration, so it has to match the edges exactly --- both directions:
      // a week claimed but not taught, and a week taught but not claimed.
      const prose = `${person.description}\n${person.body}`;
      const lists = [
        ...prose.matchAll(/\bweeks\s+((?:\d+\s*(?:,|and|&)\s*)+\d+)/gi),
      ].map((match) => match[1]);

      for (const list of lists) {
        const claimed = [...list.matchAll(/\d+/g)].map((digits) => Number(digits[0])).sort((a, b) => a - b);
        expect(
          claimed,
          `${person.slug} says it runs weeks ${claimed.join(", ")}; ` +
            `\`teachers:\` puts them on ${person.lectureWeeks.join(", ")}`,
        ).toEqual(person.lectureWeeks);
      }
    });

    it(`${person.name} quantifies Benches consistently with the count`, () => {
      const prose = `${person.description}\n${person.body}`;
      const words = Object.keys(QUANTITIES).join("|");
      // The quantity word may be separated from "Bench" by a few words of
      // qualification --- "most of the weekly Bench sessions" --- so allow a
      // short gap rather than requiring adjacency.
      const pattern = new RegExp(`\\b(${words})\\b(?:\\s+\\w+){0,3}?\\s+(?:Bench|Benches)\\b`, "gi");

      const offenders: string[] = [];
      for (const [phrase, word] of prose.matchAll(pattern)) {
        const holds = QUANTITIES[word.toLowerCase()]!;
        if (!holds(person.benchCount, benchTotal)) {
          offenders.push(
            `"${phrase.trim()}" — ${person.slug} teaches ${person.benchCount} of ${benchTotal} Benches`,
          );
        }
      }

      expect(offenders).toEqual([]);
    });
  }
});
