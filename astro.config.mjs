import {defineConfig} from 'astro/config'
import tailwind from '@astrojs/tailwind'
import mdx from '@astrojs/mdx'
import vue from '@astrojs/vue'

import remarkPluginImage from './src/utils/remark-plugin-image.js'

export default defineConfig({
  integrations: [tailwind(), mdx(), vue()],
  site: 'https://jw1.dev',
  markdown: {
    remarkPlugins: [
      remarkPluginImage
    ],
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark'
      }
    }
  }
})
