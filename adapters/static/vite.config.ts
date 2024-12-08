import { staticAdapter } from "@builder.io/qwik-city/adapters/static/vite";
import { extendConfig } from "@builder.io/qwik-city/vite";
import baseConfig from "../../vite.config";
import fs from 'node:fs';
import path from 'node:path';

export default extendConfig(baseConfig, () => {
  // 直接读取 posts 目录
  const postsDir = path.join(__dirname, '../../src/content/posts');
  const posts = fs.readdirSync(postsDir)
    .filter(file => file.endsWith('.md'))
    .map(file => file.replace('.md', ''));
  
  return {
    build: {
      ssr: true,
      rollupOptions: {
        input: ["@qwik-city-plan"],
      },
    },
    plugins: [
      staticAdapter({
        origin: "https://2x.mk",
        // 修改为正确的静态生成配置
        staticPaths: [
          '/',
          '/search',
          ...posts.map(slug => `/p/${slug}/`),
        ],
        // 添加动态路由配置
        ssg: {
          include: ['/p/*'],
          origin: 'https://2x.mk',
        },
      }),
    ],
  };
});
