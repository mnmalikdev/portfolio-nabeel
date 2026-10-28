import { error } from '@sveltejs/kit';
import { getProject, projects } from '$lib/content';

export const entries = () => projects.map((p) => ({ slug: p.slug }));

export function load({ params }) {
  const project = getProject(params.slug);
  if (!project) error(404, 'Project not found');
  const i = projects.findIndex((p) => p.slug === params.slug);
  return { ...project, next: projects[(i + 1) % projects.length] };
}
