<script lang="ts">
  import { onMount } from 'svelte';
  import { afterNavigate } from '$app/navigation';

  let dot: HTMLDivElement, ring: HTMLDivElement;
  let big = $state(false);
  let label = $state('');

  const reset = () => { big = false; label = ''; };
  afterNavigate(reset);

  onMount(() => {
    if (matchMedia('(hover: none)').matches) return;
    let x = innerWidth / 2, y = innerHeight / 2, tx = x, ty = y, rx = x, ry = y, raf = 0;
    const move = (e: PointerEvent) => { tx = e.clientX; ty = e.clientY; };
    const over = (e: PointerEvent) => {
      const t = e.target as HTMLElement;
      const labeled = t.closest<HTMLElement>('[data-cursor]');
      label = labeled?.dataset.cursor ?? '';
      big = !label && !!t.closest('a, button, .pill');
    };
    const loop = () => {
      x += (tx - x) * 0.2; y += (ty - y) * 0.2;
      dot.style.transform = `translate(${x}px, ${y}px)`;
      // trailing ring: lags behind and stretches along the direction of travel
      const vx = tx - rx, vy = ty - ry;
      rx += vx * 0.11; ry += vy * 0.11;
      const speed = Math.min(Math.hypot(vx, vy), 260);
      const st = 1 + speed / 220;
      ring.style.transform = `translate(${rx}px, ${ry}px) rotate(${Math.atan2(vy, vx)}rad) scale(${st}, ${1 / Math.sqrt(st)})`;
      raf = requestAnimationFrame(loop);
    };
    addEventListener('pointermove', move);
    document.addEventListener('pointerover', over);
    loop();
    return () => { cancelAnimationFrame(raf); removeEventListener('pointermove', move); document.removeEventListener('pointerover', over); };
  });
</script>

<div class="cursor ring-wrap" bind:this={ring} aria-hidden="true"><div class="ring" class:gone={big || !!label}></div></div>
<div class="cursor" bind:this={dot} aria-hidden="true">
  <div class="dot" class:big class:labeled={!!label}><span class="mono">{label}</span></div>
</div>

<style>
  .cursor { position: fixed; top: 0; left: 0; z-index: 300; pointer-events: none; }
  .ring { width: 38px; height: 38px; border-radius: 50%; border: 1px solid var(--paper); transform: translate(-50%, -50%); opacity: 0.6; transition: opacity 0.3s, width 0.4s, height 0.4s; }
  .ring.gone { opacity: 0; width: 10px; height: 10px; }
  .ring-wrap { mix-blend-mode: difference; transform-origin: 0 0; }
  .dot { width: 10px; height: 10px; border-radius: 50%; background: var(--paper); transform: translate(-50%, -50%); display: grid; place-items: center; mix-blend-mode: difference;
    transition: width 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), height 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), background 0.3s; }
  .dot.big { width: 80px; height: 80px; }
  .dot.labeled { width: 96px; height: 96px; background: var(--heat); mix-blend-mode: normal; }
  .dot span { color: var(--ink); opacity: 0; transition: opacity 0.2s; font-size: 10px; }
  .dot.labeled span { opacity: 1; transition-delay: 0.15s; }
  @media (hover: none) { .cursor { display: none; } }
</style>
