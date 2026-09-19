# Reflection - Assignment 2

## The breakthrough

The breakthrough was the same shape as assignment 1's, but it stopped being
one incident and became the thing I was building against. Four pages once
stated four different totals for the number of channels --- the week-10
lecture, its deck, the week-8 Bench, and the home page all disagreed, and
nothing had caught it because nothing compared them. `26b665f` fixed the bug
by deleting it as a category: the count is read from `channel:` frontmatter,
never typed twice.

The sharper version of the lesson showed up inside my own harness.
`3d7f5b3` was meant to catch prose promising something the site doesn't have
--- "the deck," "the readings" --- but its first pass compared every page
against an empty string, so it always passed. A green check I hadn't tried
to break was not evidence, it was a guess with a checkmark on it. The same
pattern hit accessibility: `e3762cc` found four pages with no `<h1>` at all,
because axe scores a missing best-practice as a pass rather than a
violation, and `12b0736` found a focus ring that had only ever been correct
by accident, since nothing had pressed Tab and measured it before.

## What this changed about me as a developer

Assignment 1 taught me to stop trusting a green suite. This one taught me
what to do with that distrust: turn it into a specific, adversarial check
before moving on, rather than a general wariness I carry around and reapply
by hand each time. Every rule in `CLAUDE.md` here exists because something
passed while being wrong, and I now read "the check is green" as a claim
about the check's coverage, not about the work.
