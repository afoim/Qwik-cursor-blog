import { component$, useVisibleTask$, useSignal } from '@builder.io/qwik';
import { routeLoader$, DocumentHead, Link } from '@builder.io/qwik-city';
import { getPost } from '~/utils/markdown';
import { siteConfig } from '~/config/site';

export const usePost = routeLoader$(async ({ params }) => {
  return await getPost(params.slug);
});

export default component$(() => {
  const post = usePost();
  const { frontmatter, html } = post.value;
  const isLoading = useSignal(true);
  const hasError = useSignal(false);
  const githubConnected = useSignal(false);

  useVisibleTask$(() => {
    console.log('初始化评论系统...');
    
    // 创建 utterances script
    const utterancesScript = document.createElement('script');
    utterancesScript.src = 'https://utteranc.es/client.js';
    const repo = 'afoim/Qwik-cursor-blog'; // 仓库配置
    utterancesScript.setAttribute('repo', repo);
    utterancesScript.setAttribute('issue-term', 'pathname');
    utterancesScript.setAttribute('label', 'utterances');
    utterancesScript.setAttribute('theme', 'github-dark');
    utterancesScript.setAttribute('crossorigin', 'anonymous');
    utterancesScript.async = true;
    
    // 先测试 GitHub API 连接，使用同样的仓库名
    fetch(`https://api.github.com/search/issues?q=repo:${repo}`)
      .then(response => {
        if (response.status === 200) {
          console.log('GitHub API 连接成功');
          githubConnected.value = true;
          // 1秒后隐藏加载界面
          setTimeout(() => {
            isLoading.value = false;
          }, 1000);
        }
      })
      .catch(error => {
        console.error('GitHub API 连接失败:', error);
        hasError.value = true;
      });

    const commentsDiv = document.getElementById('comments');
    if (commentsDiv) {
      commentsDiv.appendChild(utterancesScript);

      // 设置超时
      const timeout = setTimeout(() => {
        if (isLoading.value) {
          console.log('加载超时');
          hasError.value = true;
          isLoading.value = false;
        }
      }, 15000);

      return () => {
        clearTimeout(timeout);
      };
    }
  });

  return (
    <div class="content-container">
      <div class="content-wrapper max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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

          <div class="content-block">
            <div class="content-block-inner">
              <h2 class="text-2xl font-bold mb-4 silver-gradient-text">评论</h2>
              <div class="relative min-h-[200px]">
                <div id="comments" class="mt-4" />
                {(isLoading.value || hasError.value) && (
                  <div class="absolute inset-0 flex flex-col items-center justify-center space-y-4 py-8 bg-[rgb(10,10,12)]">
                    {isLoading.value ? (
                      <>
                        {githubConnected.value ? (
                          <>
                            <div class="text-green-400 mb-2">
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 animate-fade-out" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <p class="text-green-400 text-lg text-center mt-4 animate-fade-out">
                              与 GitHub 连接通畅，评论马上呈现！
                            </p>
                          </>
                        ) : (
                          <>
                            <div class="flex justify-center items-center">
                              <svg class="!p-0 !m-0 !border-0 !bg-transparent animate-spin" width="32" height="32" viewBox="0 0 16 16" fill="none" stroke="#666666">
                                <circle cx="8" cy="8" r="7" stroke-opacity="0.25" stroke-width="2" vector-effect="non-scaling-stroke"></circle>
                                <path d="M15 8a7.002 7.002 0 00-7-7" stroke-width="2" stroke-linecap="round" vector-effect="non-scaling-stroke"></path>
                              </svg>
                            </div>
                            <p class="text-gray-400 text-lg mt-4">正在连接 GitHub...</p>
                            <p class="text-gray-500 text-lg text-center mt-4">
                              评论基于 GitHub Issues
                              <br />
                              首次加载可能需要较长时间
                            </p>
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        <div class="text-red-400">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        </div>
                        <p class="text-red-400 text-lg">评论系统加载失败</p>
                        <p class="text-gray-500 text-lg text-center mt-2">
                          可��是由于网络问题无法连接到 GitHub
                          <br />
                          <button 
                            onClick$={() => window.location.reload()}
                            class="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 
                              rounded-lg transition-colors duration-300"
                          >
                            点击刷新重试
                          </button>
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
});

export const head: DocumentHead = ({ resolveValue }) => {
  const post = resolveValue(usePost);
  const description = `基于 Qwik 秒启动框架，由 Cursor 调用 Claude-3.5-Sonnet 进行自动化开发。${post.frontmatter.description}`;
  
  return {
    title: siteConfig.title.template.replace('%s', post.frontmatter.title),
    meta: [
      {
        name: 'description',
        content: description,
      },
      {
        name: 'author',
        content: siteConfig.name,
      },
      {
        property: 'og:title',
        content: post.frontmatter.title,
      },
      {
        property: 'og:description',
        content: description,
      },
      {
        property: 'og:type',
        content: 'article',
      },
      {
        name: 'twitter:card',
        content: 'summary',
      },
      {
        name: 'twitter:title',
        content: post.frontmatter.title,
      },
      {
        name: 'twitter:description',
        content: description,
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