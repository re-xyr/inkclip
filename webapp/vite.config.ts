/// <reference types="node" />
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { resolve } from 'path'
import icons from 'unplugin-icons/vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    svelte(),
    icons({
      compiler: 'svelte',
    }),
  ],
  resolve: {
    alias: {
      $lib: resolve('./src/lib'),
    },
  },
})
