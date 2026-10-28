<script lang="ts">
  import { href } from '$lib/link';
  import { onMount } from 'svelte';
  import { projects, posts, fmtDate, site } from '$lib/content';
  import { gsap, ScrollTrigger, setupGsap, reduced, whenIntroDone, splitChars, reveal, lines } from '$lib/motion';
  import Molten from '$lib/components/Molten.svelte';
  import Marquee from '$lib/components/Marquee.svelte';
  import ProjectArt from '$lib/components/ProjectArt.svelte';
  import SocialIcon from '$lib/components/SocialIcon.svelte';

  // Drop a photo at src/lib/assets/portrait.(jpg|png|webp) and it shows up in the hero. No file = no portrait.
  const portrait = Object.values(import.meta.glob<string>('/src/lib/assets/portrait.{jpg,jpeg,png,webp}', { eager: true, query: '?url', import: 'default' }))[0];

  type Xp = { when: string; org: string; role: string; where: string; groups?: { title?: string; items: string[] }[] };
  const xps: Xp[] = [
    { when: 'Jan 2026 — Now', org: 'OSPHIM', role: 'Full-stack AI engineer · part-time Jan–Jul 2026, full-time since', where: 'Aachen, DE · Remote', groups: [
      { items: [
        'Built Claire, an injection-molding AI agent (Python, FastAPI, SQLAlchemy, Claude) on an agent harness — tool-calling, tenant-scoped data access, honest about data gaps. Live for all customers.',
        'Voice shift-handover pipeline: speech-to-text plus LLM extraction turns spoken handovers into structured shift data.',
        'Redesigned the production logbook into a cross-entity, real-time schema (NestJS, PostgreSQL, Drizzle, Kafka).',
        'Multi-cavity experiment configuration in SvelteKit 5 for process engineers.'
      ] }
    ] },
    { when: 'May 2024 — Oct 2025', org: 'mobileLIVE', role: 'Software engineer', where: 'Canada · Remote', groups: [
      { title: 'MonieCorp — fintech product', items: [
        'React + TypeScript + shadcn components: page loads 25% faster, UI bugs down 40% after the refactor.',
        '15+ SOLID admin-panel components; client feedback loop cut from 3 days to 24 hours.',
        'Multi-step form for tiered currency margins: setup from 20+ min to under 4 min per currency pair.',
        'CSP Level 3 with nonce-based whitelisting — blocked 100% of inline-script attempts in pen testing.'
      ] },
      { title: 'Staples Canada', items: [
        'Mixpanel tracking for 100k+ users (views, add-to-cart, checkout) — helped lift conversions 12%.',
        'Built print-product customization end to end with the Canva API — engagement up 20%.',
        'Fixed 30+ production bugs inside 4-hour SLAs, keeping 99.9% uptime through peak sales.'
      ] }
    ] },
    { when: 'Apr 2022 — May 2024', org: 'Code Huddle', role: 'Associate software engineer · intern Apr–Jun 2022', where: 'Islamabad, PK', groups: [
      { title: 'GYMYG — virtual gym partner (US startup)', items: [
        'NestJS REST APIs with JWT RBAC serving 10K DAU at under 200 ms P95.',
        'Stripe monthly subscriptions, $15k+ processed.',
        'Video load times down ~30% with FFmpeg compression and CloudFront edge delivery.',
        'CI/CD with GitHub Actions and AWS CodePipeline — deploys 40% faster.'
      ] },
      { title: 'Ordinami — QR ordering MVP (Italian startup)', items: [
        'Firebase Auth + Firestore backend handling 100+ daily orders.',
        'shadcn/ui + Tailwind admin panel for menus — owner setup time down 60%.'
      ] }
    ] },
    { when: 'Feb 2018 — Feb 2022', org: 'COMSATS', role: 'Bachelor of Science in Software Engineering', where: 'Islamabad, PK' }
  ];
  let openXp = $state(new Set<number>([0]));
  function toggleXp(i: number) {
    const n = new Set(openXp);
    n.has(i) ? n.delete(i) : n.add(i);
    openXp = n;
    setTimeout(() => ScrollTrigger.refresh(), 700);
  }

  const featured = projects.filter((p) => p.featured);
  const latest = posts.slice(0, 3);

  let title: HTMLElement, track: HTMLElement, work: HTMLElement, about: HTMLElement, progress: HTMLElement;

  onMount(() => {
    if (reduced()) return;
    setupGsap();
    const chars = splitChars(title.querySelector('.l1')!);
    const chars2 = splitChars(title.querySelector('.l2')!);
    gsap.set([...chars, ...chars2], { yPercent: 115, rotate: 6 });
    gsap.set('.hero-fade', { autoAlpha: 0, y: 20 });
    gsap.set('.portrait', { autoAlpha: 0, scale: 1.06 });

    const ctx = gsap.context(() => {
      // words in About light up on scroll
      const words: HTMLElement[] = [];
      (function wrap(n: Node) {
        [...n.childNodes].forEach((c) => {
          if (c.nodeType === 3) {
            const frag = document.createDocumentFragment();
            (c.textContent ?? '').split(/(\s+)/).forEach((p) => {
              if (!p) return;
              if (/^\s+$/.test(p)) frag.appendChild(document.createTextNode(p));
              else { const s = document.createElement('span'); s.className = 'w'; s.textContent = p; frag.appendChild(s); words.push(s); }
            });
            c.replaceWith(frag);
          } else wrap(c);
        });
      })(about);
      gsap.fromTo(words, { opacity: 0.12 }, { opacity: 1, stagger: 0.1, ease: 'none', scrollTrigger: { trigger: about, start: 'top 80%', end: 'bottom 45%', scrub: true } });

      // hero parallax
      gsap.to(title, { yPercent: -18, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      // portrait drifts slower than the title — depth
      gsap.to('.portrait img', { yPercent: 10, scale: 1.08, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

      // counters
      document.querySelectorAll<HTMLElement>('[data-count]').forEach((n) => {
        const o = { v: 0 };
        gsap.to(o, { v: +n.dataset.count!, duration: 1.6, ease: 'power3.out', scrollTrigger: { trigger: n, start: 'top 85%' }, onUpdate: () => (n.firstChild!.textContent = String(Math.round(o.v))) });
      });

      // horizontal featured work
      const mm = gsap.matchMedia();
      mm.add('(min-width: 861px)', () => {
        const dist = () => track.scrollWidth - innerWidth;
        const h = gsap.to(track, {
          x: () => -dist(), ease: 'none',
          scrollTrigger: { trigger: work, start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 1, invalidateOnRefresh: true, onUpdate: (s) => (progress.style.width = s.progress * 100 + '%') }
        });
        track.querySelectorAll<HTMLElement>('.card').forEach((c) => {
          // inner parallax only: the art is always visible, it just drifts as the card travels
          const media = c.querySelector('.art')?.lastElementChild;
          if (media) gsap.fromTo(media, { xPercent: 5, scale: 1.12 }, { xPercent: -5, scale: 1.12, ease: 'none', scrollTrigger: { trigger: c, containerAnimation: h, start: 'left right', end: 'right left', scrub: true } });
        });
      });
      mm.add('(max-width: 860px)', () => {
        track.querySelectorAll('.card').forEach((c) => gsap.from(c, { y: 80, autoAlpha: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: c, start: 'top 85%' } }));
      });

      gsap.fromTo('.quote blockquote', { scale: 0.92 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.quote', start: 'top bottom', end: 'center center', scrub: true } });
    });

    whenIntroDone(() => {
      gsap.timeline({ delay: 0.05 })
        .to('.portrait', { autoAlpha: 1, scale: 1, duration: 1.8, ease: 'expo.out' }, 0)
        .to([...chars, ...chars2], { yPercent: 0, rotate: 0, duration: 1.2, stagger: 0.035, ease: 'expo.out' }, 0)
        .to('.hero-fade', { autoAlpha: 1, y: 0, duration: 1, stagger: 0.1, ease: 'power3.out' }, '-=.9');
      ScrollTrigger.refresh();
    });

    return () => ctx.revert();
  });
</script>

<svelte:head>
  <title>Nabeel Malik — Full-stack AI Engineer</title>
  <meta name="description" content={site.description} />
  <meta property="og:title" content="Nabeel Malik — Full-stack AI Engineer" />
  <meta property="og:description" content={site.description} />
</svelte:head>

<header class="hero">
  <Molten />
  {#if portrait}<div class="portrait" aria-hidden="true"><img src={portrait} alt="" /></div>{/if}
  <div class="hero-top mono hero-fade">
    <p>Full-stack AI engineer ✦ LLM systems ✦ real-time backends</p>
    <div class="r"><p><svg class="pin" viewBox="0 0 24 24" width="12" height="12" aria-hidden="true"><path fill="currentColor" d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z"/></svg>Bayreuth, DE<br />← Islamabad, PK</p><p class="soc"><a href={site.github} target="_blank" rel="noopener"><SocialIcon name="github" size={13} /> GitHub</a> <a href={site.linkedin} target="_blank" rel="noopener"><SocialIcon name="linkedin" size={12} /> LinkedIn</a></p></div>
  </div>
  <h1 class="title" bind:this={title} aria-label="Nabeel Malik">
    <span class="ln"><span class="l1">Nabeel</span></span>
    <span class="ln r"><span class="l2">Malik<span class="serif"> ✦</span></span></span>
  </h1>
  <div class="hero-bottom hero-fade">
    <p class="lead">I build <span class="serif heat">AI-powered</span> products end to end — LLM pipelines and agents, event-driven backends, and the interfaces people actually use.</p>
    <p class="mono muted">5+ yrs · Python · TypeScript · LLMs · Kafka · Postgres</p>
    <div class="scroll-cue mono"><span>Scroll</span><i></i></div>
  </div>
</header>

<Marquee words={['LLM pipelines', 'Python', 'Agents', 'FastAPI', 'RAG', 'Event-driven', 'Kafka', 'SvelteKit', 'NestJS', 'Postgres', 'Speech-to-text', 'Real-time']} />

<section id="about">
  <div class="eyebrow mono" use:reveal={{ y: 0 }}>01 — About</div>
  <p class="about-text" bind:this={about}>
    I build <span class="serif">AI-powered</span> systems end to end — LLM pipelines, voice and agents on event-driven backends. AI that ships to production, not one that lives in a notebook. I like knowing <span class="serif">why</span> things work, not only that they do.
  </p>
  <div class="stats" use:reveal={{ children: true }}>
    <div class="stat"><div class="n" data-count="5">5<sup>+</sup></div><p class="mono">Years shipping production software</p></div>
    <div class="stat"><div class="n" data-count="2">2</div><p class="mono">Continents shipped from</p></div>
    <div class="stat"><div class="n" data-count="24">24<sup>/7</sup></div><p class="mono">Factory data that never sleeps</p></div>
    <div class="stat"><div class="n">∞</div><p class="mono">Kafka messages, apparently</p></div>
  </div>
</section>

<section class="work" bind:this={work}>
  <div class="work-head mono"><span>02 — Selected work</span><a href={href(`/projects/`)} class="all">All projects →</a></div>
  <div class="work-track" bind:this={track}>
    <div class="work-intro">
      <h2>Selected<br /><span class="serif">work</span></h2>
      <p>Most of what I build lives behind factory NDAs, so here's the shape of it rather than the screenshots.</p>
    </div>
    {#each featured as p, i}
      <a class="card" href={href(`/projects/${p.slug}/`)} data-cursor="Open">
        <div class="art">
          <span class="idx mono">{String(i + 1).padStart(2, '0')}</span>
          {#if p.client}<span class="tag mono">{p.client}</span>{/if}
          <ProjectArt art={p.art} seed={p.slug} cover={p.cover} />
        </div>
        <div class="meta">
          <h3>{p.title}</h3>
          <div><p>{p.summary}</p><div class="chips" style="margin-top:12px">{#each p.stack.slice(0, 5) as s}<span>{s}</span>{/each}</div></div>
        </div>
      </a>
    {/each}
    <a class="card more" href={href(`/projects/`)} data-cursor="All">
      <span class="more-in"><span class="serif">See</span> everything →</span>
    </a>
  </div>
  <div class="work-progress"><i bind:this={progress}></i></div>
</section>

{#if latest.length}
  <section class="writing">
    <div class="w-head">
      <div class="eyebrow mono" style="margin:0">03 — Writing</div>
      <a href={href(`/blog/`)} class="mono">All posts →</a>
    </div>
    <h2 class="w-title" use:lines><span class="ln"><span>Notes from the</span></span><span class="ln"><span><span class="serif">factory</span> floor</span></span></h2>
    <ul class="posts" use:reveal={{ children: true, y: 40 }}>
      {#each latest as post}
        <li>
          <a href={href(`/blog/${post.slug}/`)} data-cursor="Read">
            <span class="mono muted">{fmtDate(post.date)}</span>
            <span class="pt">{post.title}</span>
            <span class="mono muted">{post.readingTime} min</span>
          </a>
        </li>
      {/each}
    </ul>
  </section>
{/if}

<section id="experience">
  <div class="eyebrow mono">04 — The path so far</div>
  <div class="xp-list" use:reveal={{ children: true, y: 50 }}>
    {#each xps as x, i}
      <div class="xp-item" class:open={openXp.has(i)}>
        {#if x.groups}
          <button class="xp" onclick={() => toggleXp(i)} aria-expanded={openXp.has(i)} data-cursor={openXp.has(i) ? 'Close' : 'Open'}>
            <span class="mono">{x.when}</span><h4>{x.org}</h4><span class="role">{x.role}</span><span class="when mono">{x.where}<i class="plus" aria-hidden="true"></i></span>
          </button>
          <div class="xp-body"><div class="xp-inner">
            {#each x.groups as g}
              <div class="xp-group">
                {#if g.title}<p class="mono g-title">{g.title}</p>{/if}
                <ul>{#each g.items as it}<li>{it}</li>{/each}</ul>
              </div>
            {/each}
          </div></div>
        {:else}
          <div class="xp static"><span class="mono">{x.when}</span><h4>{x.org}</h4><span class="role">{x.role}</span><span class="when mono">{x.where}<i class="plus ghost" aria-hidden="true"></i></span></div>
        {/if}
      </div>
    {/each}
  </div>
</section>

<section id="stack">
  <div class="stack-wrap">
    <h2>Tools I<br />reach <span class="serif">for</span></h2>
    <div>
      {#each [
        ['AI & LLMs', ['Python', 'FastAPI', 'LLM extraction', 'RAG', 'Agents', 'Speech-to-text']],
        ['Backend & data', ['NestJS', 'Node.js', 'TypeScript', 'PostgreSQL', 'Drizzle ORM', 'TypeORM', 'Kafka', 'Redis']],
        ['Frontend', ['SvelteKit 5', 'React', 'React Native', 'Tailwind']],
        ['Infra & ops', ['Azure', 'Hetzner', 'AWS', 'Docker', 'Terraform', 'OpenTelemetry']]
      ] as [label, items]}
        <div class="group">
          <span class="mono">{label}</span>
          <div class="pills" use:reveal={{ children: true, y: 40, stagger: 0.05 }}>{#each items as it}<span class="pill">{it}</span>{/each}</div>
        </div>
      {/each}
    </div>
  </div>
</section>

<section class="quote">
  <blockquote use:lines>
    <span class="ln"><span>Make it work,</span></span>
    <span class="ln"><span>make it <span class="serif">right,</span></span></span>
    <span class="ln"><span>make it fast.</span></span>
  </blockquote>
  <cite class="mono">— Kent Beck. Still the plan.</cite>
</section>

<style>
  .hero { position: relative; min-height: 100svh; display: flex; flex-direction: column; justify-content: flex-end; padding: 120px var(--pad) 36px; overflow: hidden; }
  .hero > :not(:global(canvas)) { position: relative; z-index: 1; }
  .hero > .portrait { position: absolute; z-index: 0; right: 0; bottom: 0; width: min(42vw, 760px); height: 100%; pointer-events: none; overflow: hidden;
    -webkit-mask-image: linear-gradient(to top, transparent 0%, #000 22%), linear-gradient(to right, transparent 0%, #000 32%);
    -webkit-mask-composite: source-in; mask-image: linear-gradient(to top, transparent 0%, #000 22%), linear-gradient(to right, transparent 0%, #000 32%); mask-composite: intersect; }
  .portrait img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 15%; filter: grayscale(1) contrast(1.05); opacity: 1; will-change: transform; }
  @media (max-width: 760px) { .hero > .portrait { right: 0; left: 0; width: 100%; height: 78%; top: 70px; bottom: auto; } .portrait img { opacity: 0.55; } }
  .hero-top { position: absolute !important; top: 110px; left: var(--pad); right: var(--pad); display: flex; justify-content: space-between; gap: 20px; }
  .hero-top p { max-width: 300px; color: rgba(236, 235, 228, 0.75); }
  .hero-top .r { text-align: right; }
  .pin { display: inline-block; vertical-align: -1px; margin-right: 6px; color: var(--heat); }
  .hero-top .soc { margin-top: 10px; display: flex; gap: 16px; justify-content: flex-end; }
  .hero-top .soc a { display: inline-flex; align-items: center; gap: 7px; color: var(--paper); border-bottom: 1px solid rgba(236, 235, 228, 0.35); }
  .title { font-weight: 700; font-size: clamp(64px, 17.5vw, 300px); max-width: 100%; line-height: 0.82; letter-spacing: -0.065em; text-transform: uppercase; }
  .title .r { text-align: right; }
  @media (min-width: 761px) { .title { font-size: clamp(64px, 13.5vw, 250px); } .title .r { text-align: left; padding-left: 9vw; } }
  .title .serif { text-transform: none; font-weight: 400; letter-spacing: -0.02em; color: var(--heat); }
  .hero-bottom { display: grid; grid-template-columns: 1fr 1fr 1fr; align-items: end; margin-top: 36px; gap: 20px; border-top: 1px solid var(--line); padding-top: 18px; }
  .lead { font-size: clamp(18px, 1.6vw, 24px); line-height: 1.25; max-width: 460px; letter-spacing: -0.01em; }
  .scroll-cue { justify-self: end; display: flex; align-items: center; gap: 10px; }
  .scroll-cue i { display: block; width: 1px; height: 46px; background: var(--line); position: relative; overflow: hidden; }
  .scroll-cue i::after { content: ''; position: absolute; left: 0; top: -50%; width: 100%; height: 50%; background: var(--heat); animation: drip 1.8s cubic-bezier(0.7, 0, 0.3, 1) infinite; }
  @keyframes drip { to { top: 110%; } }
  @media (max-width: 760px) { .hero-bottom { grid-template-columns: 1fr; } .scroll-cue { justify-self: start; } .hero-top { flex-direction: column; } .hero-top .r { text-align: left; } .hero-top .soc { justify-content: flex-start; } }

  .about-text { font-size: clamp(30px, 4.6vw, 76px); line-height: 1.04; letter-spacing: -0.035em; font-weight: 500; max-width: 1500px; }
  .about-text .serif { color: var(--heat); }
  .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-top: clamp(70px, 9vw, 140px); border-top: 1px solid var(--line); }
  .stat { padding-top: 22px; }
  .stat .n { font-size: clamp(56px, 7vw, 120px); font-weight: 700; letter-spacing: -0.06em; line-height: 0.9; }
  .stat sup { font-size: 0.35em; color: var(--heat); vertical-align: top; margin-left: 4px; }
  .stat p { color: var(--mute); margin-top: 10px; max-width: 220px; }
  @media (max-width: 760px) { .stats { grid-template-columns: 1fr 1fr; } }

  .work { padding: 0; height: 100vh; overflow: hidden; background: var(--paper); color: var(--ink); }
  .work-head { position: absolute; top: 74px; left: 0; right: 0; padding: 0 var(--pad); display: flex; justify-content: space-between; z-index: 2; }
  .work-track { display: flex; height: 100%; align-items: center; gap: 4vw; padding: 0 var(--pad); width: max-content; will-change: transform; }
  .work-intro { width: min(54vw, 820px); flex: none; padding-right: 2vw; }
  .work-intro h2 { font-size: clamp(56px, 8.5vw, 150px); line-height: 0.85; letter-spacing: -0.06em; font-weight: 700; text-transform: uppercase; }
  .work-intro h2 .serif { text-transform: none; color: var(--heat); letter-spacing: -0.02em; }
  .work-intro p { margin-top: 28px; max-width: 360px; color: #55544e; }
  .card { flex: none; width: min(62vw, 820px); height: 72vh; display: grid; grid-template-rows: 1fr auto; gap: 18px; }
  .art { position: relative; border-radius: 6px; overflow: hidden; background: var(--ink); clip-path: inset(0 0 0 0 round 6px); }
  .card:hover .art :global(.art-media) { transform: scale(1.06); }
  .idx, .tag { position: absolute; top: 18px; z-index: 1; color: var(--paper); }
  .idx { left: 20px; }
  .tag { right: 20px; border: 1px solid rgba(236, 235, 228, 0.35); padding: 6px 10px; border-radius: 99px; }
  .meta { display: grid; grid-template-columns: 1.1fr 1fr; gap: 24px; align-items: start; }
  .meta h3 { font-size: clamp(28px, 3vw, 48px); letter-spacing: -0.04em; line-height: 0.95; font-weight: 600; }
  .meta p { color: #55544e; font-size: 15px; }
  .card.more { width: min(36vw, 480px); display: flex; align-items: center; justify-content: center; border: 1px solid rgba(12, 12, 11, 0.2); border-radius: 6px; grid-template-rows: 1fr; }
  .more-in { font-size: clamp(36px, 4vw, 64px); letter-spacing: -0.04em; font-weight: 600; transition: transform 0.6s var(--ease); }
  .more-in .serif { color: var(--heat); }
  .card.more:hover .more-in { transform: translateX(14px); }
  .work-progress { position: absolute; left: var(--pad); right: var(--pad); bottom: 26px; height: 1px; background: rgba(12, 12, 11, 0.15); z-index: 2; }
  .work-progress i { display: block; height: 100%; width: 0; background: var(--heat); }
  @media (max-width: 860px) {
    .work { height: auto; padding: 130px 0 60px; }
    .work-track { flex-direction: column; width: auto; height: auto; gap: 70px; align-items: stretch; }
    .work-intro, .card, .card.more { width: 100%; }
    .card { height: auto; } .art { aspect-ratio: 4/3; } .card.more { padding: 60px 0; }
    .meta { grid-template-columns: 1fr; } .work-progress { display: none; }
  }

  .w-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
  .w-title { font-size: clamp(48px, 7vw, 120px); line-height: 0.9; letter-spacing: -0.055em; font-weight: 700; margin-bottom: 60px; }
  .w-title .serif { color: var(--heat); font-weight: 400; letter-spacing: -0.02em; }
  .posts { list-style: none; border-top: 1px solid var(--line); }
  .posts a { display: grid; grid-template-columns: 160px 1fr 80px; gap: 20px; align-items: baseline; padding: 30px 0; border-bottom: 1px solid var(--line); transition: padding 0.5s var(--ease), color 0.3s; }
  .posts a:hover { padding-left: 18px; color: var(--heat); }
  .pt { font-size: clamp(24px, 2.6vw, 42px); letter-spacing: -0.035em; font-weight: 500; line-height: 1.05; }
  .posts a > :last-child { text-align: right; }
  @media (max-width: 760px) { .posts a { grid-template-columns: 1fr; gap: 6px; } .posts a > :last-child { text-align: left; } }

  .xp-list { border-top: 1px solid var(--line); }
  .xp-item { border-bottom: 1px solid var(--line); }
  .xp { position: relative; width: 100%; text-align: left; font: inherit; color: inherit; display: grid; grid-template-columns: 170px 1.1fr 1.3fr 200px; gap: 20px; align-items: center; padding: 34px 0; overflow: hidden; cursor: pointer; }
  .xp.static { cursor: default; }
  .xp.static::before { display: none; }
  .xp.static:hover > * { color: inherit; transform: none; }
  .xp.static:hover .role { color: var(--mute); }
  .plus { display: inline-block; position: relative; width: 12px; height: 12px; margin-left: 14px; vertical-align: middle; }
  .plus::before, .plus::after { content: ''; position: absolute; left: 0; top: 50%; width: 100%; height: 1px; background: currentColor; transition: transform 0.5s var(--ease); }
  .plus::after { transform: rotate(90deg); }
  .open .plus::after { transform: rotate(0deg); }
  .plus.ghost { visibility: hidden; }
  .xp-body { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 0.6s var(--ease); }
  .open .xp-body { grid-template-rows: 1fr; }
  .xp-inner { overflow: hidden; display: grid; grid-template-columns: 170px 1fr; column-gap: 20px; }
  .xp-group { grid-column: 2; padding-bottom: 26px; max-width: 900px; opacity: 0; transform: translateY(10px); transition: opacity 0.5s, transform 0.6s var(--ease); }
  .open .xp-group { opacity: 1; transform: none; transition-delay: 0.15s; }
  .g-title { color: var(--heat); margin-bottom: 12px; }
  .xp-group ul { list-style: none; display: grid; gap: 10px; }
  .xp-group li { position: relative; padding-left: 22px; color: rgba(236, 235, 228, 0.82); font-size: clamp(15px, 1.15vw, 18px); line-height: 1.45; }
  .xp-group li::before { content: '✦'; position: absolute; left: 0; top: 0.1em; font-size: 0.75em; color: var(--heat); }
  .xp::before { content: ''; position: absolute; inset: 0; background: var(--heat); transform: scaleY(0); transform-origin: bottom; transition: transform 0.6s var(--ease); z-index: 0; }
  .xp:hover::before { transform: scaleY(1); }
  .xp > * { position: relative; z-index: 1; transition: color 0.4s, transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1); }
  .xp:hover > * { color: var(--ink); }
  .xp:hover h4 { transform: translateX(16px); }
  .xp h4 { font-size: clamp(28px, 3.6vw, 58px); letter-spacing: -0.045em; font-weight: 600; line-height: 1; }
  .role { color: var(--mute); }
  .when { text-align: right; }
  @media (max-width: 760px) { .xp { grid-template-columns: 1fr; gap: 6px; } .when { text-align: left; } .xp-inner { grid-template-columns: 1fr; } .xp-group { grid-column: 1; } }

  .stack-wrap { display: grid; grid-template-columns: 1fr 2fr; gap: 6vw; }
  .stack-wrap h2 { font-size: clamp(48px, 6vw, 104px); letter-spacing: -0.055em; line-height: 0.9; font-weight: 700; position: sticky; top: 110px; align-self: start; }
  .stack-wrap h2 .serif { color: var(--heat); letter-spacing: -0.02em; }
  .group { border-top: 1px solid var(--line); padding: 26px 0 40px; }
  .group > .mono { color: var(--mute); margin-bottom: 18px; display: block; }
  .pills { display: flex; flex-wrap: wrap; gap: 10px; }
  .pill { font-size: clamp(20px, 2vw, 30px); letter-spacing: -0.03em; border: 1px solid var(--line); border-radius: 99px; padding: 10px 22px; position: relative; overflow: hidden; isolation: isolate; transition: color 0.4s, border-color 0.4s; }
  .pill::after { content: ''; position: absolute; inset: 0; background: var(--paper); border-radius: 99px; transform: translateY(101%); transition: transform 0.45s var(--ease); z-index: -1; }
  .pill:hover { color: var(--ink); border-color: var(--paper); }
  .pill:hover::after { transform: translateY(0); }
  @media (max-width: 860px) { .stack-wrap { grid-template-columns: 1fr; } .stack-wrap h2 { position: static; } }

  .quote { text-align: center; padding-block: clamp(120px, 16vw, 240px); }
  .quote blockquote { font-size: clamp(40px, 7.5vw, 130px); line-height: 0.95; letter-spacing: -0.05em; font-weight: 600; }
  .quote .serif { color: var(--heat); letter-spacing: -0.02em; }
  .quote cite { display: block; margin-top: 34px; font-style: normal; color: var(--mute); }
</style>
