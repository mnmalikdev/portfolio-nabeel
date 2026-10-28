<script lang="ts">
  import { href } from '$lib/link';
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import { magnetic, scrollTo } from '$lib/motion';
  import { site } from '$lib/content';
  import SocialIcon from '$lib/components/SocialIcon.svelte';

  let time = $state('--:--');
  onMount(() => {
    const f = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Berlin' });
    const tick = () => (time = f.format(new Date()));
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  });

  const links = [
    { path: '/projects/', label: 'Work', key: 'work' as const },
    { path: '/blog/', label: 'Writing', key: 'writing' as const }
  ];
  type Key = 'home' | 'work' | 'writing' | 'about' | 'contact';
  const isHome = $derived(page.url.pathname === '/');
  const pathKey = $derived<Key | null>(page.url.pathname.startsWith('/projects') ? 'work' : page.url.pathname.startsWith('/blog') ? 'writing' : null);

  // scroll-spy: which [data-nav] section sits under a line 40% down the viewport
  let spied = $state<Key | null>(null);
  const activeKey = $derived<Key | null>(spied === 'contact' ? 'contact' : isHome ? spied : pathKey);

  let items: Partial<Record<Key, HTMLElement>> = {};
  let list: HTMLElement;
  let ind = $state({ x: 0, w: 0, on: false });

  function measure() {
    const el = activeKey ? items[activeKey] : null;
    if (!el || !list || el.offsetWidth === 0) { ind = { ...ind, on: false }; return; }
    const a = el.querySelector('.link') as HTMLElement;
    const r = (a ?? el).getBoundingClientRect(), lr = list.getBoundingClientRect();
    ind = { x: r.left - lr.left, w: r.width, on: true };
  }

  onMount(() => {
    let raf = 0;
    const spy = () => {
      raf = 0;
      const probe = innerHeight * 0.4;
      let hit: Key | null = null;
      document.querySelectorAll<HTMLElement>('[data-nav]').forEach((s) => {
        const r = s.getBoundingClientRect();
        if (r.top <= probe && r.bottom > probe) hit = s.dataset.nav as Key;
      });
      spied = hit;
    };
    const queue = () => { if (!raf) raf = requestAnimationFrame(spy); };
    addEventListener('scroll', queue, { passive: true });
    addEventListener('resize', queue);
    spy();
    return () => { removeEventListener('scroll', queue); removeEventListener('resize', queue); cancelAnimationFrame(raf); };
  });

  $effect(() => { activeKey; page.url.pathname; requestAnimationFrame(measure); });
  onMount(() => { const r = () => measure(); addEventListener('resize', r); document.fonts?.ready.then(r); return () => removeEventListener('resize', r); });

  // About lives on the home page; Contact is in the footer of every page
  async function toAbout() {
    if (page.url.pathname !== '/') {
      await goto(href('/'));
      setTimeout(() => scrollTo('#about'), 900);
    } else scrollTo('#about');
  }
</script>

<nav>
  <a href={href('/')} class="logo" use:magnetic>NM</a>
  <ul class="mono" bind:this={list}>
    <li class="home" class:off={isHome} bind:this={items.home}><a class="link" class:active={activeKey === 'home'} href={href('/')} onclick={(e) => { if (isHome) { e.preventDefault(); scrollTo(0); } }}><span>Home</span><span>Home</span></a></li>
    {#each links as l}
      <li bind:this={items[l.key]}><a class="link" class:active={activeKey === l.key} href={href(l.path)}><span>{l.label}</span><span>{l.label}</span></a></li>
    {/each}
    <li bind:this={items.about}><button class="link mono" class:active={activeKey === 'about'} onclick={toAbout}><span>About</span><span>About</span></button></li>
    <li bind:this={items.contact}><button class="link mono" class:active={activeKey === 'contact'} onclick={() => scrollTo('#contact')}><span>Contact</span><span>Contact</span></button></li>
    <i class="ind" class:on={ind.on} style="transform: translateX({ind.x}px); width: {ind.w}px" aria-hidden="true"></i>
  </ul>
  <div class="right mono">
    <a class="soc" href={site.github} target="_blank" rel="noopener" aria-label="GitHub"><SocialIcon name="github" size={16} /></a>
    <a class="soc" href={site.linkedin} target="_blank" rel="noopener" aria-label="LinkedIn"><SocialIcon name="linkedin" size={15} /></a>
    <div class="status"><i class="pulse"></i><span>BYU {time}</span></div>
  </div>
</nav>

<style>
  nav { position: fixed; top: 0; left: 0; right: 0; z-index: 120; display: flex; justify-content: space-between; align-items: center; padding: 22px var(--pad); mix-blend-mode: difference; color: var(--paper); }
  .logo { font-weight: 700; font-size: 20px; letter-spacing: -0.04em; display: inline-block; }
  ul { display: flex; gap: 28px; list-style: none; position: relative; }
  .ind { position: absolute; left: 0; bottom: -7px; height: 1px; background: currentColor; opacity: 0; transition: transform 0.6s var(--ease), width 0.6s var(--ease), opacity 0.3s; pointer-events: none; }
  .ind.on { opacity: 1; }
  .link { transition: opacity 0.4s; }
  ul:has(.ind.on) .link:not(.active) { opacity: 0.55; }
  ul .link:hover { opacity: 1 !important; }
  .link { position: relative; overflow: hidden; display: inline-block; height: 1.4em; }
  button.link { font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; }
  .link span { display: block; transition: transform 0.5s var(--ease); }
  .link span:last-child { position: absolute; top: 100%; left: 0; }
  .link:hover span { transform: translateY(-100%); }
  .right { display: flex; align-items: center; gap: 22px; }
  .soc { display: inline-flex; opacity: 0.8; transition: opacity 0.3s; } .soc:hover { opacity: 1; }
  .status { display: flex; align-items: center; gap: 8px; }
  .pulse { width: 7px; height: 7px; border-radius: 50%; background: #3dff8a; animation: pulse 2s infinite; }
  @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(61, 255, 138, 0.6); } 70%, 100% { box-shadow: 0 0 0 10px rgba(61, 255, 138, 0); } }
  @media (max-width: 760px) { ul { gap: 14px; } .right { display: none; } .home.off { display: none; } }
</style>
