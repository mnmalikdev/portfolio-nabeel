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
  phone: '+32 469 12 73 83',
  whatsapp: 'https://wa.me/32469127383',
  location: 'Bayreuth, Germany',
  cv: '/Muhammad-Nabeel-Malik-CV.pdf',
  github: 'https://github.com/mnmalikdev',
  linkedin: 'https://linkedin.com/in/nabeelmalik97',
  fullName: 'Muhammad Nabeel Malik',
  jobTitle: 'Full-stack AI Engineer',
  description: 'Nabeel Malik — full-stack AI engineer in Bayreuth, Germany. Builds LLM agents and real-time backends with Python, FastAPI, NestJS, Kafka and PostgreSQL.',
  ogImage: '/og.jpg',
  knowsAbout: ['LLM agents', 'Agent harnesses', 'Tool calling', 'RAG', 'Python', 'FastAPI', 'SQLAlchemy', 'TypeScript', 'NestJS', 'SvelteKit', 'React', 'PostgreSQL', 'Kafka', 'Redis', 'AWS', 'Azure', 'Industrial IoT', 'Injection molding software']
};

export type Xp = { when: string; org: string; role: string; where: string; url?: string; current?: boolean; steps?: { title: string; when: string }[]; groups?: { title?: string; url?: string; items: string[] }[] };
export const experience: Xp[] = [
    { when: 'Jan 2026 — Now', current: true, org: 'OSPHIM', url: 'https://www.osphim.com/de/info', role: 'Full-stack AI engineer (full-time since Jul 2026; part-time Jan–Jul 2026)', steps: [{ title: 'Full-stack AI engineer', when: 'Jul 2026 — Now · Full-time' }, { title: 'Full-stack engineer', when: 'Jan — Jul 2026 · Part-time' }], where: 'Aachen, DE · Remote', groups: [
      { items: [
        'Built a FastAPI backend and 12 agent tools for Claire, an injection-molding AI assistant on the Claude API: operators log defects, write shift handovers and edit assets from chat, with human confirmation before every write.',
        'Designed the agent harness to report only what it can verify — "detection not configured" instead of a false "no anomaly" — and kept user PII out of model context.',
        'Built evals that test Claire\'s answers against real production questions, catching regressions before each release.',
        'Built the shift-handover module end to end (shift plans with history, crew rostering, chat and voice entries, notifications, images), used across 3 plants and 40+ shifts per week.',
        'Shipped 56 merged PRs in a full-stack TypeScript monorepo (NestJS, SvelteKit 5, PostgreSQL/Drizzle, Redis), owning features from schema to UI, backed by 250+ unit, integration and E2E tests.',
        'Made real-time machine-data views up to 160x faster by moving them from a 1.4-billion-row table to roll-up tables; 30-day dashboards load in 16 ms instead of 1,150 ms.',
        'Part-time phase: rebuilt the production logbook as a real-time feed (WebSockets) linking 5+ entity types, migrated it to JSONB with zero downtime, and extended experiments from single- to multi-cavity molds.'
      ] }
    ] },
    { when: 'May 2024 — Oct 2025', org: 'mobileLIVE', url: 'https://mlarteka.com/', role: 'Software engineer (staff augmentation) · now Mlarteka', where: 'Canada · Remote', groups: [
      { title: 'MonieCorp — fintech product', items: [
        'React + TypeScript + shadcn components: page loads 25% faster, UI bugs down 40% after the refactor.',
        '15+ SOLID admin-panel components; client feedback loop cut from 3 days to 24 hours.',
        'Multi-step form for tiered currency margins: setup from 20+ min to under 4 min per currency pair.',
        'CSP Level 3 with nonce-based whitelisting — blocked 100% of inline-script attempts in pen testing.'
      ] },
      { title: 'Staples Canada', items: [
        'Mixpanel tracking for 100k+ users (views, add-to-cart, checkout) — helped lift conversions 12%.',
        'Built print-product customization end to end with the Canva API — engagement up 20%.',
        'Fixed 30+ production bugs inside 4-hour SLAs, keeping 99.9% uptime through peak sales.'
      ] }
    ] },
    { when: 'Apr 2022 — May 2024', org: 'Code Huddle', role: 'Associate software engineer (Aug 2022–May 2024); product development intern (Apr–Jun 2022)', steps: [{ title: 'Associate software engineer', when: 'Aug 2022 — May 2024' }, { title: 'Product development intern', when: 'Apr — Jun 2022' }], where: 'Islamabad, PK', groups: [
      { title: 'GYMYG — virtual gym partner (US startup)', url: 'https://gymyg.fit/', items: [
        'NestJS REST APIs with JWT RBAC serving 10K DAU at under 200 ms P95.',
        'Stripe monthly subscriptions, $15k+ processed.',
        'Video load times down ~30% with FFmpeg compression and CloudFront edge delivery.',
        'CI/CD with GitHub Actions and AWS CodePipeline — deploys 40% faster.'
      ] },
      { title: 'OrderMe — QR ordering MVP (Italian startup)', url: 'https://orderme.io/', items: [
        'Firebase Auth + Firestore backend handling 100+ daily orders.',
        'shadcn/ui + Tailwind admin panel for menus — owner setup time down 60%.'
      ] }
    ] },
    { when: 'Feb 2018 — Feb 2022', org: 'COMSATS', role: 'Bachelor of Science in Software Engineering', where: 'Islamabad, PK' }
  ];
