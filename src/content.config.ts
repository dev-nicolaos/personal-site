import { z, defineCollection } from "astro:content";
import { file, glob } from "astro/loaders";
import { stripFileExtension } from "./utils";

const entryToId = ({ entry }: { entry: string }) => stripFileExtension(entry);

const linksAndLikesCollection = defineCollection({
	loader: glob({
		base: "src/content/links-and-likes",
		pattern: "*.md",
		generateId: entryToId,
	}),
	schema: z.object({
		url: z.string().url(),
		pubDate: z.string().date(),
		tags: z.array(z.string()),
	}),
});

const siteTechItemsCollection = defineCollection({
	loader: file("src/content/site-tech.json"),
	schema: z.string().url(),
});

export const singleLevelResumeSection = z.array(z.string());
export const dualLevelResumeSection = z.record(
	z.string(),
	singleLevelResumeSection,
);

const resumeSectionsCollection = defineCollection({
	loader: glob({
		base: "src/content/resume-sections",
		pattern: "*.json",
		generateId: entryToId,
	}),
	schema: dualLevelResumeSection.or(singleLevelResumeSection),
});

const thoughtsCollection = defineCollection({
	loader: glob({ base: "src/content/thoughts", pattern: "*.md" }),
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
