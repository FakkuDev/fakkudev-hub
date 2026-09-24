import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projectsCollection = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/projects" }),
  schema: z.object({
    slug: z.string(),
    title: z.string(),
    category: z.string(),
    tagline: z.string(),
    url: z.string().url(),
    repo: z.string().url().optional(),
    thumbnail: z.string(), // <-- Volvemos a string simple
    summary: z.array(z.string()),
    features: z.array(z.string()),
    stack: z.array(z.string()),
    hosting: z.string(),
    metrics: z.object({
      performance: z.number().min(0).max(100),
      seo: z.number().min(0).max(100),
      accessibility: z.number().min(0).max(100),
      loadTime: z.string()
    }),
    status: z.enum(["online", "en desarrollo"]),
    order: z.number()
  })
});

export const collections = {
  projects: projectsCollection,
};
