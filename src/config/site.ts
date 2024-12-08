export interface SiteConfig {
  // 基础信息
  name: string;
  description: string;
  favicon: string;
  
  // SEO
  title: {
    default: string;
    template: string;
  };
  
  // 社交链接
  links: {
    github?: string;
    twitter?: string;
    email?: string;
  };
}

export const siteConfig: SiteConfig = {
  name: "AcoFork的技术博客",
  description: "基于Qwik秒启动框架，由Cursor调用Claude-3.5-Sonnet进行自动化开发。",
  favicon: "https://q2.qlogo.cn/headimg_dl?dst_uin=2973517380&spec=5",
  
  title: {
    default: "AcoFork的技术博客",
    template: "%s - AcoFork的技术博客"
  },
  
  links: {
    github: "https://github.com/yourusername",
    email: "your.email@example.com"
  }
}; 