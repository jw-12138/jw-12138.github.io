import {defineConfig} from 'astro/config'
import tailwind from '@astrojs/tailwind'
import mdx from '@astrojs/mdx'
import vue from '@astrojs/vue'

import remarkPluginImage from './src/utils/remark-plugin-image.js'
import remarkPluginText from './src/utils/remark-plugin-text.js'
import remarkPluginLink from './src/utils/remark-plugin-link.js'

export default defineConfig({
  integrations: [tailwind(), mdx(), vue()],
  site: 'https://jw1.dev',
  markdown: {
    gfm: false,
    remarkPlugins: [
      remarkPluginImage,
      remarkPluginText,
      remarkPluginLink
    ],
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark'
      }
    }
  }
})
