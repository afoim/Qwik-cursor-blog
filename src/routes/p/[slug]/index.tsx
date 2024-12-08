import { component$ } from '@builder.io/qwik';
import { routeLoader$, DocumentHead, Link } from '@builder.io/qwik-city';
import { getPost } from '~/utils/markdown';
import { siteConfig } from '~/config/site';

export const usePost = routeLoader$(async ({ params }) => {
  return await getPost(params.slug);
});

export default component$(() => {
  const post = usePost();
  const { frontmatter, html } = post.value;

  return (
    <div class="content-container">
      <div class="content-wrapper">
        <div class="mb-8">
          <Link href="/" class="inline-flex items-center group">
            <span class="inline-block w-8 h-8 mr-2 rounded-full bg-white/10 backdrop-blur-sm 
              flex items-center justify-center transition-all duration-300 
              group-hover:bg-white/20 group-hover:scale-110">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                class="w-5 h-5 text-white/80 transition-transform duration-300 group-hover:-translate-x-1" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M15 19l-7-7 7-7" 
                />
              </svg>
            </span>
            <span class="text-white/80 hover:text-white transition-colors duration-300">返回{siteConfig.name}</span>
          </Link>
        </div>

        <article class="prose prose-invert mx-auto">
          <div class="content-block">
            <div class="content-block-inner">
              <h1 class="text-4xl font-bold mb-4 silver-gradient-text">
                {frontmatter.title}
              </h1>
              <div class="flex items-center gap-4 text-gray-400 mb-4">
                <time class="silver-gradient-text">{frontmatter.date}</time>
                <div class="flex gap-2">
                  {frontmatter.tags?.map((tag: string) => (
                    <span key={tag} class="bg-gray-700/50 backdrop-blur-sm px-2 py-1 rounded-full text-sm silver-gradient-text">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <p class="text-xl border-l-4 border-gray-700/50 pl-4 silver-gradient-text">
                {frontmatter.description}
              </p>
            </div>
          </div>

          <div class="content-block">
            <div class="content-block-inner" dangerouslySetInnerHTML={html} />
          </div>
        </article>
      </div>
    </div>
  );
});

export const head: DocumentHead = ({ resolveValue }) => {
  const post = resolveValue(usePost);
  return {
    title: siteConfig.title.template.replace('%s', post.frontmatter.title),
    meta: [
      {
        name: 'description',
        content: post.frontmatter.description,
      },
    ],
    links: [
      {
        rel: 'icon',
        href: siteConfig.favicon,
        type: 'image/x-icon',
      },
    ],
  };
}; 