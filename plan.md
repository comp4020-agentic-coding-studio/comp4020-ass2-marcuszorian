# Plan: the last pass before shipping SLOP4979

Working document, not a deliverable. It replaces the deck-and-lecture plan
that lived here, whose work is finished and is now the repo's commit history;
keeping a plan whose "starting state" disagreed with the build was worse than
keeping none.

Starting state, verified 2026-09-14:

- `pnpm check` green — 45 pages, 184 tests across 8 spec files, axe clean, no
  broken links, 79 slides across 9 decks measured for fit in a real browser
- `pnpm check:evidence` green — 8 cited commits all resolve
- `pnpm typecheck` — 0 errors, 0 warnings, 0 hints
- `PROCESS.md` — 555 words, inside the brief's 400–600
- repo `PRIVATE`, `GET /repos/.../pages` → 404: **not deployed**

Nothing below is a fix for a red state. Every item is either a defect no check
can currently see, a rule this repo states in prose but never measures, or the
ship itself.

---

## 1. What this pass is fixing

### F1 — four pages have no `<h1>`

```
0 h1  dist/lectures/index.html
0 h1  dist/assessments/index.html
0 h1  dist/people/index.html
0 h1  dist/404.html
```

Root cause, and it is a consequence of a decision made elsewhere:
`astro-theme-university/layouts/BaseLayout.astro:214` renders
`{heroTitle && resolvedHeroImage && <Hero title={heroTitle} …/>}` — **both**
conditions required. `ContentLayout` carries a fallback
(`{!resolvedHeroImage && <h1>{title}</h1>}`); `MdxPageLayout`, which
`src/layouts/PageLayout.astro` wraps, renders no `<h1>` at all — only the lead
paragraph.

So the image-free decision silently deleted the page title from every `.mdx`
page the moment the hero image went, and `heroTitle:` became frontmatter that
looks like a title and renders nothing. `/policies/` survives only because it
hand-writes `# Policies and support` in its body.

Nothing caught it. Axe's `page-has-heading-one` is a best-practice rule rather
than a violation, so the build's axe pass stays clean, and the missing heading
is not a link, so the link checker has nothing to say. `/lectures/` — the page
the whole argument-chain case rests on — currently opens on a lead paragraph
where its name should be.

### F2 — `PROCESS.md` omits the spine the brief names

The brief asks for a survey of existing course-design thinking and a position
on what makes a good course, then how that position fed the harness. The spine
it names: **what you decided a good course looks like → which of those
decisions you encoded → which you deliberately omitted.**

Parts two and three are the strongest material in the file. Part one is never
stated. "A course is one argument, not twelve topics" is doing exactly that
work on `/lectures/`, but `PROCESS.md` never claims it as a position or says
where it came from, so the file reads as *how this was built* rather than
*what a course is*.

### F3 — the focus rule is prose with no sensor behind it

CLAUDE.md's "Link and focus styling" rule is the one rule in the harness
nothing measures. Measured by hand in Chrome on 2026-09-14, it holds: the
focus ring is `rgb(185, 125, 28) solid 2px` at `outline-offset: 2px` on every
page type at both viewports, the skip link leads the tab order and becomes
visible on focus, and no page scrolls horizontally at 390 px. That is the
theme's doing, not this repo's, and a rule satisfied by accident is a rule
that will break without telling anyone.

### F4 — one prose overstatement

`src/content/people/idris-fenn.md:14` — "Runs weeks 2, 6, 7, 8, 10 and 11, and
most Benches", repeated in its `description:`. The week list matches
`teachers:` frontmatter exactly across all 24 lecture and session entries.
Six of twelve is **half**, not most. It is the prose-promises defect class,
sitting uncaught because that test reads decks, readings and assessment titles
but not teacher attribution.

### F5 — not shipped

CLAUDE.md's own warning is the operative fact: the first public push is the
first time the link checker, TruffleHog and the evidence gate have ever run
against this repo. Pre-checked locally as far as is possible — no key-shaped
string anywhere in the tree (`sk-`, `ghp_`, `AKIA` patterns all empty), and
the build's link checker green on 45 pages.

---

## 2. Sequence

Ordered so the repo is green at every boundary and no commit mixes harness with
content. Per CLAUDE.md, content lands first and the harness rule that pins it
follows as its own commit — except F1, where the test lands first because the
defect is already in the build and the test's job is to name it.

| # | Commit | Contents | State |
|---|---|---|---|
| 1 | harness | H1 `spec/page-headings.test.ts` + H4's heading rule in CLAUDE.md | |
| 2 | fix | F1: title rendered in `PageLayout.astro`, `heroTitle:` deleted from all four files, `#` heading dropped from `policies/index.mdx` | |
| 3 | harness | H2 `scripts/check-viewports.ts` wired into `pnpm check` + H4's focus rule | |
| 4 | harness | H3 teacher attribution added to `spec/prose-promises.test.ts` | |
| 5 | content | F4: "most Benches" → "half the Benches", body and `description:` | |
| 6 | docs | `PROCESS.md` rewritten around F2 | |
| 7 | — | both gates, then `pnpm check:decks` specifically | |
| 8 | — | `/ship`: public, Pages on, deploy dispatched, both CI jobs green | |
| 9 | — | read the live site in Chrome at both viewports | |

Step 1 lands red against the current build — that is the point, and it is the
one legitimate exception to "never commit a red state" only if step 2 lands in
the same session. If it will not, do steps 1 and 2 as one commit and record why
in the message.

Steps 6 and 8 are the two that most change what a marker sees. Step 2 is the
only real defect in the artefact and it is a single-file fix.

---

## 3. Harness changes

