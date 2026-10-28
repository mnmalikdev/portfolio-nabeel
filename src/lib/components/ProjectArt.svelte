<script lang="ts">
  import { onMount } from 'svelte';
  import { gsap, reduced } from '$lib/motion';

  let { art = 'grid', seed = 'x', cover }: { art?: string; seed?: string; cover?: string } = $props();
  let svg: SVGSVGElement | undefined = $state();

  // deterministic RNG so SSR and client render the same art
  function rng(s: string) {
    let h = 1779033703 ^ s.length;
    for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 3432918353), (h = (h << 13) | (h >>> 19));
    return () => {
      h = Math.imul(h ^ (h >>> 16), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909);
      return ((h ^= h >>> 16) >>> 0) / 4294967296;
    };
  }

  const P = '#ecebe4', H = '#ff4d1a';

  function build(kind: string, s: string) {
    const r = rng(s), rnd = (a: number, b: number) => a + r() * (b - a);
    let o = '';
    if (kind === 'log') {
      for (let row = 0; row < 9; row++) {
        const y = 70 + row * 48;
        o += `<line x1="40" x2="760" y1="${y}" y2="${y}" stroke="${P}" stroke-opacity=".08"/>`;
        let x = 60 + rnd(0, 80);
        while (x < 720) {
          const w = rnd(30, 170), hot = r() < 0.18;
          o += `<rect x="${x.toFixed(1)}" y="${y - 14}" width="${w.toFixed(1)}" height="28" rx="14" fill="${hot ? H : P}" fill-opacity="${hot ? 1 : rnd(0.08, 0.3).toFixed(2)}"/>`;
          x += w + rnd(10, 60);
        }
      }
      o += `<line class="scan" x1="420" x2="420" y1="40" y2="490" stroke="${H}" stroke-width="2"/>`;
    } else if (kind === 'voice') {
      for (let i = 0; i < 70; i++) {
        const x = 40 + i * 10.3, h = Math.abs(Math.sin(i * 0.37) * Math.cos(i * 0.11)) * 220 + 8, hot = i > 44 && i < 52;
        o += `<rect class="bar" x="${x.toFixed(1)}" y="${(260 - h / 2).toFixed(1)}" width="4" height="${h.toFixed(1)}" rx="2" fill="${hot ? H : P}" fill-opacity="${hot ? 1 : 0.55}" style="transform-origin:${(x + 2).toFixed(1)}px 260px"/>`;
      }
      o += `<text x="40" y="470" fill="${P}" fill-opacity=".5" font-family="JetBrains Mono, monospace" font-size="14">{ "asset": "pump-07", "issue": "overheating", "action": "reduce load" }</text>`;
    } else if (kind === 'cavity') {
      for (let row = 0; row < 4; row++) for (let c = 0; c < 8; c++) {
        const x = 110 + c * 82, y = 110 + row * 82, hot = (row * 8 + c) % 7 === 3;
        o += `<circle class="cav" cx="${x}" cy="${y}" r="30" fill="none" stroke="${hot ? H : P}" stroke-opacity="${hot ? 1 : 0.3}" stroke-width="2"/><circle cx="${x}" cy="${y}" r="${hot ? 14 : 6}" fill="${hot ? H : P}" fill-opacity="${hot ? 1 : 0.25}"/>`;
      }
    } else if (kind === 'agents') {
      const pts: number[][] = [];
      for (let i = 0; i < 14; i++) pts.push([rnd(90, 710), rnd(80, 440)]);
      pts.forEach((p, i) => pts.forEach((q, j) => {
        if (j > i && Math.hypot(p[0] - q[0], p[1] - q[1]) < 230)
          o += `<line class="edge" x1="${p[0].toFixed(1)}" y1="${p[1].toFixed(1)}" x2="${q[0].toFixed(1)}" y2="${q[1].toFixed(1)}" stroke="${P}" stroke-opacity=".18" stroke-dasharray="4 6"/>`;
      }));
      pts.forEach((p, i) => (o += `<circle class="node" cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${i < 3 ? 16 : 6}" fill="${i < 3 ? H : P}" fill-opacity="${i < 3 ? 1 : 0.7}"/>`));
    } else if (kind === 'gym') {
      o += `<rect x="90" y="110" width="290" height="300" rx="10" fill="${P}" fill-opacity=".08" stroke="${P}" stroke-opacity=".25"/><rect x="420" y="110" width="290" height="300" rx="10" fill="${H}" fill-opacity=".9"/>`;
      o += `<circle cx="235" cy="230" r="46" fill="${P}" fill-opacity=".25"/><circle cx="565" cy="230" r="46" fill="#121210" fill-opacity=".35"/>`;
      o += `<rect x="175" y="300" width="120" height="70" rx="35" fill="${P}" fill-opacity=".18"/><rect x="505" y="300" width="120" height="70" rx="35" fill="#121210" fill-opacity=".3"/>`;
      o += `<circle class="rec" cx="120" cy="140" r="7" fill="${H}"/>`;
    } else {
      // generic fallback: shifting grid of squares
      for (let row = 0; row < 7; row++) for (let c = 0; c < 12; c++) {
        const hot = r() < 0.07;
        o += `<rect class="sq" x="${60 + c * 58}" y="${60 + row * 58}" width="40" height="40" rx="6" fill="${hot ? H : P}" fill-opacity="${hot ? 1 : rnd(0.04, 0.22).toFixed(2)}"/>`;
      }
    }
    return o;
  }

  const inner = $derived(build(art, seed));

  onMount(() => {
    if (!svg || reduced()) return;
    const q = (s: string) => svg!.querySelectorAll(s);
    const ctx = gsap.context(() => {
      if (q('.scan').length) gsap.to(q('.scan'), { attr: { x1: 740, x2: 740 }, duration: 4, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      q('.bar').forEach((b, i) => gsap.to(b, { scaleY: () => gsap.utils.random(0.2, 1.3), duration: () => gsap.utils.random(0.3, 0.7), repeat: -1, yoyo: true, ease: 'sine.inOut', delay: i * 0.02 }));
      if (q('.cav').length) gsap.to(q('.cav'), { attr: { r: 36 }, strokeOpacity: 0.05, duration: 1.4, stagger: { each: 0.05, repeat: -1, yoyo: true, from: 'random' }, ease: 'sine.inOut' });
      if (q('.edge').length) gsap.to(q('.edge'), { strokeDashoffset: -40, duration: 2, repeat: -1, ease: 'none' });
      if (q('.node').length) gsap.to(q('.node'), { attr: { cx: '+=random(-14,14)', cy: '+=random(-14,14)' }, duration: 2.5, repeat: -1, yoyo: true, ease: 'sine.inOut', stagger: 0.1 });
      if (q('.rec').length) gsap.to(q('.rec'), { opacity: 0, duration: 0.6, repeat: -1, yoyo: true });
      if (q('.sq').length) gsap.to(q('.sq'), { fillOpacity: () => gsap.utils.random(0.03, 0.3), duration: 1.6, repeat: -1, yoyo: true, stagger: { each: 0.02, from: 'random' } });
    }, svg);
    return () => ctx.revert();
  });
</script>

{#if cover}
  <img class="art-media" src={cover} alt="" loading="lazy" />
{:else}
  <svg class="art-media" bind:this={svg} viewBox="0 0 800 520" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <rect width="800" height="520" fill="#121210" />
    {@html inner}
  </svg>
{/if}

<style>
  .art-media { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform 1.1s cubic-bezier(0.2, 0.8, 0.2, 1); }
</style>
