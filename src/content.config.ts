import { defineCollection, reference } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { courseNodeSchema } from "astro-course-university/schemas";

const weekSchema = z.coerce.number().int().min(1).max(12);

// The physical channels this course actually measures, one per week from 2 to
// 8. A week that introduces no new channel --- the opening, the colocation
// precondition, the two synthesis weeks, the defence week --- declares
// "none". The count of distinct non-"none" values is the course's channel
// count, and prose is not allowed to disagree with it (spec/argument-chain).
const channelSchema = z.enum([
  "acoustic",
  "power",
  "timing",
  "electromagnetic",
  "cache",
  "optical",
  "thermal",
  "none",
]);

// The leakage taxonomy, declared as data on the week that introduces it so
// the page renders it, the deck restates it, and the axis count is derived
// rather than written down twice.
const axisSchema = z.object({
  name: z.string().trim().min(1),
  question: z.string().trim().min(20),
});
// A primary source, declared as data rather than named in passing prose, so
// the lecture page and the course-wide bibliography render from one record.
// `url` is optional because a book need not have one; everything else is
// required, because a citation without a venue or a year is not a citation.
const readingSchema = z.object({
  authors: z.string().trim().min(3),
  year: z.number().int().min(1940).max(2030),
  title: z.string().trim().min(5),
  venue: z.string().trim().min(2),
  url: z.url().optional(),
});

const courseNodeLoader = (dir: string) =>
  glob({ pattern: ["**/*.{md,mdx}", "!**/CLAUDE.md"], base: `src/content/${dir}` });
const teacherRefs = z.array(reference("people")).min(1);

const weightedMarking = z
  .object({
    mode: z.literal("weighted"),
    criteria: z
      .array(z.object({ name: z.string().trim().min(1), weight: z.number().positive() }))
      .min(1),
  })
  .superRefine((marking, ctx) => {
    const total = marking.criteria.reduce((sum, criterion) => sum + criterion.weight, 0);
    if (total !== 100) {
      ctx.addIssue({
        code: "custom",
        path: ["criteria"],
        message: `criterion weights sum to ${total}, not 100`,
      });
    }
  });

const holisticMarking = z.object({
  mode: z.literal("holistic"),
  description: z.string().trim().min(40),
});

export const collections = {
  sessions: defineCollection({
    loader: courseNodeLoader("sessions"),
    schema: courseNodeSchema
      .extend({
        week: weekSchema,
        date: z.coerce.date(),
        teachers: teacherRefs.optional(),
      })
      .loose(),
  }),

  assessments: defineCollection({
    loader: courseNodeLoader("assessments"),
    schema: courseNodeSchema
      .extend({
        week: weekSchema,
        due: z.coerce.date(),
        weight: z.coerce.number().positive().max(100),
        marking: z.discriminatedUnion("mode", [weightedMarking, holisticMarking]).optional(),
      })
      .loose(),
  }),

  lectures: defineCollection({
    loader: courseNodeLoader("lectures"),
    schema: courseNodeSchema
      .extend({
        week: weekSchema,
        date: z.coerce.date(),
        teachers: teacherRefs.optional(),
        // One sentence naming what this week changes about the course's
        // thesis --- not what it covers. Twelve of these, read in order on
        // /lectures/, are the course's argument.
        claim: z.string().trim().min(60).max(220),
        channel: channelSchema,
        axes: z.array(axisSchema).min(2).optional(),
        // Required, not optional: a week with nothing to read is a week
        // arguing from its own assertion.
        readings: z.array(readingSchema).min(1),
        slides: z
          .string()
          .regex(/^\/decks\/[a-z0-9-]+\/$/)
          .optional(),
      })
      .loose(),
  }),

  people: defineCollection({
    loader: courseNodeLoader("people"),
    schema: ({ image }) =>
      z
        .object({
          title: z.string().trim().min(1),
          description: z.string().trim().min(40),
          role: z.string().trim().min(1),
          contact: z.string().trim().min(1).optional(),
          affiliation: z.string().trim().min(1).optional(),
          email: z.email().optional(),
          url: z.url().optional(),
          photo: image().optional(),
          photoAlt: z.string().trim().optional(),
          published: z.coerce.boolean().default(true),
        })
        .superRefine((person, ctx) => {
          if (person.photo && !person.photoAlt) {
            ctx.addIssue({
              code: "custom",
              path: ["photoAlt"],
              message: "describe the photo when one is supplied",
            });
          }
        }),
  }),
};
