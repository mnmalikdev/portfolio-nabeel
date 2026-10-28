<script lang="ts">
  import { onMount } from 'svelte';
  import { gsap, ScrollTrigger, setupGsap, reduced } from '$lib/motion';

  let { words }: { words: string[] } = $props();
  let track: HTMLDivElement;

  onMount(() => {
    if (reduced()) return;
    setupGsap();
    let x = 0, vel = 0;
    const st = ScrollTrigger.create({ onUpdate: (s) => (vel = s.getVelocity() / 250) });
    const tick = () => {
      const half = track.scrollWidth / 2;
      x -= 1.1 + Math.abs(vel); vel *= 0.92;
      if (x <= -half) x += half;
      track.style.transform = `translateX(${x}px) skewX(${gsap.utils.clamp(-12, 12, -vel * 1.5)}deg)`;
    };
    gsap.ticker.add(tick);
    return () => { gsap.ticker.remove(tick); st.kill(); };
  });
</script>

<div class="marquee" aria-hidden="true">
  <div class="track" bind:this={track}>
    {#each [0, 1] as _}
      {#each words as w, i}
        <span>{#if i % 3 === 1}<em>{w}</em>{:else}{w}{/if}<b></b></span>
      {/each}
    {/each}
  </div>
</div>

<style>
  .marquee { border-block: 1px solid var(--line); overflow: hidden; padding: 22px 0; background: var(--ink); }
  .track { display: flex; width: max-content; will-change: transform; }
  span { font-size: clamp(40px, 6vw, 96px); font-weight: 600; letter-spacing: -0.04em; white-space: nowrap; padding-right: 0.5em; display: flex; align-items: center; gap: 0.5em; }
  em { font-family: var(--serif); font-weight: 400; color: var(--heat); }
  b { display: inline-block; width: 0.32em; height: 0.32em; border-radius: 50%; background: var(--paper); opacity: 0.25; }
</style>
