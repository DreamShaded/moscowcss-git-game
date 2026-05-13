import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

function contentPlugin() {
  let rebuilding = false;
  const rebuild = () => {
    if (rebuilding) return;
    rebuilding = true;
    try {
      const r = spawnSync('npx', ['tsx', 'scripts/build-content.ts'], { stdio: 'inherit' });
      if (r.status !== 0) throw new Error('content build failed');
    } finally {
      rebuilding = false;
    }
  };
  return {
    name: 'crs-content',
    buildStart() { rebuild(); },
    configureServer(server: any) {
      server.watcher.add(path.resolve('content'));
      server.watcher.on('change', (file: string) => {
        if (file.includes(`${path.sep}content${path.sep}`)) rebuild();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), contentPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@generated': path.resolve(__dirname, 'src/generated'),
    },
  },
  base: './',
  build: {
    outDir: 'dist',
    sourcemap: false,
    target: 'es2022',
  },
});
