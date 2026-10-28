<script lang="ts">
  import Seo from '$lib/components/Seo.svelte';
  import { href } from '$lib/link';
  import { posts, allTags, fmtDate } from '$lib/content';
  import { gsap, chars, reveal } from '$lib/motion';

  const tags = allTags(posts);
  let active = $state('All');
  const list = $derived(active === 'All' ? posts : posts.filter((p) => p.tags.includes(active)));

  const byYear = $derived(
    list.reduce<Record<string, typeof posts>>((acc, p) => {
      const y = new Date(p.date).getFullYear().toString();
      (acc[y] ??= []).push(p);
      return acc;
    }, {})
  );
  const years = $derived(Object.keys(byYear).sort((a, b) => +b - +a));

  function pick(t: string) {
    active = t;
    requestAnimationFrame(() => gsap.from('.post', { y: 30, autoAlpha: 0, stagger: 0.05, duration: 0.7, ease: 'power3.out' }));
  }
</script>

<Seo title="Writing — Nabeel Malik" description="Notes by Nabeel Malik on AI engineering, LLM agents, event-driven backends and real-time systems." path="/blog/" />

<header class="page-head">
  <h1 use:chars>Writ<span class="serif">ing</span></h1>
  <div class="sub" use:reveal={{ y: 30, delay: 0.5, children: true }}>
    <p>Notes on event-driven backends, data modelling, infra, and whatever else I learn the hard way.</p>
    {#if tags.length}
      <div class="filters">
        {#each ['All', ...tags] as t}
          <button class:on={active === t} onclick={() => pick(t)}>{t}</button>
        {/each}
      </div>
    {/if}
  </div>
</header>

<section class="list">
  {#if !posts.length}
    <p class="empty serif">First post loading… (any day now.)</p>
  {/if}
  {#each years as y (y)}
    <div class="year">
      <h2 class="y">{y}</h2>
      <ul>
        {#each byYear[y] as p (p.slug)}
          <li class="post">
            <a href={href(`/blog/${p.slug}/`)} data-cursor="Read">
              <span class="mono muted">{fmtDate(p.date, { day: '2-digit', month: 'short' })}</span>
              <span class="main">
                <span class="t">{p.title}</span>
                <span class="ex">{p.excerpt}</span>
                {#if p.tags.length}<span class="chips">{#each p.tags as t}<span>{t}</span>{/each}</span>{/if}
              </span>
              <span class="mono muted rt">{p.readingTime} min read</span>
            </a>
          </li>
        {/each}
      </ul>
    </div>
  {/each}
</section>

<style>
  .list { padding-top: 70px; }
  .empty { font-size: 32px; color: var(--mute); }
  .year { display: grid; grid-template-columns: 1fr 3fr; gap: 4vw; border-top: 1px solid var(--line); padding-top: 26px; margin-bottom: 70px; }
  .y { font-size: clamp(48px, 6vw, 100px); letter-spacing: -0.06em; font-weight: 700; line-height: 0.9; position: sticky; top: 100px; align-self: start; color: var(--heat); }
  ul { list-style: none; }
  a { display: grid; grid-template-columns: 90px 1fr 110px; gap: 20px; align-items: baseline; padding: 0 0 34px; margin-bottom: 34px; border-bottom: 1px solid var(--line); transition: transform 0.6s var(--ease); }
  li:last-child a { border-bottom: 0; }
  a:hover { transform: translateX(14px); }
  .main { display: grid; gap: 12px; }
  .t { font-size: clamp(26px, 3vw, 48px); letter-spacing: -0.04em; line-height: 1; font-weight: 600; transition: color 0.3s; }
  a:hover .t { color: var(--heat); }
  .ex { color: rgba(236, 235, 228, 0.7); max-width: 620px; }
  .chips { color: var(--mute); }
  .rt { text-align: right; }
  @media (max-width: 760px) { .year { grid-template-columns: 1fr; } .y { position: static; } a { grid-template-columns: 1fr; gap: 8px; } .rt { text-align: left; } }
</style>
