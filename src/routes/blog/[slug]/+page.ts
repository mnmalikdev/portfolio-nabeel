import { error } from '@sveltejs/kit';
import { getPost, posts } from '$lib/content';

export const entries = () => posts.map((p) => ({ slug: p.slug }));

export function load({ params }) {
  const post = getPost(params.slug);
  if (!post) error(404, 'Post not found');
  const i = posts.findIndex((p) => p.slug === params.slug);
  return { ...post, newer: posts[i - 1] ?? null, older: posts[i + 1] ?? null };
}
