// Internal link helper. Normal builds use real paths (/blog/).
// `PREVIEW=1 npm run build` switches to hash routing (#/blog/) for hosts that can't serve nested paths.
export const PREVIEW = __PREVIEW__;
export const href = (path: string) => (PREVIEW ? '#' + path : path);
export const isHome = () => (PREVIEW ? !location.hash || location.hash === '#/' : location.pathname === '/');
