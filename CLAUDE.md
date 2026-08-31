# Your harness

Nothing about the starter is recorded here. The platform under you is fixed and
documented in `README.md`, and the
[course website](https://comp.anu.edu.au/courses/comp4020-agentic-coding-studio/)
publishes this deliverable's brief and spec. Read both before you plan or build;
what the agent needs to carry from either is your call.

## How to work in here

- Keep the dev server running (`pnpm dev`) so you see changes as you make them.
- Run `pnpm check` before you push.
- Open pages in a browser and look at them, at both marking viewports. Markers
  read this site the way a prospective student would, across a dozen pages ---
  a check that passes on parsed HTML says nothing about whether the pages hang
  together as a course.
- When a check fails, read its output before you change anything.
- Never commit a red state.

## Test the contract, not the implementation

A test that hardcodes a specific piece of content or wording breaks the moment
you rewrite that page, and a suite you've learned to ignore is worse than no
suite. Assert what must stay true regardless of exact wording --- a page exists
and links from the nav, an assessment's weights sum to 100, a lecture links a
real deck --- so the tests survive further passes over the content.

## CI runs nothing while the repo is private

Both jobs in `.github/workflows/checks.yml` are gated on
`!github.event.repository.private`, so between the first commit and the
visibility flip at ship time, **every push is unobserved**. Nothing is broken;
it is deliberate, and it means local `pnpm check` and `pnpm check:evidence` are
the only backpressure that exists for the whole build.

The consequence to plan around: the first public push is the first time the
link checker, the secret scan and the evidence gate have ever run against this
repo --- and that push happens at the cutoff, when there is no time left to fix
what they find. Run both locally, early, and don't let the flip be the first
time they're exercised.

## This file is yours

A starting point, not a rulebook: what you add to it is the harness, and the
harness is assessed. Carried forward from comp4020-crit5 (A game), trimmed to
the rules that generalize --- the canvas/WebAudio/screenshot-sensor rules from
that repo's game template didn't carry, since nothing here matches them.
