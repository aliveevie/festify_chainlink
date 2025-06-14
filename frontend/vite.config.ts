import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    sourcemap: true,
    minify: false,
    target: 'esnext',
    rollupOptions: {
      onwarn(warning, warn) {
        // Ignore all warnings
        return;
      }
    }
  },
  plugins: [
    react({
      // Disable React strict mode to be more permissive
      strict: false,
    }),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
