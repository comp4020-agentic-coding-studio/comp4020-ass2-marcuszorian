import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

interface ApiEdge {
  from: string;
  to: string;
}

interface ApiNode {
  id: string;
  type: string;
}

interface CourseApi {
  nodes: ApiNode[];
  edges: ApiEdge[];
}

const api = JSON.parse(readFileSync(resolve("dist/api/index.json"), "utf8")) as CourseApi;

const hasEdge = (a: string, b: string) =>
  api.edges.some((edge) => (edge.from === a && edge.to === b) || (edge.from === b && edge.to === a));

describe("every week links its own lecture and Bench", () => {
  for (const week of Array.from({ length: 12 }, (_, i) => i + 1)) {
    it(`week ${week}'s lecture and session reference each other`, () => {
      const lecture = api.nodes.find(
        (node) => node.type === "lectures" && node.id === `lectures/week-${String(week).padStart(2, "0")}`,
      );
      const session = api.nodes.find((node) => node.type === "sessions" && node.id.startsWith(`sessions/${String(week).padStart(2, "0")}-`));

      expect(lecture, `no lecture found for week ${week}`).toBeDefined();
      expect(session, `no session found for week ${week}`).toBeDefined();
      expect(
        hasEdge(lecture!.id, session!.id),
        `${lecture!.id} and ${session!.id} have no related-edge between them`,
      ).toBe(true);
    });
  }
});

describe("every assessment links back to a session", () => {
  it("has at least one related edge into the sessions collection, for each assessment", () => {
    const assessments = api.nodes.filter((node) => node.type === "assessments");
    for (const assessment of assessments) {
      const linksToSession = api.edges.some(
        (edge) =>
          (edge.from === assessment.id && edge.to.startsWith("sessions/")) ||
          (edge.to === assessment.id && edge.from.startsWith("sessions/")),
      );
      expect(linksToSession, `${assessment.id} has no edge to any session`).toBe(true);
    }
  });
});
