import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        posts: resolve(__dirname, 'posts.html'),
        article: resolve(__dirname, 'article.html'),
        privacyPolicy: resolve(__dirname, 'tilcash-privacy-policy.html')
      }
    }
  }
});