Each lands as its own commit, separate from the content it protects, and each
must be *provably* load-bearing before it lands: mutate what it guards, watch
it fail with the message a future author would read, revert. A test never seen
to fail is not evidence of anything — the first version of `prose-promises`
passed its own mutation.

**H1 — `spec/page-headings.test.ts`.** Closes F1 as a class.

```ts
// Every page names itself. The image-free decision removed the hero image,
// and BaseLayout renders `heroTitle` only alongside one --- so every
// MdxPageLayout page lost its <h1> silently, four at once, while axe stayed
// green (page-has-heading-one is best-practice, off by default) and the link
// checker saw nothing, because a heading is not a link.
//
// Decks are exempt: a deck's headings belong to its slides.
describe("every page states its own name", () => {
  for (const page of builtPages().filter((p) => !p.startsWith("decks/"))) {
    it(`${page} has exactly one non-empty <h1>`, () => { … });
  }
});

// heroTitle renders nothing without a hero image, so under the image-free
// rule it is dead frontmatter shaped like a title. That is how F1 hid.
it("no content file declares heroTitle", () => { … });
```

Mutation: delete the `#` from `policies/index.mdx`, confirm the failure names
that page.

**H2 — `scripts/check-viewports.ts`.** Closes F3. Same shape as
`scripts/check-decks.ts`: `puppeteer-core`, `headless: "shell"`, skips loudly
when no Chrome is installed, wired into `pnpm check`. Per page type, at
1920×1080 and 390×844:

- `documentElement.scrollWidth <= clientWidth + 2` — no horizontal scroll
- the first content link under focus resolves to a non-`none` outline in a
  brand colour, not the UA default, with a non-zero `outline-offset`
- the skip link is the first tabbable element and is visible when focused

All three pass today. That is why the check is worth writing: it records a
decision currently true only by the theme's accident, and it turns the one
unmeasured rule in CLAUDE.md into a sensor.

**H3 — teacher attribution in `spec/prose-promises.test.ts`.** Closes F4. A
people entry that enumerates week numbers must match that person's `teachers:`
edges, and a quantity word before "Bench"/"Benches" (`all`, `most`, `half`,
`some`) must be consistent with the count — the same count-against-data shape
`argument-chain.test.ts` already uses. Natural third member of the family
alongside decks, readings and assessment titles.

**H4 — CLAUDE.md rules.**

```markdown
## Every page states its own name

The image-free decision has a consequence that is easy to miss: the theme
renders `heroTitle` only alongside a hero image, and `MdxPageLayout` renders
no `<h1>` of its own. With no imagery, four `.mdx` pages shipped with no page
title at all and axe stayed green, because `page-has-heading-one` is a
best-practice rule rather than a violation. So the title is rendered in one
place --- `src/layouts/PageLayout.astro` --- every built page carries exactly
one `<h1>`, and `heroTitle:` is not a key this site uses.
`spec/page-headings.test.ts` enforces both halves.

## Focus is measured, not asserted

The no-blue-box rule was prose in this file for the whole build, satisfied
only by what the theme happened to do. `pnpm check:viewports` now measures it:
no page scrolls horizontally at 390 px, the first content link's
`:focus-visible` outline is a brand colour rather than the UA default, and the
skip link leads the tab order and becomes visible when focused. It skips
loudly without Chrome --- a skipped run is not a pass.
```

---

## 4. The `PROCESS.md` rewrite

Budget is the binding constraint: 555 of 600 words, so F2's material has to be
paid for. Cut the closing CI paragraph — those numbers are visible in the repo
— and compress "What I built" to one sentence.

What replaces "Choosing the concept, and the level", in roughly 150 words:
what a good course was decided to be, taken from a survey of existing course
design rather than asserted — that a course is one compounding argument rather
than a list of topics, and that the test of a week is whether deleting it
weakens the argument. Then the encoding, which already exists and is already
cited: `claim:` per week, no two the same, rendered as the twelve-line chain on
`/lectures/` — cite `19a83c2` and `26b665f`, already in the file.

Keep unchanged: "Two decisions worth the space" and "What I did not build".
They are the strongest parts of the file and they already carry what the
process band asks for — the discarded week, and the harness test that passed
its own mutation.

Add one sentence citing step 3 as the Assignment 1 focus-styling feedback
closed at the harness level rather than by editing a stylesheet.

---

## 5. Verification, manually

No check sees any of this.

- open `/lectures/`, `/assessments/` and `/people/` at 1920×1080 and 390×844
  after step 2 — the page's name should be the first thing on it
- tab through one lecture page and one deck at both viewports: focus visible on
  every link, no `outline: none` with nothing replacing it
- open the mobile menu at 390 px, resize to 1920 px mid-interaction, confirm
  the nav recovers (it does today: links visible, not inert, no overflow; the
  toggle's `aria-expanded` stays `"true"` while hidden, which is cosmetic)
- read the live site as a prospective student, in the marker's actual path:
  home, two non-adjacent weeks, an assessment, a deck, policies
- throttle to slow 3G once and load a deck

---

## 6. If time runs out

Most to least valuable per hour spent:

1. Ship (step 8). An undeployed site fails the spec's first line whatever else
   is true, and the flip is the first exercise of three CI sensors.
2. `PROCESS.md`'s missing spine (step 6). 150 words against the largest
   criterion.
3. F1 with H1 (steps 1–2). One defect, four pages, one file to fix.
4. H2 (step 3) — the Assignment 1 feedback answered with a sensor.
5. H3 and F4 (steps 4–5).

Do not let the ship be the last thing attempted. `pnpm check` and
`pnpm check:evidence` both run locally before the flip, and the flip itself
happens with days in hand, not at the cutoff.
