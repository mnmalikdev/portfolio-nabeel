<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import { onNavigate, afterNavigate } from '$app/navigation';
  import Lenis from 'lenis';
  import { gsap, ScrollTrigger, setupGsap, scroll, reduced, intro } from '$lib/motion';
  import Nav from '$lib/components/Nav.svelte';
  import Cursor from '$lib/components/Cursor.svelte';
  import Loader from '$lib/components/Loader.svelte';
  import Contact from '$lib/components/Contact.svelte';
  import { injectAnalytics } from '@vercel/analytics/sveltekit';
  import { dev } from '$app/environment';

  injectAnalytics({ mode: dev ? 'development' : 'production' });

  let { children } = $props();
  let curtain: HTMLDivElement;
  let curtainLabel = $state('');
  let showLoader = $state(false);
  let covering = false;

  onMount(() => {
    setupGsap();
    gsap.set(curtain, { y: 0, yPercent: 100 });
    showLoader = intro.pending;
    requestAnimationFrame(() => delete document.documentElement.dataset.intro);

    if (!reduced()) {
      const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
      scroll.lenis = lenis;
      lenis.on('scroll', ScrollTrigger.update);
      const raf = (t: number) => lenis.raf(t * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
      if (showLoader) lenis.stop();
      return () => { gsap.ticker.remove(raf); lenis.destroy(); scroll.lenis = null; };
    }
  });

  function loaderDone() {
    showLoader = false;
    intro.pending = false;
    scroll.lenis?.start();
    window.dispatchEvent(new CustomEvent('nm:intro'));
    ScrollTrigger.refresh();
  }

  // curtain page transition
  onNavigate((nav) => {
    if (!nav.to || reduced() || nav.to.url.pathname === nav.from?.url.pathname) return;
    const path = nav.to.url.pathname;
    curtainLabel = path === '/' ? 'Home' : path.startsWith('/blog') ? 'Writing' : path.startsWith('/projects') ? 'Work' : '';
    covering = true;
    return new Promise<void>((resolve) => {
      gsap.fromTo(curtain, { yPercent: 100 }, { yPercent: 0, duration: 0.7, ease: 'expo.inOut', onComplete: resolve });
    });
  });

  afterNavigate((nav) => {
    if (nav.type === 'enter') return;
    scroll.lenis?.scrollTo(0, { immediate: true });
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      if (!covering) return;
      covering = false;
      gsap.to(curtain, { yPercent: -100, duration: 0.8, ease: 'expo.inOut', delay: 0.05 });
    });
  });
</script>

<svelte:head>
  <meta name="theme-color" content="#0c0c0b" />
</svelte:head>

<div class="grain" aria-hidden="true"></div>
<Cursor />
{#if showLoader}<Loader ondone={loaderDone} />{/if}
<div class="curtain" bind:this={curtain} aria-hidden="true"><span class="mono">{curtainLabel}</span></div>

<Nav />
<main>
  {@render children()}
</main>
<Contact />

<style>
  .grain { position: fixed; inset: -50%; width: 200%; height: 200%; pointer-events: none; z-index: 200; opacity: 0.07;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    animation: grain 1s steps(6) infinite; }
  @keyframes grain { 0%, 100% { transform: translate(0, 0); } 20% { transform: translate(-4%, 3%); } 40% { transform: translate(3%, -5%); } 60% { transform: translate(-6%, 1%); } 80% { transform: translate(5%, 4%); } }
  .curtain { position: fixed; inset: 0; z-index: 240; background: var(--heat); color: var(--ink); display: grid; place-items: center; transform: translateY(100%); pointer-events: none; }
  .curtain span { font-size: 13px; }
</style>
