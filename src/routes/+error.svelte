<script lang="ts">
  import { href } from '$lib/link';
  import { page } from '$app/state';
</script>

<svelte:head><title>{page.status} — Nabeel Malik</title></svelte:head>

<section class="err">
  <p class="mono muted">Error {page.status}</p>
  <h1>{page.status === 404 ? 'Short shot.' : 'Something broke.'}</h1>
  <p class="serif">{page.status === 404 ? "The mold didn't fill — this page doesn't exist." : page.error?.message}</p>
  <a href={href('/')} class="mono">← Back home</a>
</section>

<style>
  .err { min-height: 90vh; display: flex; flex-direction: column; justify-content: center; gap: 24px; }
  h1 { font-size: clamp(64px, 13vw, 220px); letter-spacing: -0.065em; line-height: 0.85; font-weight: 700; }
  .serif { font-size: clamp(24px, 2.6vw, 40px); color: var(--heat); }
  a { color: var(--mute); }
  a:hover { color: var(--paper); }
</style>
