import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    dek: z.string().optional(),
    kicker: z.string().optional(),
    tokens: z.string().optional(),
    readTime: z.string().optional(),
    issue: z.string().optional(),
  }),
});

export const collections = { blog };
