import { component$, useSignal, $ } from '@builder.io/qwik';

export const CodeBlock = component$<{ code: string; language?: string }>(({ code, language }) => {
  const copySuccess = useSignal(false);

  const copyToClipboard = $(async () => {
    try {
      await navigator.clipboard.writeText(code);
      copySuccess.value = true;
      setTimeout(() => {
        copySuccess.value = false;
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  });

  return (
    <pre class="group relative">
      <button
        onClick$={copyToClipboard}
        class={`copy-button ${copySuccess.value ? 'copy-success' : ''}`}
        aria-label="Copy code"
      >
        {copySuccess.value ? '已复制!' : '复制'}
      </button>
      <code class={language ? `language-${language}` : ''}>
        {code}
      </code>
    </pre>
  );
}); 