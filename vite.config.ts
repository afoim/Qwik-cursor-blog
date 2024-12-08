/**
 * This is the base config for vite.
 * When building, the adapter config is used which loads this file and extends it.
 */
import { defineConfig } from "vite";
import { qwikVite } from "@builder.io/qwik/optimizer";
import { qwikCity } from "@builder.io/qwik-city/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { plugin as markdown } from "vite-plugin-markdown";
import fs from 'node:fs';
import path from 'node:path';

// 获取所有文章的 slug
const postsDir = path.join(__dirname, 'src/content/posts');
const posts = fs.readdirSync(postsDir)
  .filter(file => file.endsWith('.md'))
  .map(file => file.replace('.md', ''));

/**
 * Note that Vite normally starts from `index.html` but the qwikCity plugin makes start at `src/entry.ssr.tsx` instead.
 */
export default defineConfig(() => {
  return {
    plugins: [
      qwikCity({
        routesDir: "src/routes",
        mdx: {
          remarkPlugins: [],
          rehypePlugins: [],
        },
        trailingSlash: true,
        buildStaticPaths: () => {
          return [
            "/",
            "/search",
            ...posts.map(slug => `/p/${slug}/`),
          ];
        },
      }),
      qwikVite(),
      tsconfigPaths(),
      markdown({ mode: ['html'] as any }),
    ],
    preview: {
      headers: {
        "Cache-Control": "public, max-age=600",
      },
    },
    optimizeDeps: {
      include: ['markdown-it', 'prismjs'],
    },
  };
});
