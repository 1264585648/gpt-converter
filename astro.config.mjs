import { defineConfig } from 'astro/config'
import react from '@astrojs/react'

const site = process.env.PUBLIC_SITE_URL?.trim()

export default defineConfig({
  output: 'static',
  ...(site ? { site } : {}),
  integrations: [react()],
})
