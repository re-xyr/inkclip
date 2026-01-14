/// <reference types="node" />
import { resolve } from 'path'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'
import icons from 'unplugin-icons/vite'
import { defineConfig } from 'vite'
import { ManifestOptions, VitePWA as pwa } from 'vite-plugin-pwa'

const manifest: Partial<ManifestOptions> = {
  name: 'Write to Inkclip',
  short_name: 'Inkclip',
  description: 'Utility for writing images onto the “Inkclip” e-paper accessory.',
  theme_color: '#afbabc',
  display: 'standalone',
  icons: [
    {
      src: 'pwa-64x64.png',
      sizes: '64x64',
      type: 'image/png',
    },
    {
      src: 'pwa-192x192.png',
      sizes: '192x192',
      type: 'image/png',
    },
    {
      src: 'pwa-512x512.png',
      sizes: '512x512',
      type: 'image/png',
    },
  ],
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    icons({ compiler: 'svelte' }),
    tailwindcss(),
    pwa({
      registerType: 'autoUpdate',
      workbox: { globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'] },
      manifest,
      devOptions: { enabled: true },
    }),
    svelte(),
  ],
  resolve: {
    alias: {
      $lib: resolve('./src/lib'),
    },
  },
})
