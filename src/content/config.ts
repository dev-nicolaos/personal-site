import { z, defineCollection } from "astro:content";

const linksAndLikesCollection = defineCollection({
	type: "content",
	schema: z.object({
		url: z.string().url(),
		pubDate: z.string().date(),
		tags: z.array(z.string()),
	}),
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
		pubDate: z.string().date(),
		subTitle: z.string().optional(),
		title: z.string(),
	}),
});

export const collections = {
	"links-and-likes": linksAndLikesCollection,
	"resume-sections": resumeSectionsCollection,
	"site-tech": siteTechItemsCollection,
	thoughts: thoughtsCollection,
};
