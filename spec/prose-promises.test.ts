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
