import {z, defineCollection} from 'astro:content'
import {glob} from 'astro/loaders';

const posts = defineCollection({
  loader: glob({
    pattern: [
      '*'
    ],
    base: 'src/content/posts'
  }),
  schema: z.object({
    title: z.string(),
    tags: z.array(z.string()).optional(),
    deprecated: z.boolean().optional(),
    draft: z.boolean().optional(),
    date: z.union([
      z.string(),
      z.date()
    ]).optional(),
    updated: z.union([
      z.string(),
      z.date()
    ]).optional(),
    issue: z.number().optional(),
    desc: z.string().optional()
  })
})

export const collections = {
  posts
}
