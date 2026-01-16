import assert from 'assert'
import { defineConfig } from '@vite-pwa/assets-generator/config'

export default defineConfig({
  preset: {
    transparent: {
      padding: 0,
      sizes: [],
      favicons: [[48, 'favicon.ico']],
    },
    maskable: {
      padding: 0.348,
      sizes: [64],
      resizeOptions: { background: '#0c0a09' },
    },
    apple: {
      padding: 0.597,
      sizes: [180, 192, 512],
      resizeOptions: { background: '#0c0a09' },
    },
    assetName(_, size) {
      assert(size.height === size.width)
      return `icon-${size.width}.png`
    },
  },
  images: ['public/favicon.svg'],
})
