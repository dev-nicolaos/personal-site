import { z, defineCollection } from "astro:content";

const miscellaneousContentCollection = defineCollection({
	type: "content",
});

const siteTechItemsCollection = defineCollection({
	type: "data",
	schema: z.object({
		url: z.string().url(),
	}),
});

export const singleLevelResumeSection = z.array(z.string());
export const dualLevelResumeSection = z.record(
	z.string(),
	singleLevelResumeSection,
);

const resumeSectionsCollection = defineCollection({
	type: "data",
	schema: dualLevelResumeSection.or(singleLevelResumeSection),
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
	miscellaneous: miscellaneousContentCollection,
	"resume-sections": resumeSectionsCollection,
	"site-tech": siteTechItemsCollection,
	thoughts: thoughtsCollection,
};
