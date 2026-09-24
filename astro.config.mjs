import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://fakkudev.com',
  integrations: [sitemap()],
  vite: {
    build: {
      cssMinify: true,
    }
  }
});
