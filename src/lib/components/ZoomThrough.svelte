<script lang="ts">
  import { onMount } from 'svelte';
  import { gsap, ScrollTrigger, setupGsap, reduced, splitChars } from '$lib/motion';

  // Scene: a giant word assembles, then the camera flies through the counter of its "O"
  // and the hole becomes the next section. Sticky (not pinned) so mobile address bars don't jitter.
  let scene: HTMLElement, word: HTMLElement, hole: HTMLElement;

  onMount(() => {
    if (reduced()) return;
    setupGsap();
    const chars = splitChars(word.querySelector('.w1')!);
    const chars2 = splitChars(word.querySelector('.w2')!);
    const all = [...chars, hole, ...chars2];

    // aim the zoom at the middle of the O's counter (offsets ignore transforms, so this is safe mid-zoom)
    const aim = () => gsap.set(word, { transformOrigin: `${hole.offsetLeft + hole.offsetWidth / 2}px ${hole.offsetTop + hole.offsetHeight * 0.55}px` });

    const ctx = gsap.context(() => {
      aim();
      gsap.timeline({
        scrollTrigger: { trigger: scene, start: 'top top', end: 'bottom bottom', scrub: 0.8, invalidateOnRefresh: true, onRefresh: aim }
      })
        .from(all, { yPercent: 120, rotateX: -80, opacity: 0, stagger: 0.04, duration: 0.6, ease: 'power3.out' }, 0)
        .from('.zt-kicker', { opacity: 0, y: 20, duration: 0.3 }, 0.1)
        .to('.zt-kicker, .zt-sub', { opacity: 0, y: -30, duration: 0.3 }, 1.0)
        .to(hole, { color: 'var(--heat)', duration: 0.25 }, 0.9)
        .to(word, { scale: 90, duration: 2, ease: 'power3.in' }, 1.05)
        .to('.zt-bars i', { scaleY: 1, duration: 0.6, ease: 'power2.inOut' }, 1.05)
        .to('.zt-bars i', { scaleY: 0, duration: 0.3, ease: 'power2.in' }, 2.75);
    }, scene);
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return () => ctx.revert();
  });
</script>

<section class="zt" bind:this={scene} data-nav="about" aria-label="Shipped to production">
  <div class="zt-stage">
    <p class="zt-kicker mono">Where the work ends up</p>
    <h2 class="zt-word" bind:this={word}>
      <span class="w1">PR</span><span class="hole" bind:this={hole}>O</span><span class="w2">DUCTION</span>
    </h2>
    <p class="zt-sub"><span class="serif">not</span> a notebook.</p>
    <div class="zt-bars" aria-hidden="true"><i></i><i></i></div>
  </div>
</section>

<style>
  .zt { padding: 0; height: 270vh; }
  .zt-stage { position: sticky; top: 0; height: 100vh; height: 100svh; overflow: hidden; display: grid; place-items: center; align-content: center; gap: 2vw; perspective: 900px; }
  .zt-word { position: relative; font-size: clamp(54px, 14vw, 280px); font-weight: 800; letter-spacing: -0.07em; line-height: 0.8; white-space: nowrap; transform-style: preserve-3d; }
  .zt-word :global(.ch), .hole { display: inline-block; transform-origin: 50% 100%; }
  .zt-kicker { color: var(--mute); }
  .zt-sub { font-size: clamp(20px, 2.4vw, 40px); letter-spacing: -0.03em; }
  .zt-sub .serif { color: var(--heat); }
  .zt-bars { position: absolute; inset: 0; pointer-events: none; display: flex; flex-direction: column; justify-content: space-between; }
  .zt-bars i { display: block; height: 11vh; background: #000; transform: scaleY(0); }
  .zt-bars i:first-child { transform-origin: top; } .zt-bars i:last-child { transform-origin: bottom; }
  @media (prefers-reduced-motion: reduce) { .zt { height: auto; } .zt-stage { position: static; height: auto; padding: 120px var(--pad); } }
</style>
