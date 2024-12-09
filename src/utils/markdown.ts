import { useLocation } from '@builder.io/qwik-city';
import MarkdownIt from 'markdown-it';
import Prism from 'prismjs';
import taskLists from 'markdown-it-task-lists';
import sub from 'markdown-it-sub';
import sup from 'markdown-it-sup';
import mark from 'markdown-it-mark';
import footnote from 'markdown-it-footnote';
import katex from 'markdown-it-katex';
import type { Token } from 'markdown-it';
import { CodeBlock } from '~/components/code-block/code-block';

interface MarkdownItRenderer {
  renderToken: (tokens: Token[], idx: number, options: any) => string;
}

// 生成标题的锚点ID
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s]+/g, '-')     // 替换空格为连字符
    .replace(/[^\w\-]+/g, '')   // 移除非单词字符
    .replace(/\-\-+/g, '-')     // 替换多个连字符为单个
    .replace(/^-+/, '')         // 移除开头的连字符
    .replace(/-+$/, '');        // 移除结尾的连字符
}

// 初始化 markdown-it
const md: MarkdownIt = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    let highlighted = str;
    if (lang && Prism.languages[lang]) {
      try {
        highlighted = Prism.highlight(str, Prism.languages[lang], lang);
      } catch (__) {}
    }
    return `<pre class="language-${lang || 'text'}">${highlighted}</pre>`;
  }
});

// 修改代码块的渲染规则
md.renderer.rules.fence = function(tokens, idx) {
  const token = tokens[idx];
  const code = token.content;
  const lang = token.info || '';
  
  let highlighted = code;
  if (lang && Prism.languages[lang]) {
    try {
      highlighted = Prism.highlight(code, Prism.languages[lang], lang);
    } catch (err) {
      console.error('Failed to highlight:', err);
    }
  }

  return `
    <div class="code-block-wrapper">
      <pre class="language-${lang || 'text'}"><code>${highlighted}</code></pre>
      <button class="copy-button" aria-label="Copy code">
        <svg class="copy-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
        <svg class="success-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </button>
    </div>
  `;
};

// 添加标题锚点功能
md.renderer.rules.heading_open = function (tokens: Token[], idx: number, options: any, env: any, self: MarkdownItRenderer) {
  const token = tokens[idx];
  const nextToken = tokens[idx + 1];
  const title = nextToken.content;
  
  if (token.tag === 'h1' || token.tag === 'h2' || token.tag === 'h3' || 
      token.tag === 'h4' || token.tag === 'h5' || token.tag === 'h6') {
    return `<${token.tag} id="${slugify(title)}"><a href="#${slugify(title)}" class="no-underline hover:translate-x-4 transition-transform duration-300 inline-block w-full">`;
  }
  return self.renderToken(tokens, idx, options);
};

md.renderer.rules.heading_close = function (tokens: Token[], idx: number, options: any, env: any, self: MarkdownItRenderer) {
  const token = tokens[idx];
  if (token.tag === 'h1' || token.tag === 'h2' || token.tag === 'h3' || 
      token.tag === 'h4' || token.tag === 'h5' || token.tag === 'h6') {
    return `</a></${token.tag}>`;
  }
  return self.renderToken(tokens, idx, options);
};

md.use(taskLists, { enabled: true })
  .use(sub)
  .use(sup)
  .use(mark)
  .use(footnote)
  .use(katex);

export interface PostMetadata {
  title: string;
  description: string;
  date: string;
  tags: string[];
  slug: string;
  content?: string;
}

export async function getPostList(): Promise<PostMetadata[]> {
  const posts = import.meta.glob<string>('/src/content/posts/*.md', { 
    query: '?raw',
    import: 'default',
    eager: true
  }) as Record<string, string>;
  
  return Object.entries(posts).map(([path, content]) => {
    const slug = path.split('/').pop()?.replace('.md', '') || '';
    const { frontmatter, body } = parseMarkdown(content);
    return {
      ...frontmatter,
      slug,
      content: body
    };
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getPost(slug: string) {
  const posts = import.meta.glob<string>('/src/content/posts/*.md', { 
    query: '?raw',
    import: 'default',
    eager: true
  }) as Record<string, string>;
  
  const path = `/src/content/posts/${slug}.md`;
  const content = posts[path];
  
  if (!content) {
    throw new Error(`Post not found: ${slug}`);
  }

  return parseMarkdown(content);
}

function parseMarkdown(content: string) {
  try {
    // 首先标准化换行符
    const normalizedContent = content.replace(/\r\n/g, '\n');
    const [frontmatterStr, ...bodyParts] = normalizedContent.split('---\n').filter(Boolean);
    const frontmatter = parseFrontmatter(frontmatterStr);
    const body = bodyParts.join('---\n');
    const html = md.render(body);

    return {
      frontmatter,
      body,
      html
    };
  } catch (error) {
    console.error('Error parsing markdown:', error);
    if (error instanceof Error) {
      throw new Error(`解析 Markdown 失败: ${error.message}`);
    }
    throw new Error('解析 Markdown 失败');
  }
}

function parseFrontmatter(frontmatterStr: string): PostMetadata {
  const frontmatter: Record<string, any> = {};
  const lines = frontmatterStr.split('\n');

  for (const line of lines) {
    const [key, ...valueParts] = line.split(':').map(part => part.trim());
    if (key && valueParts.length) {
      let value = valueParts.join(':');
      // 处理数组（例如 tags）
      if (value.startsWith('[') && value.endsWith(']')) {
        // 将单引号替换为双引号
        value = value.replace(/'/g, '"');
        try {
          value = JSON.parse(value);
        } catch (e) {
          // 如果解析失败尝试简单的分方法
          value = value
            .slice(1, -1) // 移除 [ ]
            .split(',')
            .map(item => item.trim().replace(/['"]/g, '')); // 移除引号并清理空格
        }
      }
      frontmatter[key] = value;
    }
  }

  return frontmatter as PostMetadata;
}

// 添加复制按钮功能
export function addCopyButtons() {
  const copyButtons = document.querySelectorAll('.copy-button');
  
  copyButtons.forEach(button => {
    button.addEventListener('click', async () => {
      const codeElement = button.closest('.code-block-wrapper')?.querySelector('code');
      if (!codeElement) return;
      
      const code = codeElement.textContent || '';
      
      try {
        await navigator.clipboard.writeText(code);
        button.classList.add('copy-success');
        
        setTimeout(() => {
          button.classList.remove('copy-success');
        }, 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    });
  });
}