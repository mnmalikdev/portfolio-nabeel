import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type Lenis from 'lenis';
import { isHome } from '$lib/link';

export { gsap, ScrollTrigger };

let registered = false;
export function setupGsap() {
  if (registered || typeof window === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

export const reduced = () => typeof window !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/* first-visit intro (loader) — decided once per tab session, at module load */
export const intro = {
  pending: (() => {
    if (typeof window === 'undefined') return false;
    try {
      const first = !sessionStorage.getItem('nm-seen');
      sessionStorage.setItem('nm-seen', '1');
      return first && isHome() && !matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch { return false; }
  })()
};
export const whenIntroDone = (fn: () => void) => {
  if (!intro.pending) return fn();
  addEventListener('nm:intro', () => fn(), { once: true });
};

/* shared smooth-scroll instance */
export const scroll: { lenis: Lenis | null } = { lenis: null };

export function scrollTo(target: string | number | HTMLElement, immediate = false) {
  if (scroll.lenis) scroll.lenis.scrollTo(target as never, { immediate, duration: 1.4 });
  else if (typeof target === 'number') window.scrollTo({ top: target, behavior: immediate ? 'auto' : 'smooth' });
  else (typeof target === 'string' ? document.querySelector(target) : target)?.scrollIntoView({ behavior: 'smooth' });
}

/* ---- actions ---- */

/** Splits text nodes into .ch spans (keeps child elements as single units). */
export function splitChars(node: HTMLElement) {
  const kids = [...node.childNodes];
  node.textContent = '';
  for (const n of kids) {
    if (n.nodeType === 3) {
      for (const ch of n.textContent ?? '') {
        const s = document.createElement('span');
        s.className = 'ch';
        s.textContent = ch === ' ' ? ' ' : ch;
        node.appendChild(s);
      }
    } else {
      (n as HTMLElement).classList?.add('ch');
      node.appendChild(n);
    }
  }
  return node.querySelectorAll<HTMLElement>('.ch');
}

/** Fade/slide in when scrolled into view. use:reveal={{ y: 60, delay: .1 }} */
export function reveal(node: HTMLElement, opts: { y?: number; delay?: number; stagger?: number; children?: boolean } = {}) {
  if (reduced()) return;
  setupGsap();
  const targets = opts.children ? node.children : node;
  const tween = gsap.from(targets, {
    y: opts.y ?? 60,
    autoAlpha: 0,
    duration: 1.1,
    delay: opts.delay ?? 0,
    stagger: opts.stagger ?? 0.08,
    ease: 'power3.out',
    scrollTrigger: { trigger: node, start: 'top 88%' }
  });
  return { destroy: () => { tween.scrollTrigger?.kill(); tween.kill(); } };
}

/** Masked line reveal: wrap each line in .ln > span */
export function lines(node: HTMLElement, opts: { delay?: number; immediate?: boolean } = {}) {
  if (reduced()) return;
  setupGsap();
  const inner = node.querySelectorAll('.ln > span');
  const tween = gsap.from(inner, {
    yPercent: 110,
    rotate: 3,
    duration: 1.2,
    stagger: 0.08,
    delay: opts.delay ?? 0,
    ease: 'expo.out',
    scrollTrigger: opts.immediate ? undefined : { trigger: node, start: 'top 88%' }
  });
  return { destroy: () => { tween.scrollTrigger?.kill(); tween.kill(); } };
}

/** Rising characters for big titles */
export function chars(node: HTMLElement, opts: { delay?: number } = {}) {
  if (reduced()) return;
  setupGsap();
  const c = splitChars(node);
  const tween = gsap.from(c, { yPercent: 115, rotate: 6, duration: 1.2, stagger: 0.03, delay: opts.delay ?? 0.15, ease: 'expo.out' });
  return { destroy: () => tween.kill() };
}

/** Magnetic hover */
export function magnetic(node: HTMLElement, strength = 0.35) {
  if (matchMedia('(hover: none)').matches) return;
  const move = (e: PointerEvent) => {
    const r = node.getBoundingClientRect();
    gsap.to(node, { x: (e.clientX - r.left - r.width / 2) * strength, y: (e.clientY - r.top - r.height / 2) * strength, duration: 0.3, ease: 'power3.out' });
  };
  const leave = () => gsap.to(node, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, .4)' });
  node.addEventListener('pointermove', move);
  node.addEventListener('pointerleave', leave);
  return { destroy: () => { node.removeEventListener('pointermove', move); node.removeEventListener('pointerleave', leave); } };
}
