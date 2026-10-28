<script lang="ts">
  import { href } from '$lib/link';
  import { onMount } from 'svelte';
  import Seo from '$lib/components/Seo.svelte';
  import { fmtDate, site } from '$lib/content';
  import { chars, reveal } from '$lib/motion';

  let { data } = $props();
  const p = $derived(data.meta);

  let bar: HTMLElement;
  onMount(() => {
    const update = () => {
      const h = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = `scaleX(${h > 0 ? Math.min(1, scrollY / h) : 0})`;
    };
    addEventListener('scroll', update, { passive: true });
    update();
    return () => removeEventListener('scroll', update);
  });
</script>

<Seo title={`${p.title} — Nabeel Malik`} description={p.excerpt} path={`/blog/${p.slug}/`} type="article" published={p.date} jsonld={[{ '@context': 'https://schema.org', '@type': 'BlogPosting', headline: p.title, description: p.excerpt, datePublished: p.date, keywords: p.tags.join(', '), url: `${site.url}/blog/${p.slug}/`, author: { '@type': 'Person', name: site.name, url: site.url + '/' } }]} />

<div class="progress" bind:this={bar}></div>

{#key p.slug}
  <article>
    <header class="head">
      <a href={href(`/blog/`)} class="mono back">← All writing</a>
      <div class="meta mono muted" use:reveal={{ y: 20, children: true }}>
        <span>{fmtDate(p.date)}</span><span>·</span><span>{p.readingTime} min read</span>
        {#each p.tags as t}<span class="tag">{t}</span>{/each}
      </div>
      <h1 use:chars>{p.title}</h1>
      {#if p.excerpt}<p class="lede" use:reveal={{ y: 30, delay: 0.5 }}>{p.excerpt}</p>{/if}
    </header>

    <div class="body">
      <div class="prose" use:reveal={{ y: 40, delay: 0.3 }}>
        <data.component />
      </div>
    </div>

    <nav class="pager">
      {#if data.older}
        <a href={href(`/blog/${data.older.slug}/`)} data-cursor="Read"><span class="mono muted">← Older</span><span class="pt">{data.older.title}</span></a>
      {:else}<span></span>{/if}
      {#if data.newer}
        <a class="r" href={href(`/blog/${data.newer.slug}/`)} data-cursor="Read"><span class="mono muted">Newer →</span><span class="pt">{data.newer.title}</span></a>
      {/if}
    </nav>
  </article>
{/key}

<style>
  .progress { position: fixed; top: 0; left: 0; right: 0; height: 3px; background: var(--heat); transform-origin: left; transform: scaleX(0); z-index: 130; }
  .head { padding: 160px var(--pad) 40px; max-width: 1200px; margin: 0 auto; }
  .back { display: inline-block; margin-bottom: 40px; color: var(--mute); transition: color 0.3s, transform 0.4s var(--ease); }
  .back:hover { color: var(--heat); transform: translateX(-6px); }
  .meta { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 26px; }
  .tag { border: 1px solid var(--line); border-radius: 99px; padding: 2px 9px; }
  h1 { font-size: clamp(44px, 7vw, 120px); line-height: 0.92; letter-spacing: -0.055em; font-weight: 700; overflow: hidden; padding-bottom: 0.06em; }
  .lede { font-family: var(--serif); font-style: italic; font-size: clamp(24px, 2.4vw, 36px); line-height: 1.2; color: rgba(236, 235, 228, 0.8); margin-top: 30px; max-width: 820px; }
  .body { padding: 40px var(--pad) 120px; max-width: 1200px; margin: 0 auto; border-top: 1px solid var(--line); }
  .body .prose { margin: 50px auto 0; }
  .pager { display: grid; grid-template-columns: 1fr 1fr; border-top: 1px solid var(--line); }
  .pager a { display: grid; gap: 12px; padding: 60px var(--pad); transition: background 0.5s, color 0.5s; }
  .pager a:hover { background: var(--heat); color: var(--ink); }
  .pager a:hover .muted { color: var(--ink); }
  .pager .r { text-align: right; border-left: 1px solid var(--line); }
  .pt { font-size: clamp(22px, 2.4vw, 38px); letter-spacing: -0.035em; line-height: 1.05; font-weight: 600; }
  @media (max-width: 760px) { .pager { grid-template-columns: 1fr; } .pager .r { border-left: 0; border-top: 1px solid var(--line); } }
</style>
