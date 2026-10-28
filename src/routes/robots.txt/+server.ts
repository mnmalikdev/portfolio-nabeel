import { site } from '$lib/content';
export const prerender = true;
// Everyone welcome, AI crawlers included — the point is to be found.
const bots = ['*', 'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Applebot-Extended', 'CCBot'];
export const GET = () =>
  new Response(bots.map((b) => `User-agent: ${b}\nAllow: /\n`).join('\n') + `\nSitemap: ${site.url}/sitemap.xml\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
