import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import pinyin from 'pinyin/lib/index.js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      resolve(answer);
    });
  });
};

function titleToSlug(title: string): string {
  // 将标题转换为拼音
  const pinyinArray = pinyin(title, {
    style: 0, // STYLE_NORMAL 的值是 0
    segment: true // 启用分词
  });
  
  // 将拼音数组转换为字符串
  return pinyinArray
    .flat() // 展平数组
    .join('-') // 用连字符连接
    .toLowerCase() // 转小写
    .replace(/[^a-z0-9-]/g, ''); // 移除非法字符，修复了转义字符警告
}

async function createPost() {
  // 获取文章信息
  const title = await question('文章标题: ');
  const description = await question('文章描述: ');
  const customSlug = await question('短链接 (可选，留空将使用拼音): ');
  const tagsInput = await question('标签 (用逗号分隔): ');
  const tags = tagsInput ? tagsInput.split(',').map(tag => tag.trim()) : ['未分类'];
  
  // 生成文件名（slug）
  const date = new Date().toISOString().split('T')[0];
  const slug = customSlug.trim() || titleToSlug(title);
  
  // 生成文章内容
  const content = `---
title: ${title}
description: ${description}
date: ${date}
tags: ["${tags.join('", "')}"]
slug: ${slug}
---

${description}

在这里写入文章内容...
`;

  // 确保目录存在
  const postsDir = path.join(process.cwd(), 'src', 'content', 'posts');
  if (!fs.existsSync(postsDir)) {
    fs.mkdirSync(postsDir, { recursive: true });
  }

  // 写入文件
  const filePath = path.join(postsDir, `${slug}.md`);
  
  // 检查文件是否已存在
  if (fs.existsSync(filePath)) {
    console.log(`\n❌ 错误：文件 ${slug}.md 已存在！`);
    rl.close();
    return;
  }

  fs.writeFileSync(filePath, content);

  console.log(`\n✅ 文章创建成功！`);
  console.log(`📝 文件位置: ${filePath}`);
  console.log(`🔗 访问链接: /p/${slug}`);
  
  rl.close();
}

createPost().catch(console.error); 