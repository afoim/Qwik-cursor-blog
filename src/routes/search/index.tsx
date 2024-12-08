import { component$, useSignal, useTask$, $ } from '@builder.io/qwik';
import { routeLoader$, Link } from '@builder.io/qwik-city';
import { getPostList } from '~/utils/markdown';
import { siteConfig } from '~/config/site';

interface Post {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags?: string[];
  content?: string;
}

// 获取所有文章和标签
export const usePosts = routeLoader$(async () => {
  const posts = await getPostList();
  return {
    posts,
    tags: Array.from(new Set(posts.flatMap(post => post.tags || [])))
  };
});

export default component$(() => {
  const postsData = usePosts();
  const searchQuery = useSignal('');
  const selectedTags = useSignal<string[]>([]);
  const filteredPosts = useSignal<Post[]>(postsData.value.posts);
  const searchResults = useSignal<{ post: Post; matches: string[] }[]>([]);

  // 高亮文本的辅助函数
  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === query.toLowerCase() ? 
        <mark key={i} class="bg-white/20 text-white px-1 rounded">{part}</mark> : 
        part
    );
  };

  // 从内容中提取匹配的上下文
  const extractContext = $((content: string, query: string, contextLength = 100) => {
    if (!query || !content) return [];
    const matches: string[] = [];
    const regex = new RegExp(query, 'gi');
    let match;
    
    // 移除 Markdown 语法
    const plainText = content
      .replace(/```[\s\S]*?```/g, '') // 移除代码块
      .replace(/`.*?`/g, '')          // 移除行内代码
      .replace(/\[.*?\]\(.*?\)/g, '') // 移除链接
      .replace(/[#*_~]/g, '')         // 移除标记符号
      .replace(/\n+/g, ' ')           // 将换行替换为空格
      .trim();
    
    while ((match = regex.exec(plainText)) !== null) {
      const start = Math.max(0, match.index - contextLength);
      const end = Math.min(plainText.length, match.index + query.length + contextLength);
      let context = plainText.slice(start, end);
      
      // 添加省略号
      if (start > 0) context = '...' + context;
      if (end < plainText.length) context = context + '...';
      
      matches.push(context);
    }
    
    return matches;
  });

  // 当搜索条件改变时过滤文章
  useTask$(async ({ track }) => {
    track(() => searchQuery.value);
    track(() => selectedTags.value);

    const query = searchQuery.value.toLowerCase();
    const filtered = postsData.value.posts.filter(post => {
      const matchesTags = selectedTags.value.length === 0 ||
        selectedTags.value.every(tag => post.tags?.includes(tag));

      if (!matchesTags) return false;

      if (!query) return true;

      return (
        post.title.toLowerCase().includes(query) ||
        post.description.toLowerCase().includes(query) ||
        (post.content?.toLowerCase() || '').includes(query)
      );
    });

    // 为每个匹配的文章提取上下文
    const results = await Promise.all(
      filtered.map(async post => ({
        post,
        matches: await extractContext(post.content || '', query)
      }))
    );

    searchResults.value = results;
    filteredPosts.value = filtered;
  });

  return (
    <div class="content-container min-h-screen">
      <div class="content-wrapper max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 返回首页 */}
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
            <span class="text-white/80 hover:text-white transition-colors duration-300">
              返回{siteConfig.name}
            </span>
          </Link>
        </div>

        {/* 搜索框 */}
        <div class="content-block mb-8">
          <div class="content-block-inner">
            <div class="relative">
              <input
                type="text"
                value={searchQuery.value}
                onInput$={(e) => searchQuery.value = (e.target as HTMLInputElement).value}
                placeholder="搜索文章标题、描述和内容..."
                class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg 
                  focus:outline-none focus:border-white/20 text-white/90 placeholder-white/50
                  transition-all duration-300"
              />
              <svg
                class="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50"
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
            </div>
          </div>
        </div>

        {/* 标签过滤器 */}
        <div class="content-block mb-8">
          <div class="content-block-inner">
            <h2 class="text-xl font-bold mb-6 silver-gradient-text">标签筛选</h2>
            <div class="flex flex-wrap gap-3">
              {postsData.value.tags.map(tag => (
                <button
                  key={tag}
                  onClick$={() => {
                    if (selectedTags.value.includes(tag)) {
                      selectedTags.value = selectedTags.value.filter(t => t !== tag);
                    } else {
                      selectedTags.value = [...selectedTags.value, tag];
                    }
                  }}
                  class={[
                    'group relative overflow-hidden rounded-full px-4 py-2 backdrop-blur-sm transition-all duration-500 ease-out',
                    selectedTags.value.includes(tag)
                      ? 'bg-white/20 text-white'
                      : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                  ]}
                >
                  <span class="relative z-10 flex items-center gap-2">
                    {tag}
                    <span class="text-sm opacity-50">
                      {postsData.value.posts.filter(post => post.tags?.includes(tag)).length}
                    </span>
                  </span>
                  <div class={[
                    'absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0',
                    'transition-opacity duration-500 ease-out',
                    selectedTags.value.includes(tag) ? 'opacity-100' : 'opacity-0'
                  ]}/>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 搜索结果 */}
        <div class="content-block">
          <div class="content-block-inner">
            <h2 class="text-xl font-bold mb-6 silver-gradient-text">
              搜索结果 ({filteredPosts.value.length})
            </h2>
            {filteredPosts.value.length > 0 ? (
              <div class="space-y-6">
                {searchResults.value.map(({ post, matches }) => (
                  <article key={post.slug} class="group">
                    <Link
                      href={`/p/${post.slug}`}
                      class="block p-6 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] 
                        border border-white/10 hover:border-white/20
                        transition-all duration-300 hover:-translate-y-1"
                    >
                      <div class="flex flex-col">
                        <h3 class="text-xl font-bold mb-2 silver-gradient-text">
                          {highlightText(post.title, searchQuery.value)}
                        </h3>
                        <p class="text-white/70 mb-4 text-sm sm:text-base">
                          {highlightText(post.description, searchQuery.value)}
                        </p>
                        {/* 显示内容匹配 */}
                        {matches.length > 0 && (
                          <div class="mb-4 space-y-2">
                            {matches.map((match, index) => (
                              <p key={index} class="text-sm text-white/60 bg-white/5 p-2 rounded">
                                {highlightText(match, searchQuery.value)}
                              </p>
                            ))}
                          </div>
                        )}
                        <div class="flex flex-wrap items-center gap-3 mt-auto">
                          <time class="text-sm text-white/50">
                            {post.date}
                          </time>
                          <div class="flex flex-wrap gap-2">
                            {post.tags?.map(tag => (
                              <span
                                key={tag}
                                class={[
                                  'text-xs px-2 py-1 rounded-full transition-all duration-300',
                                  selectedTags.value.includes(tag)
                                    ? 'bg-white/20 text-white'
                                    : 'bg-white/5 text-white/70'
                                ]}
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
            ) : (
              <div class="text-center py-12">
                <p class="text-white/50">没有找到匹配的文章</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}); 