import { component$ } from '@builder.io/qwik';
import { DocumentHead, routeLoader$ } from '@builder.io/qwik-city';
import ArticleList from '~/components/article-list/article-list';
import { getPostList } from '~/utils/markdown';
import { siteConfig } from '~/config/site';

export const usePostList = routeLoader$(async () => {
  return await getPostList();
});

export default component$(() => {
  const posts = usePostList();

  const description = (
    <p class="text-xl text-gray-400 silver-gradient-text">
      基于
      <a 
        href="https://qwik.builder.io" 
        target="_blank" 
        rel="noopener noreferrer"
        class="mx-1 hover:text-white transition-colors duration-300"
      >
        Qwik
      </a>
      秒启动框架，由
      <a 
        href="https://cursor.sh" 
        target="_blank" 
        rel="noopener noreferrer"
        class="mx-1 hover:text-white transition-colors duration-300"
      >
        Cursor
      </a>
      调用
      <a 
        href="https://www.anthropic.com/claude" 
        target="_blank" 
        rel="noopener noreferrer"
        class="mx-1 hover:text-white transition-colors duration-300"
      >
        Claude-3.5-Sonnet
      </a>
      进行自动化开发。
    </p>
  );

  return (
    <div class="content-container">
      <div class="content-wrapper">
        {/* 博客标题区域 */}
        <div class="text-center mb-16">
          <h1 class="text-5xl font-bold mb-4 animate-fade-in silver-gradient-text">{siteConfig.name}</h1>
          {description}
        </div>

        {/* 文章列表 */}
        <ArticleList articles={posts.value} />
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: siteConfig.title.default,
  meta: [
    {
      name: 'description',
      content: siteConfig.description,
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
