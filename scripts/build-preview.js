// Builds a hash-routed copy of the site (#/blog/) for hosts that can only serve index.html.
// Hash routing forbids server routes and page options, so for the duration of the build
// the RSS endpoint is parked and page-option exports are stripped. Everything is restored after.
import { renameSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const rss = 'src/routes/rss.xml', parked = '.rss.xml.parked';
const withOptions = ['src/routes/+layout.ts', 'src/routes/blog/[slug]/+page.ts', 'src/routes/projects/[slug]/+page.ts'];
const originals = new Map(withOptions.map((f) => [f, readFileSync(f, 'utf8')]));

if (existsSync(rss)) renameSync(rss, parked);
for (const [f, src] of originals)
  writeFileSync(f, src.replace(/^export const (prerender|ssr|csr|trailingSlash|entries)\b.*$/gm, '') || 'export {};\n');
try {
  execSync('vite build', { stdio: 'inherit', env: { ...process.env, PREVIEW: '1' } });
  // the SPA fallback page is written with root-absolute asset URLs; make them relative so it works from any folder
  const html = 'build/index.html';
  writeFileSync(html, readFileSync(html, 'utf8').replaceAll('"/app/', '"./app/').replaceAll('"/favicon.svg"', '"./favicon.svg"'));
} finally {
  for (const [f, src] of originals) writeFileSync(f, src);
  if (existsSync(parked)) renameSync(parked, rss);
}
