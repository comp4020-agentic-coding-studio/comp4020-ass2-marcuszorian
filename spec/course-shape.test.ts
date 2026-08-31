import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

interface ApiNode {
  id: string;
  type: string;
  meta?: Record<string, unknown>;
}

interface CourseApi {
  course: { code: string };
  nodes: ApiNode[];
}

const api = JSON.parse(readFileSync(resolve("dist/api/index.json"), "utf8")) as CourseApi;

// Assigned at provisioning (course-config.ts's own comment); no other course
// in the cohort has them, so they're a fixed fact about this repo, not a
// tuning number that drifts.
const ASSIGNED_DIGITS = "979";

describe("SLOP course code", () => {
  it("keeps the three digits the repo arrived with", () => {
    expect(api.course.code).toMatch(new RegExp(`${ASSIGNED_DIGITS}$`));
  });
});

describe("teaching weeks", () => {
  it("runs a dated session across all twelve teaching weeks", () => {
    const sessions = api.nodes.filter((node) => node.type === "sessions");
    const weeks = sessions
      .map((node) => node.meta?.week)
      .filter((week): week is number => typeof week === "number")
      .sort((a, b) => a - b);
    expect(weeks, "one session per week, weeks 1-12").toEqual(
      Array.from({ length: 12 }, (_, i) => i + 1),
    );
  });
});

describe("lectures and decks", () => {
  it("has at least one lecture linked to a deck that actually builds", () => {
    const lectures = api.nodes.filter((node) => node.type === "lectures");
    const withSlides = lectures.filter(
      (node) => typeof node.meta?.slides === "string" && node.meta.slides.length > 0,
    );
    expect(withSlides.length, "at least one lecture sets meta.slides").toBeGreaterThan(0);

    for (const lecture of withSlides) {
      const slides = lecture.meta?.slides as string;
      const deckPage = resolve("dist", slides.replace(/^\//, ""), "index.html");
      expect(existsSync(deckPage), `${lecture.id} links ${slides}, but it never built`).toBe(true);
    }
  });
});

describe("assessment weighting", () => {
  it("adds up to 100%", () => {
    const assessments = api.nodes.filter((node) => node.type === "assessments");
    const total = assessments.reduce((sum, node) => sum + (Number(node.meta?.weight) || 0), 0);
    expect(total, "assessment weights across the course").toBe(100);
  });
});
