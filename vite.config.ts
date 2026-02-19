import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import checker from 'vite-plugin-checker';

// ----------------------------------------------------------------------

// export default defineConfig({
//   plugins: [
//     react(),
//     checker({
//       typescript: true,
//       eslint: {
//         lintCommand: 'eslint "./src/**/*.{js,jsx,ts,tsx}"',
//       },
//       overlay: {
//         initialIsOpen: false,
//       },
//     }),
//   ],
//   resolve: {
//     alias: [
//       {
//         find: /^~(.+)/,
//         replacement: path.join(process.cwd(), 'node_modules/$1'),
//       },
//       {
//         find: /^src(.+)/,
//         replacement: path.join(process.cwd(), 'src/$1'),
//       },
//     ],
//   },
//   server: {
//     port: 8080,
//   },
//   preview: {
//     port: 3200,
//   },
// });

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [
      react(),
      checker({
        typescript: true,
        eslint: {
          lintCommand: 'eslint "./src/**/*.{js,jsx,ts,tsx}"',
        },
        overlay: {
          initialIsOpen: false,
        },
      }),
    ],
    resolve: {
      alias: [
        {
          find: /^~(.+)/,
          replacement: path.join(process.cwd(), 'node_modules/$1'),
        },
        {
          find: /^src(.+)/,
          replacement: path.join(process.cwd(), 'src/$1'),
        },
      ],
    },
    server: {
      port: 8080,
    },
    preview: {
      port: 3200,
    },
  }
});