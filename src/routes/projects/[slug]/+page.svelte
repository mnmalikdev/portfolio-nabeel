<script lang="ts">
  import { site } from '$lib/content';
  import Seo from '$lib/components/Seo.svelte';
  import { href } from '$lib/link';
  import { gsap, setupGsap, reduced, chars, reveal, lines } from '$lib/motion';
  import ProjectArt from '$lib/components/ProjectArt.svelte';

  let { data } = $props();
  const p = $derived(data.meta);
  function heroArt(node: HTMLElement) {
    if (reduced()) return;
    setupGsap();
    const ctx = gsap.context(() => {
      gsap.from(node, { clipPath: 'inset(20% 10% 20% 10% round 6px)', duration: 1.6, ease: 'expo.inOut', delay: 0.3 });
      gsap.to(node.querySelector('.inner'), { yPercent: 12, ease: 'none', scrollTrigger: { trigger: node, start: 'top top', end: 'bottom top', scrub: true } });
    });
    return { destroy: () => ctx.revert() };
  }
</script>

<Seo title={`${p.title} — Nabeel Malik`} description={p.summary} path={`/projects/${p.slug}/`} type="article" jsonld={[{ '@context': 'https://schema.org', '@type': 'CreativeWork', name: p.title, description: p.summary, dateCreated: p.year, keywords: p.stack.join(', '), url: `${site.url}/projects/${p.slug}/`, creator: { '@type': 'Person', name: site.name, url: site.url + '/' } }]} />

{#key p.slug}
  <article>
    <header class="head">
      <a href={href(`/projects/`)} class="mono back">← All work</a>
      <h1 use:chars>{p.title}</h1>
      <p class="summary" use:reveal={{ y: 30, delay: 0.5 }}>{p.summary}</p>
      <dl class="facts" use:reveal={{ y: 30, delay: 0.6, children: true }}>
        <div><dt class="mono">Role</dt><dd>{p.role}</dd></div>
        {#if p.client}<div><dt class="mono">Context</dt><dd>{p.client}</dd></div>{/if}
        <div><dt class="mono">Year</dt><dd>{p.year}</dd></div>
        <div><dt class="mono">Stack</dt><dd class="chips">{#each p.stack as s}<span>{s}</span>{/each}</dd></div>
        {#if p.links?.live || p.links?.repo || p.nda}
          <div><dt class="mono">Links</dt><dd class="links">
            {#if p.links?.live}<a href={p.links.live} target="_blank" rel="noopener">Live ↗</a>{/if}
            {#if p.links?.repo}<a href={p.links.repo} target="_blank" rel="noopener">Code ↗</a>{/if}
            {#if p.nda && !p.links?.live && !p.links?.repo}<span class="muted">Under NDA</span>{/if}
          </dd></div>
        {/if}
      </dl>
    </header>

    <div class="hero-art" use:heroArt>
      <div class="inner"><ProjectArt art={p.art} seed={p.slug} cover={p.cover} /></div>
    </div>

    <div class="body">
      <aside class="mono muted">Case study</aside>
      <div class="prose" use:reveal={{ y: 40 }}>
        <data.component />
      </div>
    </div>

    <a class="next" href={href(`/projects/${data.next.slug}/`)} data-cursor="Next">
      <span class="mono muted">Next project</span>
      <span class="nt" use:lines><span class="ln"><span>{data.next.title}</span></span></span>
    </a>
  </article>
{/key}

<style>
  .head { padding: 160px var(--pad) 60px; }
  .back { display: inline-block; margin-bottom: 40px; color: var(--mute); transition: color 0.3s, transform 0.4s var(--ease); }
  .back:hover { color: var(--heat); transform: translateX(-6px); }
  h1 { font-size: clamp(52px, 9vw, 160px); line-height: 0.88; letter-spacing: -0.06em; font-weight: 700; max-width: 14ch; overflow: hidden; padding-bottom: 0.06em; }
  .summary { font-size: clamp(20px, 2vw, 30px); line-height: 1.25; letter-spacing: -0.02em; max-width: 760px; margin-top: 36px; color: rgba(236, 235, 228, 0.85); }
  .facts { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 24px; margin-top: 60px; border-top: 1px solid var(--line); padding-top: 24px; }
  dt { color: var(--mute); margin-bottom: 8px; }
  dd { font-size: 17px; }
  .links { display: flex; gap: 18px; }
  .links a { color: var(--heat); }
  .hero-art { position: relative; margin: 0 var(--pad); height: 80vh; border-radius: 6px; overflow: hidden; clip-path: inset(0 0 0 0 round 6px); }
  .inner { position: absolute; inset: -8% 0; }
  .body { display: grid; grid-template-columns: 1fr 2fr; gap: 6vw; padding: clamp(80px, 10vw, 160px) var(--pad); }
  aside { position: sticky; top: 110px; align-self: start; }
  .next { display: block; padding: clamp(80px, 10vw, 160px) var(--pad); border-top: 1px solid var(--line); transition: color 0.4s; }
  .next:hover { color: var(--heat); }
  .nt { display: block; font-size: clamp(48px, 9vw, 160px); line-height: 0.9; letter-spacing: -0.06em; font-weight: 700; margin-top: 18px; }
  @media (max-width: 860px) { .body { grid-template-columns: 1fr; } aside { position: static; } .hero-art { height: 50vh; } }
</style>
