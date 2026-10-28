import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex, escapeSvelte } from 'mdsvex';
import { createHighlighter } from 'shiki';

const PREVIEW = process.env.PREVIEW === '1';
const LANGS = ['ts', 'js', 'svelte', 'bash', 'sql', 'json', 'python', 'yaml', 'dockerfile', 'hcl', 'md'];
const shiki = await createHighlighter({ themes: ['vesper'], langs: LANGS });

/** @type {import('@sveltejs/kit').Config} */
export default {
  extensions: ['.svelte', '.md'],
  preprocess: [
    vitePreprocess(),
    mdsvex({
      extensions: ['.md'],
      highlight: {
        highlighter: async (code, lang = 'text') => {
          const l = shiki.getLoadedLanguages().includes(lang) ? lang : 'text';
          const html = escapeSvelte(shiki.codeToHtml(code, { lang: l, theme: 'vesper' }));
          return `{@html \`${html}\` }`;
        }
      }
    })
  ],
  kit: {
    adapter: adapter(PREVIEW ? { fallback: 'index.html' } : undefined),
    appDir: 'app',
    paths: { relative: true },
    router: { type: PREVIEW ? 'hash' : 'pathname' }
  }
};
