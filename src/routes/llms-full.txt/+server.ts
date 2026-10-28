import { llmsTxt } from '$lib/llms';
export const prerender = true;
export const GET = () => new Response(llmsTxt(true), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
