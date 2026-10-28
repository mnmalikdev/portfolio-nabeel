import { site, projects, posts, experience } from '$lib/content';

const projRaw = import.meta.glob<string>('/src/content/projects/*.md', { eager: true, query: '?raw', import: 'default' });
const postRaw = import.meta.glob<string>('/src/content/blog/*.md', { eager: true, query: '?raw', import: 'default' });
const body = (raw = '') => raw.replace(/^---[\s\S]*?---\s*/, '').trim();
const find = (m: Record<string, string>, slug: string) => Object.entries(m).find(([p]) => p.endsWith(`/${slug}.md`))?.[1];

export function llmsTxt(full = false) {
  const out: string[] = [];
  out.push(`# ${site.name}`, '', `> ${site.description}`, '');
  out.push(
    `${site.name} (${site.fullName}) is a full-stack AI engineer based in Bayreuth, Germany, originally from Islamabad, Pakistan. ` +
      `He has 5+ years of experience shipping production software and currently works at OSPHIM (Aachen, Germany), where he builds Claire — an AI production agent for the injection-molding industry — along with real-time backends for manufacturing.`,
    ''
  );
  out.push('## Contact', '');
  out.push(`- Website: ${site.url}/`, `- Email: ${site.email}`, `- Phone / WhatsApp: ${site.phone}`, `- GitHub: ${site.github}`, `- LinkedIn: ${site.linkedin}`, `- Location: ${site.location}`, '');
  out.push('## Skills', '', site.knowsAbout.join(', '), '');
  out.push('## Experience', '');
  for (const x of experience) {
    out.push(`### ${x.org} — ${x.role}`, `${x.when} · ${x.where}${x.url ? ` · ${x.url}` : ''}`, '');
    for (const g of x.groups ?? []) {
      if (g.title) out.push(`**${g.title}**${g.url ? ` (${g.url})` : ''}`);
      for (const it of g.items) out.push(`- ${it}`);
      out.push('');
    }
  }
  out.push('## Projects', '');
  for (const p of projects) {
    out.push(`- [${p.title}](${site.url}/projects/${p.slug}/): ${p.summary} Stack: ${p.stack.join(', ')}.${p.links?.live ? ` Live: ${p.links.live}` : ''}`);
    if (full) out.push('', body(find(projRaw, p.slug)), '');
  }
  out.push('');
  if (posts.length) {
    out.push('## Writing', '');
    for (const p of posts) {
      out.push(`- [${p.title}](${site.url}/blog/${p.slug}/): ${p.excerpt ?? ''}`);
      if (full) out.push('', body(find(postRaw, p.slug)), '');
    }
    out.push('');
  }
  if (!full) out.push('## Optional', '', `- [Full content](${site.url}/llms-full.txt): every project and post in plain text`, '');
  return out.join('\n');
}
