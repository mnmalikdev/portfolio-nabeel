import type { Component } from 'svelte';

/* ------------------------------------------------------------------
   Content collections. Every .md file in src/content/{blog,projects}
   becomes a page. Frontmatter = metadata, body = page content.
   Add a file, git push, done.
------------------------------------------------------------------- */

export type Post = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  draft?: boolean;
  readingTime: number;
};

export type Project = {
  slug: string;
  title: string;
  summary: string;
  year: string;
  role: string;
  client?: string;
  tags: string[];
  stack: string[];
  art?: 'log' | 'voice' | 'cavity' | 'agents' | 'gym' | 'grid';
  cover?: string; // optional image path in /static, e.g. /images/foo.jpg
  order?: number;
  featured?: boolean;
  nda?: boolean;
  links?: { live?: string; repo?: string };
  draft?: boolean;
};

type Mod<T> = { metadata: T; default: Component };

const postMods = import.meta.glob<Mod<Omit<Post, 'slug' | 'readingTime'>>>('/src/content/blog/*.md', { eager: true });
const postRaw = import.meta.glob<string>('/src/content/blog/*.md', { eager: true, query: '?raw', import: 'default' });
const projectMods = import.meta.glob<Mod<Omit<Project, 'slug'>>>('/src/content/projects/*.md', { eager: true });

const slugOf = (path: string) => path.split('/').pop()!.replace(/\.md$/, '');
const showDrafts = import.meta.env.DEV;

const words = (raw: string) => raw.replace(/^---[\s\S]*?---/, '').replace(/```[\s\S]*?```/g, '').split(/\s+/).filter(Boolean).length;

export const posts: Post[] = Object.entries(postMods)
  .map(([path, mod]) => ({
    ...mod.metadata,
    tags: mod.metadata.tags ?? [],
    slug: slugOf(path),
    readingTime: Math.max(1, Math.round(words(postRaw[path] ?? '') / 220))
  }))
  .filter((p) => !p.slug.startsWith('_') && (showDrafts || !p.draft))
  .sort((a, b) => +new Date(b.date) - +new Date(a.date));

export const projects: Project[] = Object.entries(projectMods)
  .map(([path, mod]) => ({ ...mod.metadata, tags: mod.metadata.tags ?? [], stack: mod.metadata.stack ?? [], slug: slugOf(path) }))
  .filter((p) => !p.slug.startsWith('_') && (showDrafts || !p.draft))
  .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));

export const getPost = (slug: string) => {
  const entry = Object.entries(postMods).find(([p]) => slugOf(p) === slug);
  const meta = posts.find((p) => p.slug === slug);
  return entry && meta ? { meta, component: entry[1].default } : null;
};

export const getProject = (slug: string) => {
  const entry = Object.entries(projectMods).find(([p]) => slugOf(p) === slug);
  const meta = projects.find((p) => p.slug === slug);
  return entry && meta ? { meta, component: entry[1].default } : null;
};

export const allTags = (items: { tags: string[] }[]) => [...new Set(items.flatMap((i) => i.tags))].sort();

export const fmtDate = (d: string, opts: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' }) =>
  new Date(d).toLocaleDateString('en-GB', opts);

export const site = {
  name: 'Nabeel Malik',
  url: 'https://portfolio-nabeel-malik.vercel.app',
  email: 'mnmalikdev@gmail.com',
  github: 'https://github.com/mnmalikdev',
  linkedin: 'https://linkedin.com/in/nabeelmalik97',
  description: 'Full-stack engineer building real-time software for factory floors. Based in Bayreuth, Germany.'
};
