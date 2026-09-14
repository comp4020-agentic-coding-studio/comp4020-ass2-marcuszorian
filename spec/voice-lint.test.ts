import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";

// The banned phrases named in CLAUDE.md's register rule, plus a few of the
// same family. Case-insensitive, matched against prose content only.
const BANNED_PHRASES = [
  "dive into",
  "delve into",
  "unlock",
  "game-changer",
  "game changer",
  "seamless",
  "leverage",
  "revolutioniz",
  "cutting-edge",
  "cutting edge",
  "let's explore",
  "supercharge",
  "in today's world",
  "it's important to note",
];

const CONTENT_ROOTS = ["src/content", "src/pages", "src/decks"];
const CONTENT_EXTENSIONS = [".md", ".mdx"];

function walk(dir: string): string[] {
  const entries = readdirSync(dir);
  const files: string[] = [];
  for (const entry of entries) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      files.push(...walk(full));
    } else if (CONTENT_EXTENSIONS.includes(entry.slice(entry.lastIndexOf(".")))) {
      files.push(full);
    }
  }
  return files;
}

const files = CONTENT_ROOTS.flatMap((root) => walk(resolve(root)));

describe("course voice", () => {
  it("found content files to check", () => {
    expect(files.length).toBeGreaterThan(0);
  });

  for (const file of files) {
    const relative = file.replace(`${resolve(".")}/`, "");
    const body = readFileSync(file, "utf8");
    const lower = body.toLowerCase();

    it(`${relative} avoids banned marketing phrases`, () => {
      const hits = BANNED_PHRASES.filter((phrase) => lower.includes(phrase));
      expect(hits, `${relative} contains: ${hits.join(", ")}`).toEqual([]);
    });

    it(`${relative} has no exclamation points in prose`, () => {
      // Fenced code blocks may legitimately contain "!" (e.g. shebangs,
      // negation, shell history expansion) so they're stripped first.
      const withoutCodeFences = body.replace(/```[\s\S]*?```/g, "");
      expect(withoutCodeFences.includes("!"), `${relative} uses an exclamation point`).toBe(false);
    });
  }
});
