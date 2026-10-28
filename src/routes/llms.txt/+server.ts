import { llmsTxt } from '$lib/llms';
export const prerender = true;
export const GET = () => new Response(llmsTxt(false), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
