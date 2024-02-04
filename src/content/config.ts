import { z, defineCollection } from "astro:content";

const siteTechItemsCollection = defineCollection({
	type: "data",
	schema: z.object({
		url: z.string().url(),
	}),
});

const thoughtsCollection = defineCollection({
	type: "content",
	schema: z.object({
		description: z.string(),
		draft: z.boolean().optional(),
		// use z.string().date() for pubDate when astro ships a version of zod with support
		// https://github.com/colinhacks/zod/issues/1676
		pubDate: z.string(),
		subTitle: z.string().optional(),
		title: z.string(),
	}),
});

export const collections = {
	"site-tech": siteTechItemsCollection,
	thoughts: thoughtsCollection,
};
