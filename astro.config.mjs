import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

export default defineConfig({
  site: process.env.SITE_URL ?? 'https://scriobh.netlify.app',
  base: process.env.BASE_PATH ?? '/',
  output: 'static',
  server: { host: true },
  vite: { server: { allowedHosts: ['hostinger.tailbcc5.ts.net'] } },
  integrations: [tailwind(), react()],
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      wrap: true,
    },
  },
});
