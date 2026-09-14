import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

// The Channel Report asks students to cite the original disclosure of a
// channel. Before `readings:` existed, this site named eight papers in prose
// with no year for most, no venue for any, and no link to a single one --- it
// marked a standard it did not meet.
//
// Declaring the sources as data fixes that once. What it does not fix is the
// three ways the apparatus rots afterwards, which is what this file holds:
//
// - prose and data drift apart. A lecture says "Kocher's 1996 demonstration"
//   and the readings list a different year, or the paper stops being listed
//   at all when someone rewrites the week.
// - a source cited by two weeks gets retyped, and the two copies disagree
//   about who wrote it or where it appeared. The bibliography on /lectures/
//   then shows the same paper twice, differently.
// - the data stays right and stops rendering. A component refactor drops the
//   section and nothing else notices, because the frontmatter is still there
//   and every other check reads the frontmatter.
//
// The last one is why these assertions read the built HTML rather than the
// source: what matters is what a reader is shown.
//
// One thing deliberately NOT asserted: that every declared reading is named
// in the prose. An earlier draft of this contract required it. It would mean
// either dropping the papers a week should send students to but has no
// sentence about --- Lampson's confinement memo, Percival on cache misses ---
// or padding the prose with name-drops to satisfy a test. A reading list is
// allowed to be longer than the lecture's own citations.

// Readings come from the built API and prose comes from the source file, so
// these assertions are only meaningful against a fresh build. `pnpm test`
// builds first, which is what makes that true; running vitest alone after
// editing frontmatter compares new prose against stale data and passes.

interface Reading {
  authors: string;
  year: number;
  title: string;
  venue: string;
  url?: string;
}

interface ApiNode {
  id: string;
  type: string;
  meta?: Record<string, unknown>;
}

const api = JSON.parse(readFileSync(resolve("dist/api/index.json"), "utf8")) as {
  nodes: ApiNode[];
};

const lectures = api.nodes
  .filter((node) => node.type === "lectures")
  .map((node) => ({
    id: node.id,
    week: Number(node.meta?.week),
    readings: (node.meta?.readings ?? []) as Reading[],
    body: readFileSync(resolve(`src/content/${node.id}.md`), "utf8").split(/\n---\n/).slice(1).join("\n---\n"),
    html: readFileSync(resolve(`dist/${node.id}/index.html`), "utf8"),
  }))
  .sort((a, b) => a.week - b.week);

const key = (reading: Reading) => reading.url ?? `${reading.authors} ${reading.year}`;

describe("primary sources", () => {
  it("covers every year the prose treats as a publication year", () => {
    const gaps: string[] = [];
    for (const { week, readings, body } of lectures) {
      const years = new Set(readings.map((reading) => reading.year));
      for (const [, digits] of body.matchAll(/\b((?:19|20)\d{2})\b/g)) {
        const year = Number(digits);
        if (!years.has(year)) {
          gaps.push(`week ${week} says ${year} but lists no reading from that year`);
        }
      }
    }
    expect([...new Set(gaps)]).toEqual([]);
  });

  it("describes a shared source identically wherever it is cited", () => {
    const seen = new Map<string, { week: number; reading: Reading }>();
    const drift: string[] = [];
    for (const { week, readings } of lectures) {
      for (const reading of readings) {
        const first = seen.get(key(reading));
        if (!first) {
          seen.set(key(reading), { week, reading });
          continue;
        }
        for (const field of ["authors", "year", "title", "venue"] as const) {
          if (String(first.reading[field]) !== String(reading[field])) {
            drift.push(
              `weeks ${first.week} and ${week} disagree on ${field}: ` +
                `"${first.reading[field]}" vs "${reading[field]}"`,
            );
          }
        }
      }
    }
    expect(drift).toEqual([]);
  });

  it("cites each source once per week, over https", () => {
    const problems: string[] = [];
    for (const { week, readings } of lectures) {
      const keys = readings.map(key);
      if (new Set(keys).size !== keys.length) problems.push(`week ${week} cites a source twice`);
      for (const reading of readings) {
        if (reading.url && !reading.url.startsWith("https://")) {
          problems.push(`week ${week}: ${reading.url} is not https`);
        }
      }
    }
    expect(problems).toEqual([]);
  });

  it("renders every declared reading on the week's own page", () => {
    const missing: string[] = [];
    for (const { week, readings, html } of lectures) {
      for (const reading of readings) {
        const shown = reading.url ? html.includes(reading.url) : html.includes(reading.title);
        if (!shown) missing.push(`week ${week} declares "${reading.title}" but does not show it`);
      }
    }
    expect(missing).toEqual([]);
  });

  it("collects every distinct source exactly once on /lectures/", () => {
    const html = readFileSync(resolve("dist/lectures/index.html"), "utf8");
    const distinct = new Map<string, Reading>();
    for (const { readings } of lectures) {
      for (const reading of readings) distinct.set(key(reading), reading);
    }

    const problems: string[] = [];
    for (const [id, reading] of distinct) {
      if (!reading.url) continue;
      const occurrences = html.split(reading.url).length - 1;
      if (occurrences === 0) problems.push(`the bibliography omits ${id}`);
      if (occurrences > 1) problems.push(`the bibliography lists ${id} ${occurrences} times`);
    }
    expect(problems).toEqual([]);
  });
});
