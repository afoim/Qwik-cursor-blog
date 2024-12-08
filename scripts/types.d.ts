declare module 'pinyin/lib/index.js' {
  interface PinyinOptions {
    style?: number;
    segment?: boolean;
    heteronym?: boolean;
  }
  
  function pinyin(text: string, options?: PinyinOptions): string[][];
  
  export default pinyin;
} 