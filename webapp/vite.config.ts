/// <reference types="node" />
import { resolve } from 'path'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'
import icons from 'unplugin-icons/vite'
import { defineConfig } from 'vite'

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
