import { component$ } from '@builder.io/qwik';
import { routeLoader$, DocumentHead } from '@builder.io/qwik-city';
import { getPost } from '~/utils/markdown';

export const usePost = routeLoader$(async ({ params }) => {
  return await getPost(params.slug);
});

export default component$(() => {
  const post = usePost();
  const { frontmatter, html } = post.value;

  return (
    <div class="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div class="container mx-auto px-4 py-16">
        <article class="prose prose-invert mx-auto">
          <div class="mb-8">
            <h1 class="text-4xl font-bold mb-4">{frontmatter.title}</h1>
            <div class="flex items-center gap-4 text-gray-400">
              <time>{frontmatter.date}</time>
              <div class="flex gap-2">
                {frontmatter.tags?.map((tag: string) => (
                  <span key={tag} class="bg-gray-700 px-2 py-1 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div dangerouslySetInnerHTML={html} />
        </article>
      </div>
    </div>
  );
});

export const head: DocumentHead = ({ resolveValue }) => {
  const post = resolveValue(usePost);
  return {
    title: `${post.frontmatter.title} - 我的技术博客`,
  };
}; 