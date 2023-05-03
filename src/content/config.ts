import { z, defineCollection } from "astro:content";

const thoughtsCollection = defineCollection({
  schema: z.object({
    description: z.string(),
    draft: z.boolean().optional(),
    pubDate: z.string().datetime(),
    subTitle: z.string().optional(),
    title: z.string(),
  }),
});

export const collections = {
  thoughts: thoughtsCollection,
};
