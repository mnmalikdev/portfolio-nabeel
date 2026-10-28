<script lang="ts">
  import { onMount } from 'svelte';

  let cv: HTMLCanvasElement;
  onMount(() => {
    const ctx = cv.getContext('2d')!;
    let W = 0, H = 0, mx = 0.6, my = 0.5, raf = 0, visible = true;
    const blobs = [
      { c: '255,77,26', r: 0.42, x: 0.7, y: 0.45, sx: 0.00031, sy: 0.00023, p: 0 },
      { c: '255,178,26', r: 0.26, x: 0.55, y: 0.6, sx: 0.00027, sy: 0.00037, p: 2 },
      { c: '91,108,255', r: 0.3, x: 0.25, y: 0.3, sx: 0.00019, sy: 0.00029, p: 4 },
      { c: '255,40,80', r: 0.22, x: 0.8, y: 0.75, sx: 0.00035, sy: 0.00021, p: 1 }
    ];
    const size = () => { W = cv.width = cv.offsetWidth * 0.5; H = cv.height = cv.offsetHeight * 0.5; };
    const move = (e: PointerEvent) => { mx = e.clientX / innerWidth; my = e.clientY / innerHeight; };
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(cv);
    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      if (!visible) return;
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'lighter';
      blobs.forEach((b, i) => {
        const pull = i === 0 ? 0.35 : 0.12;
        const x = (b.x + Math.sin(t * b.sx + b.p) * 0.18) * (1 - pull) + mx * pull;
        const y = (b.y + Math.cos(t * b.sy + b.p) * 0.18) * (1 - pull) + my * pull;
        const r = b.r * Math.max(W, H) * (1 + Math.sin(t * 0.0007 + b.p) * 0.08);
        const g = ctx.createRadialGradient(x * W, y * H, 0, x * W, y * H, r);
        g.addColorStop(0, `rgba(${b.c},.85)`); g.addColorStop(1, `rgba(${b.c},0)`);
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      });
      ctx.globalCompositeOperation = 'source-over';
    };
    size();
    addEventListener('resize', size);
    addEventListener('pointermove', move);
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); io.disconnect(); removeEventListener('resize', size); removeEventListener('pointermove', move); };
  });
</script>

<canvas bind:this={cv}></canvas>

<style>
  canvas { position: absolute; inset: 0; width: 100%; height: 100%; filter: blur(70px) saturate(1.2); opacity: 0.85; z-index: 0; }
</style>
