# Process overview

## What I built

SLOP4979, *Side Channels: What Machines Say Without Meaning To*, is a
twelve-week, image-free course on seven physical channels, taught as one
compounding argument and assessed 30/30/40, moving from a single trace to a
capstone design review.

## What I decided a good course looks like

The brief's named sites and the handbook entries beside them didn't differ
in production values. *Calling Bullshit*, *How to Make (Almost) Anything*,
and *CS 007* each carry one idea throughout; a handbook entry carries a
topic list and a weighting table instead. Constructive alignment, where
outcomes, activities and assessment point at the same thing, is the
standard answer, but it only certifies agreement: twelve aligned weeks can
still be twelve encyclopedia entries.

So the position has two parts: a course is one argument, not twelve topics,
and the test of a week is whether deleting it weakens the argument; and a
syllabus that only says what a week covers hides whether it does anything,
so every week must name what a student does. Concept selection was
adversarial: several candidates were weighed against that position before
side channels won, because its weeks compound and "compound" is checkable
where a looser topic isn't.
[`eb10325`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-marcuszorian/commit/eb10325)
pins the decision alongside the register and image-free rules.

## Which of it I encoded

A position not written down gets negotiated away by the twelfth week.
[`19a83c2`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-marcuszorian/commit/19a83c2)
gives every week a `claim:`, one sentence on what it changes, no two alike,
rendered in order on `/lectures/`. The agent defaulted to summarising
coverage, so the rule rejects coverage-shaped claims outright rather than
relying on me to catch twelve of them by hand.

Then came the accounting, where I stopped trusting prose.
[`26b665f`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-marcuszorian/commit/26b665f)
derives the channel count from frontmatter and fails the build on
disagreement, after four pages once gave four different totals.
[`3d7f5b3`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-marcuszorian/commit/3d7f5b3)
checks prose against the site it describes, after four pages called an
assessment "Assignment 1." Its first version passed by comparing every page
to an empty string, and an untested test isn't evidence, so every harness
commit since is mutated before landing. That check later caught "most
Benches" claimed on a page where the data showed six of twelve, fixed in
[`e22b684`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-marcuszorian/commit/e22b684).

Two rules had gone unmeasured. The image-free decision had silently deleted
the `<h1>` from four pages, since the theme only draws a title beside a
hero image, and axe rates the absence as best practice
([`e3762cc`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-marcuszorian/commit/e3762cc)).
[`12b0736`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-marcuszorian/commit/12b0736)
answers Assignment 1's focus-styling feedback the same way: it drives a
browser, presses Tab, and measures the ring against the brand token at both
viewports, a rule that had only held by accident.

The most expensive call merged two Benches that each ranked channels on
axes, since my own rule said one had to go.
[`3bcfa49`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-marcuszorian/commit/3bcfa49)
keeps both ideas instead: week 8 gets a real measurement, a decay fit read
into two windows, and week 10 absorbs the axis comparison as its own
argument.

## Which I left out

Three decks are missing: week 7 is optical on an image-free site, and weeks
1 and 9 argue rather than instruct, so a deck would only restate the
lecture. A transient-execution week is out too, since it leaks what a
program only speculated, a different argument on prerequisites this course
never builds; weeks 6 and 12 state that as a decision
([`9ca653d`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-marcuszorian/commit/9ca653d)).
The image-free rule took one amendment,
[`d5fc35d`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-marcuszorian/commit/d5fc35d):
inline SVG figures plotted from numbers in the file, since a course about
measurement with none would argue against itself.
