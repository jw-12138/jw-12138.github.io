import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import remarkPluginImage from './src/utils/remark-plugin-image.js';
import remarkPluginText from './src/utils/remark-plugin-text.js';
import remarkPluginLink from './src/utils/remark-plugin-link.js';
import solidJs from "@astrojs/solid-js";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), mdx(), solidJs()],
  site: 'https://jw1.dev',
  markdown: {
    gfm: true,
    remarkPlugins: [remarkPluginImage, remarkPluginText, remarkPluginLink],
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark'
      }
    }
  }
});
