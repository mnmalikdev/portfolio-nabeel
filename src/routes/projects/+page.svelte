<script lang="ts">
  import { href } from '$lib/link';
  import { onMount } from 'svelte';
  import { projects, allTags } from '$lib/content';
  import { gsap, chars, reveal } from '$lib/motion';
  import ProjectArt from '$lib/components/ProjectArt.svelte';

  const tags = allTags(projects);
  let active = $state('All');
  const list = $derived(active === 'All' ? projects : projects.filter((p) => p.tags.includes(active)));

  let hovered = $state(-1);
  let preview: HTMLDivElement;

  onMount(() => {
    if (matchMedia('(hover: none)').matches) return;
    const xTo = gsap.quickTo(preview, 'x', { duration: 0.6, ease: 'power3' });
    const yTo = gsap.quickTo(preview, 'y', { duration: 0.6, ease: 'power3' });
    const rTo = gsap.quickTo(preview, 'rotation', { duration: 0.8, ease: 'power3' });
    let lastX = 0;
    const move = (e: PointerEvent) => { xTo(e.clientX); yTo(e.clientY); rTo(gsap.utils.clamp(-10, 10, (e.clientX - lastX) * 0.4)); lastX = e.clientX; };
    addEventListener('pointermove', move);
    return () => removeEventListener('pointermove', move);
  });

  function pick(t: string) {
    active = t;
    requestAnimationFrame(() => gsap.from('.rows li', { y: 30, autoAlpha: 0, stagger: 0.05, duration: 0.7, ease: 'power3.out' }));
  }
</script>

<svelte:head>
  <title>Work — Nabeel Malik</title>
  <meta name="description" content="Selected projects by Nabeel Malik: real-time industrial software, data pipelines, and web apps." />
</svelte:head>

<header class="page-head">
  <h1 use:chars>Work<span class="serif">.</span></h1>
  <div class="sub" use:reveal={{ y: 30, delay: 0.5, children: true }}>
    <p>Industrial SaaS, real-time pipelines and the odd side quest. Much of it sits behind NDAs, so the write-ups focus on the problems and the architecture.</p>
    <div class="filters">
      {#each ['All', ...tags] as t}
        <button class:on={active === t} onclick={() => pick(t)}>{t}<sup>{t === 'All' ? projects.length : projects.filter((p) => p.tags.includes(t)).length}</sup></button>
      {/each}
    </div>
  </div>
</header>

<section class="list">
  <div class="head mono muted"><span>#</span><span>Project</span><span>Role</span><span>Year</span></div>
  <ul class="rows" onpointerleave={() => (hovered = -1)}>
    {#each list as p, i (p.slug)}
      <li>
        <a href={href(`/projects/${p.slug}/`)} data-cursor="Open" onpointerenter={() => (hovered = projects.indexOf(p))}>
          <span class="mono muted">{String(i + 1).padStart(2, '0')}</span>
          <span class="t">{p.title}</span>
          <span class="role">{p.role}{#if p.client}&nbsp;· {p.client}{/if}</span>
          <span class="mono yr">{p.year}</span>
          <span class="mobile-art"><ProjectArt art={p.art} seed={p.slug} cover={p.cover} /></span>
        </a>
      </li>
    {/each}
  </ul>
</section>

<div class="preview" bind:this={preview} class:on={hovered > -1} aria-hidden="true">
  {#each projects as p, i}
    <div class="frame" class:show={hovered === i}><ProjectArt art={p.art} seed={p.slug} cover={p.cover} /></div>
  {/each}
</div>

<style>
  .list { padding-top: 60px; }
  .head, .rows a { display: grid; grid-template-columns: 70px 1.6fr 1fr 80px; gap: 20px; align-items: baseline; }
  .head { padding-bottom: 16px; border-bottom: 1px solid var(--line); }
  .head > :last-child, .yr { text-align: right; }
  .rows { list-style: none; }
  .rows a { position: relative; padding: 34px 0; border-bottom: 1px solid var(--line); transition: padding 0.6s var(--ease), color 0.3s; }
  .rows a:hover { padding-left: 20px; }
  .rows:hover a:not(:hover) { color: rgba(236, 235, 228, 0.3); }
  .t { font-size: clamp(30px, 4.4vw, 72px); letter-spacing: -0.05em; line-height: 0.95; font-weight: 600; }
  .role { color: var(--mute); }
  .mobile-art { display: none; }

  .preview { position: fixed; top: 0; left: 0; width: 380px; aspect-ratio: 4/3; margin: -142px 0 0 -190px; pointer-events: none; z-index: 50; border-radius: 6px; overflow: hidden;
    transform: scale(0); transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1); }
  .preview.on { transform: scale(1); }
  .frame { position: absolute; inset: 0; opacity: 0; transition: opacity 0.35s; }
  .frame.show { opacity: 1; }

  @media (hover: none), (max-width: 760px) {
    .preview { display: none; }
    .head { display: none; }
    .rows a { grid-template-columns: 1fr; gap: 8px; }
    .yr { text-align: left; }
    .mobile-art { display: block; position: relative; aspect-ratio: 4/3; border-radius: 6px; overflow: hidden; margin-top: 12px; }
  }
</style>
