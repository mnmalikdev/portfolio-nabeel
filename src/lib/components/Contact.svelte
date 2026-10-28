<script lang="ts">
  import { site } from '$lib/content';
  import SocialIcon from '$lib/components/SocialIcon.svelte';
  import { lines, magnetic, scrollTo } from '$lib/motion';

  let toast = $state('');
  async function copy() {
    try { await navigator.clipboard.writeText(site.email); toast = 'Email copied ✦'; } catch { toast = site.email; }
    setTimeout(() => (toast = ''), 2200);
  }
</script>

<section class="contact" id="contact" data-nav="contact">
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
      <div class="btns">
        <a class="cv" href={site.cv} download data-cursor="CV"><span>Download CV</span><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M12 4v12m0 0-5-5m5 5 5-5M5 20h14"/></svg></a>
        <button class="mag" use:magnetic onclick={copy}><span>Copy<br />email ↗</span></button>
      </div>
    </div>
    <div class="reach mono">
      <a href={site.whatsapp} target="_blank" rel="noopener">WhatsApp ↗</a>
      <a href="tel:{site.phone.replace(/\s/g, '')}">{site.phone}</a>
      <span><svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true"><path fill="currentColor" d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z"/></svg> {site.location}</span>
    </div>
    <footer class="mono">
      <div class="socials">
        <a href={site.github} target="_blank" rel="noopener"><SocialIcon name="github" size={13} /> GitHub</a>
        <a href={site.linkedin} target="_blank" rel="noopener"><SocialIcon name="linkedin" size={12} /> LinkedIn</a>
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
  .btns { display: flex; align-items: center; gap: 22px; flex-wrap: wrap; }
  .cv { display: inline-flex; align-items: center; gap: 12px; padding: 18px 28px; border-radius: 99px; border: 2px solid var(--ink); font-weight: 600; font-size: 18px; transition: background 0.4s, color 0.4s; }
  .cv:hover { background: var(--ink); color: var(--heat); }
  .reach { display: flex; flex-wrap: wrap; gap: 14px 34px; margin-top: 34px; font-size: 13px; }
  .reach a, .reach span { display: inline-flex; align-items: center; gap: 8px; border-bottom: 1px solid rgba(12, 12, 11, 0.4); padding-bottom: 3px; }
  .reach span { border-bottom-color: transparent; }
  footer { display: flex; justify-content: space-between; gap: 20px; flex-wrap: wrap; border-top: 1px solid rgba(12, 12, 11, 0.25); padding-top: 18px; margin-top: 60px; }
  .socials { display: flex; gap: 26px; }
  .socials a { position: relative; display: inline-flex; align-items: center; gap: 7px; }
  .socials a::after { content: ''; position: absolute; left: 0; bottom: -3px; width: 100%; height: 1px; background: currentColor; transform: scaleX(0); transform-origin: right; transition: transform 0.5s var(--ease); }
  .socials a:hover::after { transform: scaleX(1); transform-origin: left; }
  footer button { font-family: inherit; font-size: inherit; letter-spacing: inherit; text-transform: inherit; }
  .toast { position: fixed; bottom: 24px; left: 50%; transform: translate(-50%, 250%); background: var(--ink); color: var(--paper); padding: 12px 18px; border-radius: 99px; z-index: 150; transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1); }
  .toast.on { transform: translate(-50%, 0); }
</style>
