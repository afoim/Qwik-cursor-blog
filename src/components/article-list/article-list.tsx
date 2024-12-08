import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';

export interface Article {
  title: string;
  description: string;
  date: string;
  tags: string[];
  slug: string;
}

interface ArticleListProps {
  articles?: Article[];
}

export default component$<ArticleListProps>(({ articles = [] }) => {
  return (
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {articles.length === 0 ? (
        <div class="col-span-full text-center text-gray-400">
          还没有文章，开始写作吧！
        </div>
      ) : (
        articles.map((article) => (
          <Link 
            key={article.slug}
            href={`/p/${article.slug}`}
            class="block hover:no-underline group"
          >
            <article class="content-block transition-all duration-300 hover:-translate-y-1">
              <div class="content-block-inner">
                <h2 class="text-2xl font-bold mb-2 silver-gradient-text">{article.title}</h2>
                <p class="text-gray-400 mb-4 silver-gradient-text">{article.description}</p>
                <div class="flex items-center text-sm">
                  <time class="silver-gradient-text">{article.date}</time>
                  <span class="mx-2 text-gray-600">•</span>
                  <div class="flex gap-2">
                    {article.tags?.map((tag) => (
                      <span 
                        key={tag} 
                        class="bg-white/5 backdrop-blur-sm px-2 py-1 rounded-full text-xs silver-gradient-text"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          </Link>
        ))
      )}
    </div>
  );
}); 