<script lang="ts">
  import { onMount } from 'svelte';
  import { gsap } from '$lib/motion';

  let { ondone }: { ondone: () => void } = $props();
  let el: HTMLDivElement;
  let count = $state(0);

  onMount(() => {
    const o = { v: 0 };
    const tl = gsap.timeline({ onComplete: ondone });
    tl.to(o, { v: 100, duration: 1.7, ease: 'power2.inOut', onUpdate: () => (count = Math.round(o.v)) })
      .to(el.querySelectorAll('.row, .bar'), { yPercent: -60, autoAlpha: 0, duration: 0.5, ease: 'power3.in', stagger: 0.04 }, '+=.1')
      .to(el.querySelectorAll('.slats i'), { scaleY: 0, duration: 0.9, ease: 'expo.inOut', stagger: { each: 0.06, from: 'end' } }, '-=.2');
    return () => tl.kill();
  });
</script>

<div class="loader" bind:this={el} aria-hidden="true">
  <div class="slats">{#each Array(7) as _}<i></i>{/each}</div>
  <div class="row mono"><span>Nabeel Malik</span><span>Portfolio — {new Date().getFullYear()}</span></div>
  <div>
    <div class="row end"><span class="mono">Warming up the mold…</span><span class="count">{count}</span></div>
    <div class="bar"><i style="width:{count}%"></i></div>
  </div>
</div>

<style>
  .loader { position: fixed; inset: 0; z-index: 250; color: var(--ink); display: flex; flex-direction: column; justify-content: space-between; padding: var(--pad); isolation: isolate; }
  .slats { position: absolute; inset: 0; z-index: -1; display: flex; flex-direction: column; }
  .slats i { flex: 1; background: var(--paper); margin-bottom: -1px; transform-origin: 50% 0; }
  .row { display: flex; justify-content: space-between; }
  .end { align-items: flex-end; }
  .count { font-size: clamp(90px, 22vw, 340px); font-weight: 700; letter-spacing: -0.06em; line-height: 0.8; font-variant-numeric: tabular-nums; }
  .bar { height: 2px; background: rgba(12, 12, 11, 0.15); margin-top: 20px; overflow: hidden; }
  .bar i { display: block; height: 100%; background: var(--heat); }
</style>
