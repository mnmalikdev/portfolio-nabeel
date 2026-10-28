import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
export default defineConfig({
  plugins: [sveltekit()],
  define: { __PREVIEW__: JSON.stringify(process.env.PREVIEW === '1') }
});
