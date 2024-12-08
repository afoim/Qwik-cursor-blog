import { component$ } from '@builder.io/qwik';

export default component$(() => {
  const currentYear = new Date().getFullYear();

  return (
    <footer class="mt-auto py-8 px-4 bg-[rgb(15,15,18)] border-t border-white/5">
      <div class="max-w-4xl mx-auto flex flex-col items-center gap-4 text-sm text-white/50">
        <div class="flex items-center gap-4">
          <a 
            href="https://github.com/afoim/Qwik-cursor-blog" 
            target="_blank" 
            rel="noopener noreferrer"
            class="flex items-center gap-2 hover:text-white/70 transition-colors duration-300 group"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              stroke-width="2" 
              stroke-linecap="round" 
              stroke-linejoin="round"
              class="group-hover:scale-110 transition-transform duration-300"
            >
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
            <span>GitHub</span>
          </a>
          <span class="text-white/20">|</span>
          <span>© {currentYear} AcoFork</span>
        </div>
        <div class="flex items-center gap-2">
          <span>Powered by</span>
          <a 
            href="https://qwik.builder.io" 
            target="_blank" 
            rel="noopener noreferrer"
            class="hover:text-white/70 transition-colors duration-300"
          >
            Qcb
          </a>
        </div>
      </div>
    </footer>
  );
}); 