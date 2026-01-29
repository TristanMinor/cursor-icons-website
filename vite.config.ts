import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { execSync } from 'child_process'
import { watch } from 'fs'
import { resolve } from 'path'

function iconGeneratePlugin() {
  let watcher: ReturnType<typeof watch> | null = null;
  let debounce: ReturnType<typeof setTimeout> | null = null;

  const generate = () => {
    try {
      execSync('npm run generate', { stdio: 'inherit' });
    } catch {
      console.error('Failed to generate icon data');
    }
  };

  return {
    name: 'icon-generate',
    buildStart() {
      generate();
    },
    configureServer() {
      const sourceDir = resolve(__dirname, 'source');
      watcher = watch(sourceDir, { recursive: true }, (_event, filename) => {
        if (!filename) return;
        if (debounce) clearTimeout(debounce);
        debounce = setTimeout(() => {
          console.log(`\n[icon-generate] Source changed: ${filename}`);
          generate();
        }, 500);
      });
    },
    closeBundle() {
      watcher?.close();
    },
  };
}

export default defineConfig({
  plugins: [iconGeneratePlugin(), react()],
  json: {
    stringify: true,
  },
})
