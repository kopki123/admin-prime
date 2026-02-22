import { fileURLToPath, URL } from 'node:url';
import { resolve } from 'node:path';
import fs from 'node:fs';

import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { PrimeVueResolver } from '@primevue/auto-import-resolver';
import vueDevTools from 'vite-plugin-vue-devtools';
import Inspect from 'vite-plugin-inspect';
import analyze, { type AnalysisObject } from 'rollup-plugin-analyzer';
import { visualizer } from 'rollup-plugin-visualizer';
import compression from 'vite-plugin-compression';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

function writeAnalysisReport(analysisText: string) {
  const distDir = resolve(__dirname, 'dist');
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  fs.writeFileSync(resolve(distDir, 'analyze-report.txt'), analysisText);
}

function handleBundleAnalysis(result: AnalysisObject) {
  const distDir = resolve(__dirname, 'dist');
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  fs.writeFileSync(resolve(distDir, 'analyze-result.json'), JSON.stringify(result, null, 2));

  // 顯示總體摘要
  console.log('\n\n--------------------\n打包摘要\n--------------------\n');
  console.table([
    {
      模組總數: result.moduleCount,
      原始大小: `${(result.bundleOrigSize / 1024 / 1024).toFixed(2)} MB`,
      打包後大小: `${(result.bundleSize / 1024 / 1024).toFixed(2)} MB`,
      壓縮減少: `${result.bundleReduction.toFixed(2)} %`,
    },
  ]);

  // 顯示前 10 大模組
  const topModules = result.modules
    .sort((a, b) => b.size - a.size)
    .slice(0, 10)
    .map((m) => ({
      模組: m.id.replace(/^.*node_modules\//, ''),
      大小: `${(m.size / 1024).toFixed(1)} KB`,
      原始大小: `${(m.origSize / 1024).toFixed(1)} KB`,
      壓縮減少: `${m.reduction.toFixed(1)} %`,
    }));

  console.log('\n--------------------\n體積最大的前 10 個模組\n--------------------\n');
  console.table(topModules);
}

// https://vite.dev/config/
export default defineConfig(({ mode, command }) => {
  const {
    VITE_APP_ENV,
    VITE_API_BASE_URL,
    VITE_MOCK,
  } = loadEnv(mode, __dirname, '');

  console.table({
    mode,
    command,
    VITE_APP_ENV,
    VITE_API_BASE_URL,
    VITE_MOCK,
  });

  return {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    plugins: [
      vue(),
      tailwindcss(),
      AutoImport({
        imports: [
          'vue',
          'vue-router',
          'pinia',
          'vue-i18n',
        ],
        dirs: [
          'src/composables',
        ],
        dts: 'src/auto-imports.d.ts',
        eslintrc: { enabled: true },
      }),
      Components({
        resolvers: [PrimeVueResolver()],
      }),
      vueDevTools(),
      Inspect({
        build: true,
        outputDir: resolve(__dirname, '.vite-inspect'),
      }),
      analyze({
        writeTo: writeAnalysisReport,
        onAnalysis: handleBundleAnalysis,
      }),
      visualizer({
        filename: resolve(__dirname, 'dist/stats.html'), // 輸出報告路徑
        template: 'flamegraph',
        gzipSize: true,
        brotliSize: true,
      }),
      compression({
        algorithm: 'brotliCompress',
        ext: '.br',
        deleteOriginFile: false, // 保留原始檔
        verbose: true,
        disable: false,
        threshold: 10240, // 大於 10kb 才壓縮
      }),
      ViteImageOptimizer(),
    ],
    server: {
      open: true,
      proxy: {
        // '/api': {
        //   target: 'http://localhost:3001',
        //   changeOrigin: true,
        // },
      },
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      assetsDir: 'assets',
      sourcemap: false,
      chunkSizeWarningLimit: 1000, // 超過 1MB 時警告
      minify: 'esbuild',
      cssMinify: 'lightningcss',
      rollupOptions: {
        output: {
          chunkFileNames: 'js/[name]-[hash].js', // 分包 chunk
          entryFileNames: 'js/[name]-[hash].js', // 入口檔案
          assetFileNames: '[ext]/[name]-[hash].[ext]', // 靜態資源分類
          manualChunks: {
            vue: ['vue', 'vue-router', 'pinia'],
            primevue: ['primevue'],
            vendor: ['axios', 'zod'],
            lodash: ['lodash-es'],
          },
        },
      },
    },
    esbuild: {
      drop: VITE_APP_ENV === 'production' ? ['debugger'] : undefined,
    },
  };
});
