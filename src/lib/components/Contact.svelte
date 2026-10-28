<script lang="ts">
  import { site } from '$lib/content';
  import { PREVIEW } from '$lib/link';
  import { lines, magnetic, scrollTo } from '$lib/motion';

  let toast = $state('');
  async function copy() {
    try { await navigator.clipboard.writeText(site.email); toast = 'Email copied ✦'; } catch { toast = site.email; }
    setTimeout(() => (toast = ''), 2200);
  }
</script>

<section class="contact" id="contact">
  <div>
    <div class="eyebrow mono">Contact</div>
    <h2 class="big" use:lines>
      <span class="ln"><span>Let's build</span></span>
      <span class="ln"><span>something <span class="serif">solid</span></span></span>
    </h2>
  </div>
  <div>
    <div class="row">
      <a class="email" href="mailto:{site.email}">{site.email}</a>
      <button class="mag" use:magnetic onclick={copy}><span>Copy<br />email ↗</span></button>
    </div>
    <footer class="mono">
      <div class="socials">
        <a href={site.github} target="_blank" rel="noopener">GitHub</a>
        <a href={site.linkedin} target="_blank" rel="noopener">LinkedIn</a>
        {#if !PREVIEW}<a href="/rss.xml">RSS</a>{/if}
      </div>
      <span>© {new Date().getFullYear()} Nabeel Malik</span>
      <button onclick={() => scrollTo(0)}>Back to top ↑</button>
    </footer>
  </div>
  <div class="toast mono" class:on={!!toast}>{toast || '·'}</div>
</section>

<style>
  .contact { min-height: 100svh; display: flex; flex-direction: column; justify-content: space-between; padding-bottom: 30px; background: var(--heat); color: var(--ink); overflow: hidden; }
  .contact :global(.eyebrow) { color: rgba(12, 12, 11, 0.6); }
  .big { font-size: clamp(56px, 13.5vw, 250px); line-height: 0.8; letter-spacing: -0.07em; font-weight: 800; text-transform: uppercase; }
  .big .serif { text-transform: none; font-weight: 400; letter-spacing: -0.03em; }
  .row { display: flex; justify-content: space-between; align-items: center; gap: 30px; flex-wrap: wrap; margin-top: 50px; }
  .mag { display: inline-grid; place-items: center; width: clamp(150px, 15vw, 210px); aspect-ratio: 1; border-radius: 50%; background: var(--ink); color: var(--paper); font-weight: 600; font-size: 18px; line-height: 1.1; }
  .mag span { pointer-events: none; }
  .email { font-size: clamp(24px, 3.4vw, 56px); letter-spacing: -0.04em; font-weight: 600; border-bottom: 2px solid var(--ink); line-height: 1.1; word-break: break-all; }
  footer { display: flex; justify-content: space-between; gap: 20px; flex-wrap: wrap; border-top: 1px solid rgba(12, 12, 11, 0.25); padding-top: 18px; margin-top: 60px; }
  .socials { display: flex; gap: 26px; }
  .socials a { position: relative; }
  .socials a::after { content: ''; position: absolute; left: 0; bottom: -3px; width: 100%; height: 1px; background: currentColor; transform: scaleX(0); transform-origin: right; transition: transform 0.5s var(--ease); }
  .socials a:hover::after { transform: scaleX(1); transform-origin: left; }
  footer button { font-family: inherit; font-size: inherit; letter-spacing: inherit; text-transform: inherit; }
  .toast { position: fixed; bottom: 24px; left: 50%; transform: translate(-50%, 250%); background: var(--ink); color: var(--paper); padding: 12px 18px; border-radius: 99px; z-index: 150; transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1); }
  .toast.on { transform: translate(-50%, 0); }
</style>
