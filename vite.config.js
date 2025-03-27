import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';

export default defineConfig({
  plugins: [uni()],
  resolve: {},
  server: {
    host: "localhost",
    port: 9999,
    proxy: {           // 为开发服务器配置自定义代理规则
      "/apiUni": {
        target: "http://localhost:8888", // 目标接口
        changeOrigin: true,            // 是否允许跨域
        rewrite: (path) => path.replace(/^\/apiUni/, ""),
      }
    }
  }
});
