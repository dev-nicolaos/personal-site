import { z, defineCollection } from "astro:content";

const thoughtsCollection = defineCollection({
  schema: z.object({
    description: z.string(),
    draft: z.boolean().optional(),
    // use z.string().datetime() when astro ships zod 3.20 or later
    pubDate: z.string(),
    subTitle: z.string().optional(),
    title: z.string(),
  }),
});

export const collections = {
  thoughts: thoughtsCollection,
};
