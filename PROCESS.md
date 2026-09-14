# Process overview

## What I built

SLOP4979, *Side Channels: What Machines Say Without Meaning To* — a
twelve-week, image-free course on seven physical channels, taught as one
compounding argument rather than a list of topics. Three assessments
(30/30/40) run from reading a single trace to a capstone design review.

## Choosing the concept, and the level

Concept selection was adversarial rather than first-idea: several candidates
were scored against the brief's own criteria before the user asked which
would allow the highest grade. Side channels won because its twelve weeks
compound into one thesis, and because that structure is mechanically
checkable — one `claim:` per week, no two the same — in a way a looser topic
is not. [`eb10325`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-marcuszorian/commit/eb10325)
records that decision, the deadpan register rule, and the image-free choice.

The starter's `SLOP1979` was a 1000-level code on a course that estimates
mutual information and rewrites for constant time. Only the leading digit is
free and it does not affect the mark; plausibility does.
[`c17f3a9`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-marcuszorian/commit/c17f3a9)
moved it rather than leave the default unexamined. The no-imagery rule
likewise earned an amendment:
[`d5fc35d`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-marcuszorian/commit/d5fc35d)
permits inline SVG data figures — a power trace, a thermal decay, a cost
curve — because a course about measurement that shows no measurements argues
against itself. Photography and portraits stay out.

## Two decisions worth the space

**A defect class, closed once.** Four pages named "Assignment 1", which is
not an assessment this site publishes. One week referred to "the deck" it did
not have. Another sent students to readings that did not exist. Three edits
would have fixed three symptoms;
[`b1398dc`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-marcuszorian/commit/b1398dc)
fixed the content and
[`3d7f5b3`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-marcuszorian/commit/3d7f5b3)
added the contract: *the prose may not promise something the site does not
have*. Mutating the content back proved the point twice over — the first
version of that test **passed** the mutation, because it read `title` from
the wrong level of the generated API and was comparing every page against the
empty string. A test never seen to fail is not evidence of anything, so every
harness commit here was mutation-tested before it landed.

**Deleting a week's work.** CLAUDE.md holds that a week which could be
deleted without the argument weakening is the wrong week. Week 8's Bench
ranked channels on three axes; week 10's Bench ranked channels on the
taxonomy's own axes, with a number attached.
[`3bcfa49`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-marcuszorian/commit/3bcfa49)
deleted the first and made week 8 measure the thermal decay its own lecture
describes. The same defect had put four different channel counts on four
pages, so
[`26b665f`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-marcuszorian/commit/26b665f)
derives the number from frontmatter and fails the build on any page that
disagrees.

## What I did not build

Five decks, deliberately. Week 7 is optical and this site is image-free, so
its deck would be prose about photographs it cannot show; weeks 1 and 9 are
arguments, not procedures. No transient-execution week either: it is the
decade's most consequential disclosure and it leaks what a program only
*speculated*, which is a different argument on different prerequisites, so
weeks 6 and 12 state that boundary as a decision
([`9ca653d`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-marcuszorian/commit/9ca653d))
rather than leave a silent gap.

CI runs nothing while the repo is private, so `pnpm check` and
`pnpm check:evidence` ran locally before every commit — 184 tests, 45 pages,
and 79 slides measured for fit in a real browser rather than asserted against
parsed HTML.
