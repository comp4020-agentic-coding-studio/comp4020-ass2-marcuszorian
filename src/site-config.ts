import { defineSiteConfig } from "astro-theme-university/types";
import { slopBranding } from "astro-theme-slop";

// The underlying collection and URL remain `sessions`. Displayed as "Bench":
// the weekly hands-on measurement session, as distinct from the lecture.
export const sessionLabels = {
  singular: "Bench",
  plural: "Benches",
} as const;

export const graphCollections = ["sessions", "assessments", "lectures", "people"];

export const courseApiCollections = [
  ...graphCollections.map((key) => ({ key })),
  { key: "policies", dir: "pages/policies" },
];

export const siteConfig = defineSiteConfig({
  ...slopBranding,
  name: "Slop University",

  links: [
    { text: "Lectures", href: "/lectures/" },
    { text: sessionLabels.plural, href: "/sessions/" },
    { text: "Assessment", href: "/assessments/" },
    { text: "People", href: "/people/" },
    { text: "Policies", href: "/policies/" },
  ],

  // Image-free by decision (see CLAUDE.md): no social card, no hero art, no
  // portraits. Omitting socialImage means pages emit no og:image at all.
  licence: "CC-BY-NC-SA-4.0",
});
