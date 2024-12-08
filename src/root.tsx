import { component$, useSignal, useVisibleTask$, useStyles$ } from '@builder.io/qwik';
import {
  QwikCityProvider,
  RouterOutlet,
  ServiceWorkerRegister,
} from "@builder.io/qwik-city";
import { RouterHead } from "./components/router-head/router-head";
import { isDev } from "@builder.io/qwik/build";

import "./global.css";
import 'prismjs/themes/prism-tomorrow.css';
import 'katex/dist/katex.min.css';

export default component$(() => {
  const progress = useSignal(0);
  const loadingText = useSignal('');
  const isLoading = useSignal(true);

  // 添加进度条样式
  useStyles$(`
    .loading-bar {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background: linear-gradient(
        to right,
        rgba(255, 255, 255, 0.2),
        rgba(255, 255, 255, 0.4)
      );
      z-index: 9999;
      transition: transform 0.2s ease;
    }

    .loading-bar::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.8),
        transparent
      );
      animation: shimmer 1.5s infinite;
    }

    .loading-text {
      position: fixed;
      top: 8px;
      right: 16px;
      color: rgba(255, 255, 255, 0.8);
      font-size: 14px;
      z-index: 9999;
      background: rgba(0, 0, 0, 0.5);
      padding: 4px 12px;
      border-radius: 16px;
      backdrop-filter: blur(4px);
      transition: opacity 0.3s ease;
    }

    @keyframes shimmer {
      0% {
        transform: translateX(-100%);
      }
      100% {
        transform: translateX(100%);
      }
    }
  `);

  // 监听资源加载
  useVisibleTask$(() => {
    const startTime = Date.now();
    const resources = performance.getEntriesByType('resource');
    const totalResources = resources.length;
    let loadedResources = 0;

    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        loadedResources++;
        const percent = (loadedResources / totalResources) * 100;
        progress.value = Math.min(percent, 99);

        // 更新加载文本
        const resourceType = entry.initiatorType;
        const resourceName = entry.name.split('/').pop() || '';
        loadingText.value = `正在加载${resourceType}: ${resourceName}`;
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

  /**
   * The root of a QwikCity site always start with the <QwikCityProvider> component,
   * immediately followed by the document's <head> and <body>.
   *
   * Don't remove the `<head>` and `<body>` elements.
   */

  return (
    <QwikCityProvider>
      <head>
        <meta charset="utf-8" />
        {!isDev && (
          <link
            rel="manifest"
            href={`${import.meta.env.BASE_URL}manifest.json`}
          />
        )}
        <RouterHead />
      </head>
      <body lang="en">
        {/* 加载进度条 */}
        {isLoading.value && (
          <>
            <div 
              class="loading-bar" 
              style={{
                transform: `scaleX(${progress.value / 100})`,
                opacity: progress.value === 100 ? '0' : '1',
              }}
            />
            <div 
              class="loading-text"
              style={{
                opacity: progress.value === 100 ? '0' : '1',
              }}
            >
              {loadingText.value}
            </div>
          </>
        )}
        <RouterOutlet />
        {!isDev && <ServiceWorkerRegister />}
      </body>
    </QwikCityProvider>
  );
});
