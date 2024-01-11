import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import vue from "@astrojs/vue";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), mdx(), vue()],
  site: "https://jw1.dev",
  markdown: {
    shikiConfig: {
      experimentalThemes: {
        light: 'github-light',
        dark: 'github-dark'
      }
    }
  }
});
