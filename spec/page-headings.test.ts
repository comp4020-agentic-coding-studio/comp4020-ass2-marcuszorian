import { readdirSync, readFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { describe, expect, it } from "vitest";

// Every page states its own name.
//
// This is the image-free decision's side effect, and it is the kind that
// hides: BaseLayout renders the page title only as part of the hero, and only
// when there is a hero *image* to render it over ---
// `{heroTitle && resolvedHeroImage && <Hero .../>}`. ContentLayout carries a
// fallback for the no-image case; MdxPageLayout, which src/layouts/
// PageLayout.astro wraps, carried none, and rendered nothing but the lead
// paragraph.
//
// So the moment this course dropped its imagery, four `.mdx` pages lost their
// <h1> at once --- /lectures/, /assessments/, /people/ and the 404 --- and
// `heroTitle:` became frontmatter that looks like a title and renders nothing.
// /lectures/, the page the whole argument-chain case rests on, opened on a
// lead paragraph where its name should have been.
//
// Nothing in the build could see it. axe's `page-has-heading-one` is a
// best-practice rule rather than a violation, so the accessibility pass stayed
// green across all 45 pages; the link checker had nothing to say, because a
// heading is not a link; and the structural deck check reads MDX, not titles.
// A missing page title is invisible to every instrument here except a person
// opening the page, which is exactly the class of defect this file exists for.
//
// Decks are exempt: a deck's headings belong to its slides, and reveal's
// markup is astromotion's contract rather than this site's.

const DIST = resolve("dist");

function builtPages(): string[] {
  const walk = (dir: string): string[] =>
    readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) return walk(full);
      return entry.name.endsWith(".html") ? [full] : [];
    });

  return walk(DIST)
    .map((path) => relative(DIST, path))
    .filter((page) => !page.startsWith("decks/"))
    .sort();
}

// Strip tags and entities so a title wrapped in a <span> still counts as
// non-empty, and an <h1> holding only whitespace or an icon does not.
const textOf = (html: string) =>
  html
    .replace(/<[^>]*>/g, "")
    .replace(/&[a-z]+;|&#\d+;/gi, " ")
    .trim();

const pages = builtPages();

describe("every page states its own name", () => {
  it("finds pages to check at all", () => {
    // Guards against the whole suite passing vacuously when dist is stale or
    // the walk above stops matching the output layout.
    expect(pages.length).toBeGreaterThan(30);
  });

  for (const page of pages) {
    it(`${page} has exactly one non-empty <h1>`, () => {
      const html = readFileSync(join(DIST, page), "utf8");
      const headings = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((match) =>
        textOf(match[1]),
      );

      expect(
        headings.length,
        `${page} renders ${headings.length} <h1> elements; a page names itself exactly once`,
      ).toBe(1);
      expect(headings[0], `${page}'s <h1> is empty`).not.toBe("");
    });
  }
});

// The other half of the same contract. `heroTitle` is only ever drawn
// alongside a hero image, so under the image-free rule it is dead frontmatter
// shaped like a title --- which is precisely how the missing headings went
// unnoticed: four files declared a title the theme never rendered. Keeping the
// key out is what stops the next author from believing it again.
it("no content file declares heroTitle", () => {
  const ROOTS = ["src/content", "src/pages", "src/decks"];
  const EXTENSIONS = [".md", ".mdx", ".astro"];

  const walk = (dir: string): string[] =>
    readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) return walk(full);
      return EXTENSIONS.some((ext) => entry.name.endsWith(ext)) ? [full] : [];
    });

  const offenders = ROOTS.flatMap((root) => walk(resolve(root)))
    .filter((path) => /^\s*heroTitle\s*:/m.test(readFileSync(path, "utf8")))
    .map((path) => relative(resolve("."), path));

  expect(
    offenders,
    `heroTitle renders nothing without a hero image, and this site has no images: ${offenders.join(", ")}`,
  ).toEqual([]);
});
