import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://eamonn.org',
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
