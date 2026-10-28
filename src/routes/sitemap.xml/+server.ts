import { site, projects, posts } from '$lib/content';
export const prerender = true;
export function GET() {
  const urls: [string, string?][] = [['/'], ['/projects/'], ['/blog/'], ...projects.map((p) => [`/projects/${p.slug}/`] as [string]), ...posts.map((p) => [`/blog/${p.slug}/`, p.date] as [string, string])];
  const body = urls.map(([u, d]) => `<url><loc>${site.url}${u}</loc>${d ? `<lastmod>${new Date(d).toISOString().slice(0, 10)}</lastmod>` : ''}</url>`).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</urlset>`, { headers: { 'Content-Type': 'application/xml' } });
}
