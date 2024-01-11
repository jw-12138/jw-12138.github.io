import {z, defineCollection} from 'astro:content'

const blogCollection = defineCollection({
  type: 'content', // v2.5.0 and later
  schema: z.object({
    title: z.string(),
    tags: z.array(z.string()).optional(),
    deprecated: z.boolean().optional(),
    draft: z.boolean().optional(),
  })
})

export const collections = {
  'posts': blogCollection
}
