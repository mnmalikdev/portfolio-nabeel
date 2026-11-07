<script lang="ts">
  import { onMount } from 'svelte';
  import { afterNavigate } from '$app/navigation';

  // Film-slate HUD on the left edge: REC dot, scene number + name, and a timecode driven by scroll (24 fps).
  let scene = $state('01'), name = $state('Intro'), tc = $state('00:00:00:00');
  let sections: HTMLElement[] = [];
  const collect = () => (sections = [...document.querySelectorAll<HTMLElement>('main [data-nav], main header')]);
  afterNavigate(() => requestAnimationFrame(() => { collect(); update(); }));

  const pad = (n: number) => String(Math.floor(n)).padStart(2, '0');
  function update() {
    const f = Math.floor(scrollY / 6); // 6px of scroll = 1 frame
    tc = `${pad(f / 86400)}:${pad((f / 1440) % 60)}:${pad((f / 24) % 60)}:${pad(f % 24)}`;
    const probe = innerHeight * 0.5;
    let idx = 0;
    sections.forEach((s, i) => { const r = s.getBoundingClientRect(); if (r.top <= probe && r.bottom > probe) idx = i; });
    const s = sections[idx];
    scene = pad(idx + 1);
    name = s?.getAttribute('aria-label') || s?.querySelector('h1, h2, .eyebrow, .work-head span')?.textContent?.replace(/^\d+\s*—\s*/, '').replace(/\s+/g, ' ').trim().slice(0, 22) || '';
  }

  onMount(() => {
    collect(); update();
    let raf = 0;
    const q = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; update(); }); };
    addEventListener('scroll', q, { passive: true });
    return () => { removeEventListener('scroll', q); cancelAnimationFrame(raf); };
  });
</script>

<div class="hud mono" aria-hidden="true">
  <span class="rec"><i></i>Rec</span>
  <span>Sc {scene} — {name}</span>
  <span class="tc">{tc}</span>
</div>

<style>
  .hud { position: fixed; left: 12px; top: 50%; z-index: 110; transform: translateY(-50%) rotate(180deg); writing-mode: vertical-rl; display: flex; gap: 22px; align-items: center;
    font-size: 10px; color: var(--paper); mix-blend-mode: difference; pointer-events: none; opacity: 0.7; white-space: nowrap; }
  .rec { display: inline-flex; gap: 6px; align-items: center; }
  .rec i { width: 6px; height: 6px; border-radius: 50%; background: #ff2a2a; animation: rec 1.2s steps(2) infinite; }
  @keyframes rec { 50% { opacity: 0; } }
  .tc { font-variant-numeric: tabular-nums; }
  @media (max-width: 900px), (hover: none) { .hud { display: none; } }
</style>
