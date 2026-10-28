<script lang="ts">
  import { href } from '$lib/link';
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import { magnetic, scrollTo } from '$lib/motion';
  import { site } from '$lib/content';

  let time = $state('--:--');
  onMount(() => {
    const f = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Berlin' });
    const tick = () => (time = f.format(new Date()));
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  });

  const links = [
    { path: '/projects/', label: 'Work' },
    { path: '/blog/', label: 'Writing' }
  ];
  const active = (path: string) => page.url.pathname.startsWith(path);

  // About lives on the home page; Contact is in the footer of every page
  async function toAbout() {
    if (page.url.pathname !== '/') {
      await goto(href('/'));
      setTimeout(() => scrollTo('#about'), 900);
    } else scrollTo('#about');
  }
</script>

<nav>
  <a href={href('/')} class="logo" use:magnetic>NM<sup>©26</sup></a>
  <ul class="mono">
    <li class="home" class:off={page.url.pathname === '/'}><a class="link" href={href('/')}><span>Home</span><span>Home</span></a></li>
    {#each links as l}
      <li><a class="link" class:active={active(l.path)} href={href(l.path)}><span>{l.label}</span><span>{l.label}</span></a></li>
    {/each}
    <li><button class="link mono" onclick={toAbout}><span>About</span><span>About</span></button></li>
    <li><button class="link mono" onclick={() => scrollTo('#contact')}><span>Contact</span><span>Contact</span></button></li>
  </ul>
  <div class="right mono">
    <a class="soc" href={site.github} target="_blank" rel="noopener" aria-label="GitHub">GH ↗</a>
    <a class="soc" href={site.linkedin} target="_blank" rel="noopener" aria-label="LinkedIn">IN ↗</a>
    <div class="status"><i class="pulse"></i><span>BYU {time}</span></div>
  </div>
</nav>

<style>
  nav { position: fixed; top: 0; left: 0; right: 0; z-index: 120; display: flex; justify-content: space-between; align-items: center; padding: 22px var(--pad); mix-blend-mode: difference; color: var(--paper); }
  .logo { font-weight: 700; font-size: 20px; letter-spacing: -0.04em; display: inline-block; }
  .logo sup { font-family: var(--mono); font-size: 9px; font-weight: 400; }
  ul { display: flex; gap: 28px; list-style: none; }
  .link { position: relative; overflow: hidden; display: inline-block; height: 1.4em; }
  button.link { font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; }
  .link span { display: block; transition: transform 0.5s var(--ease); }
  .link span:last-child { position: absolute; top: 100%; left: 0; }
  .link:hover span { transform: translateY(-100%); }
  .link.active::after { content: ''; position: absolute; left: 0; right: 0; bottom: 0; height: 1px; background: currentColor; }
  .right { display: flex; align-items: center; gap: 22px; }
  .soc { opacity: 0.8; transition: opacity 0.3s; } .soc:hover { opacity: 1; }
  .status { display: flex; align-items: center; gap: 8px; }
  .pulse { width: 7px; height: 7px; border-radius: 50%; background: #3dff8a; animation: pulse 2s infinite; }
  @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(61, 255, 138, 0.6); } 70%, 100% { box-shadow: 0 0 0 10px rgba(61, 255, 138, 0); } }
  @media (max-width: 760px) { ul { gap: 14px; } .right { display: none; } .home.off { display: none; } }
</style>
