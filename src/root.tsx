import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import {
  QwikCityProvider,
  RouterOutlet,
  ServiceWorkerRegister,
} from "@builder.io/qwik-city";
import { RouterHead } from "./components/router-head/router-head";

import "./global.css";
import 'prismjs/themes/prism-tomorrow.css';
import 'katex/dist/katex.min.css';

export default component$(() => {
  const isLoading = useSignal(true);
  const progress = useSignal(0);
  const loadingText = useSignal('');

  // 监听资源加载
  useVisibleTask$(() => {
    const resources = performance.getEntriesByType('resource');
    const totalResources = resources.length;
    let loadedResources = 0;

    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry: any) => {
        loadedResources++;
        const percent = (loadedResources / totalResources) * 100;
        progress.value = Math.min(percent, 99);

        // 更新加载文本
        const resourceType = entry.initiatorType;
        const resourceName = entry.name.split('/').pop() || '';
        loadingText.value = `正在加载${resourceType === 'font' ? '字体' : resourceType}: ${resourceName}`;
      });
    });

    observer.observe({ entryTypes: ['resource'] });

    // 设置一个定时器来模拟最终加载完成
    setTimeout(() => {
      progress.value = 100;
      loadingText.value = '加载完成！';
      setTimeout(() => {
        isLoading.value = false;
      }, 500);
    }, 1000);

    return () => observer.disconnect();
  });

  return (
    <QwikCityProvider>
      <head>
        <meta charSet="utf-8" />
        <link rel="manifest" href="/manifest.json" />
        <RouterHead />
      </head>
      <body lang="en">
        {/* 加载提示 */}
        {isLoading.value && (
          <div class="fixed top-0 left-0 right-0 z-50 flex flex-col items-center">
            <div class="w-full h-[1px] relative overflow-hidden">
              <div 
                class="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                style={{ 
                  transform: `translateX(${progress.value - 100}%)`,
                  transition: 'transform 0.3s ease-out'
                }}
              />
            </div>
            <div class="text-xs text-white/40 mt-1 px-2 py-0.5 rounded-sm bg-white/5">
              {loadingText.value}
            </div>
          </div>
        )}
        <RouterOutlet />
        <ServiceWorkerRegister />
      </body>
    </QwikCityProvider>
  );
});
