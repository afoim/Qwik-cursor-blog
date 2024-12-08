import { component$ } from '@builder.io/qwik';
import { DocumentHead, routeLoader$, Link } from '@builder.io/qwik-city';
import { getPostList } from '~/utils/markdown';
import { siteConfig } from '~/config/site';

interface Post {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  content: string;
}

export const usePostList = routeLoader$(async () => {
  const posts = await getPostList();
  return posts.map(post => ({
    slug: post.slug,
    title: post.title,
    description: post.description,
    date: post.date,
    tags: post.tags || [],
    content: post.content || ''
  })) as Post[];
});

export default component$(() => {
  const posts = usePostList();

  return (
    <div class="content-container">
      <div class="content-wrapper max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 博客标题区域 */}
        <div class="max-w-3xl mx-auto text-center mb-16 animate-fade-in">
          <h1 class="text-4xl sm:text-5xl font-bold mb-4 silver-gradient-text">{siteConfig.name}</h1>
          <p class="text-lg sm:text-xl text-gray-400">
            基于<a href="https://qwik.builder.io" target="_blank" rel="noopener noreferrer" class="text-white hover:text-gray-300 transition-colors duration-300">Qwik</a>秒启动框架，
            由<a href="https://cursor.sh" target="_blank" rel="noopener noreferrer" class="text-white hover:text-gray-300 transition-colors duration-300">Cursor</a>调用<a href="https://www.anthropic.com/claude" target="_blank" rel="noopener noreferrer" class="text-white hover:text-gray-300 transition-colors duration-300">Claude-3.5-Sonnet</a>进行自动化开发。
          </p>
        </div>

        {/* 顶部搜索栏 */}
        <div class="max-w-2xl mx-auto mb-12 animate-fade-in" style="animation-delay: 100ms;">
          <div class="content-block">
            <div class="content-block-inner">
              <Link 
                href="/search" 
                class="block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg 
                  hover:bg-white/[0.075] hover:border-white/20 
                  transition-all duration-300 group"
              >
                <div class="flex items-center">
                  <svg
                    class="w-5 h-5 text-white/50 group-hover:text-white/70 transition-colors duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <span class="ml-3 text-white/50 group-hover:text-white/70 transition-colors duration-300">
                    搜索文章...
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* 标签统计 */}
        <div class="max-w-5xl mx-auto mb-12 animate-fade-in" style="animation-delay: 200ms;">
          <div class="content-block">
            <div class="content-block-inner">
              <div class="flex flex-wrap gap-4">
                {Array.from(new Set(posts.value.flatMap(post => post.tags))).map(tag => (
                  <Link
                    key={tag}
                    href={`/search?tag=${tag}`}
                    class="group flex items-center gap-2 px-3 py-1.5 
                      bg-white/5 hover:bg-white/10 
                      border border-white/10 hover:border-white/20 
                      rounded-full transition-all duration-300"
                  >
                    <span class="text-white/70 group-hover:text-white transition-colors duration-300">
                      {tag}
                    </span>
                    <span class="px-1.5 py-0.5 text-xs 
                      bg-white/10 group-hover:bg-white/20 
                      text-white/70 group-hover:text-white 
                      rounded-full transition-all duration-300">
                      {posts.value.filter(post => post.tags.includes(tag)).length}篇
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 文章列表 */}
        <div class="max-w-5xl mx-auto animate-fade-in" style="animation-delay: 300ms;">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.value.map(post => (
              <article key={post.slug} class="content-block group">
                <Link
                  href={`/p/${post.slug}`}
                  class="block h-full"
                >
                  <div class="content-block-inner h-full flex flex-col">
                    <h2 class="text-xl sm:text-2xl font-bold mb-3 silver-gradient-text line-clamp-2">
                      {post.title}
                    </h2>
                    <p class="text-white/70 mb-4 line-clamp-2 text-sm sm:text-base flex-grow">
                      {post.description}
                    </p>
                    <div class="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mt-auto">
                      <time class="text-sm text-white/50 order-2 sm:order-1">
                        {post.date}
                      </time>
                      <div class="flex flex-wrap gap-2 order-1 sm:order-2">
                        {post.tags?.map(tag => (
                          <span
                            key={tag}
                            class="text-xs sm:text-sm px-2 py-1 rounded-full 
                              bg-gradient-to-r from-white/5 to-white/10 
                              hover:from-white/10 hover:to-white/20 
                              text-white/70 hover:text-white 
                              transition-all duration-300
                              border border-white/10 hover:border-white/20"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: siteConfig.title.default,
  meta: [
    {
      name: "description",
      content: siteConfig.description,
    },
    {
      name: "author",
      content: siteConfig.name,
    },
    {
      property: "og:title",
      content: siteConfig.title.default,
    },
    {
      property: "og:description",
      content: siteConfig.description,
    },
    {
      property: "og:type",
      content: "website",
    },
    {
      name: "twitter:card",
      content: "summary",
    },
    {
      name: "twitter:title",
      content: siteConfig.title.default,
    },
    {
      name: "twitter:description",
      content: siteConfig.description,
    },
  ],
  links: [
    {
      rel: "icon",
      href: siteConfig.favicon,
      type: "image/x-icon",
    },
  ],
};
