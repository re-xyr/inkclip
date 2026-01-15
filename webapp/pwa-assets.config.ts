import { defineConfig } from '@vite-pwa/assets-generator/config'

export default defineConfig({
  preset: {
    transparent: {
      sizes: [64, 192, 512],
      favicons: [[48, 'favicon.ico']],
    },
    maskable: {
      padding: 0.5,
      sizes: [512],
    },
    apple: {
      padding: 0.5,
      sizes: [180],
    },
  },
  images: ['public/favicon.svg'],
})
