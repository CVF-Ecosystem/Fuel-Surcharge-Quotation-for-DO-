import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import pkg from '../package.json' with { type: 'json' };

export default defineConfig(({mode}) => {
  // Base path:
  //  - VITE_BASE nếu được đặt (ví dụ '/' khi deploy gốc domain)
  //  - Vercel phục vụ ở gốc domain → '/'
  //  - production trên VPS (nginx /QD209/) → '/QD209/'
  //  - dev → '/'
  const base =
    process.env.VITE_BASE ??
    (process.env.VERCEL ? '/' : mode === 'production' ? '/QD209/' : '/');

  return {
    root: __dirname,
    base,
    plugins: [react(), tailwindcss()],
    define: {
      __APP_VERSION__: JSON.stringify(pkg.version),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // Đặt DISABLE_HMR=true để tắt hot reload (ví dụ khi chạy trong môi trường không hỗ trợ websocket).
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
