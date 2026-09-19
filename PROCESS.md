# Process overview

## What I built

SLOP4979, *Side Channels: What Machines Say Without Meaning To* — twelve weeks
on seven physical channels, image-free, taught as one compounding argument,
assessed 30/30/40, from a single trace to a capstone design review.

## What I decided a good course looks like

The brief's named sites and the handbook entries beside them didn't differ in
production values. Calling Bullshit, How to Make (Almost) Anything and CS 007
each carry one idea throughout; a handbook entry carries a topic list and a
weighting table. Constructive alignment — outcomes,
activities and assessment pointing at the same thing — is the standard answer,
and certifies the parts agree, not that they add up to anything: twelve
aligned weeks can still be twelve encyclopedia entries.

So, in two parts. **A course is one argument, not twelve topics, and the test
of a week is whether deleting it weakens the argument.** And a syllabus that
says only what a week *covers* hides whether it does anything, so every week
must name what a student does. Concept selection was adversarial, not
first-idea: several candidates were weighed against that position before side
channels won, because its weeks compound and "compound" is mechanically
checkable where a looser topic is not —
[`eb10325`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-marcuszorian/commit/eb10325)
pins the decision alongside the register and image-free rules.

## Which of it I encoded

A position not written down gets negotiated away by the twelfth week.
[`19a83c2`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-marcuszorian/commit/19a83c2)
gives every week a `claim:` — one sentence on what it changes about the thesis,
no two alike — rendered in order on `/lectures/`, so the course reads as an
argument, not a grid of cards. The agent defaulted to summarising coverage; a
rule rejecting coverage-shaped claims was cheaper than correcting twelve by
hand.

Then the accounting, where I stopped trusting prose.
[`26b665f`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-marcuszorian/commit/26b665f)
derives the channel count from frontmatter and fails the build on any page that
disagrees — four pages had four different numbers.
[`3d7f5b3`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-marcuszorian/commit/3d7f5b3)
holds prose to the site it describes, after four pages named "Assignment 1",
which is not an assessment. Its first version **passed** its own mutation,
comparing every page against an empty string; a test never seen to fail is not
evidence, so every harness commit since was mutated before landing — surfacing
the same defect a fourth time, in a page claiming "most Benches" where the
data says six of twelve
([`e22b684`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-marcuszorian/commit/e22b684)).

Two rules went unmeasured. The image-free decision had silently
deleted the `<h1>` from four pages — the theme draws a title only beside a hero
image, and axe rates the absence as best-practice
([`e3762cc`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-marcuszorian/commit/e3762cc)).
Assignment 1's focus-styling feedback is answered in the harness, not a
stylesheet:
[`12b0736`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-marcuszorian/commit/12b0736)
drives a browser, presses Tab and measures the ring against the brand token at
both viewports — a rule that had held only by accident.

**The expensive one.** Two Benches ranked channels on axes; by my own test one
had to go, but
[`3bcfa49`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-marcuszorian/commit/3bcfa49)
merges the strong halves instead: week 8 gets a real measurement, a decay fit
read into two windows, and week 10 absorbs the axis comparison as its own
argument.

## Which I left out

Five decks: week 7 is optical on an image-free site; weeks 1 and 9 argue rather
than instruct. No transient-execution week either: it leaks what a program only
*speculated*, a different argument on prerequisites this course never builds,
so weeks 6 and 12 state that boundary as a decision
([`9ca653d`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-marcuszorian/commit/9ca653d)).
The image-free rule took one amendment
([`d5fc35d`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-marcuszorian/commit/d5fc35d)):
inline SVG data figures plotted from numbers in the file, because a course
about measurement that shows none argues against itself.
