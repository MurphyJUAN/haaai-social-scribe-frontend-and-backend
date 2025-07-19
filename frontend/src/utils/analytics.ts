// src/utils/analytics.ts
export const GA_MEASUREMENT_ID = 'G-ES50H7MEVJ'

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export function initializeAnalytics() {
  // 建立 dataLayer
  window.dataLayer = window.dataLayer || [];
  
  // 建立 gtag 函數 - 使用 rest parameters
  window.gtag = function(...args: any[]) {
    window.dataLayer.push(args);
  }
  
  // 載入 GA 腳本
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);
  
  // 初始化 GA
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID);
}

// 追蹤頁面瀏覽
export function trackPageView(path: string) {
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: path,
  });
}

// 追蹤 API 呼叫
export function trackAPICall(endpoint: string, model: string, success: boolean = true) {
  window.gtag('event', 'api_call', {
    event_category: 'OpenAI API',
    event_label: `${endpoint}_${model}`,
    custom_parameter_1: endpoint,
    custom_parameter_2: model,
    success: success,
    value: 1
  });
}