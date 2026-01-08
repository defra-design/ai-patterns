import { defineConfig } from 'astro/config'
import { NodePackageImporter } from 'sass'
import mdx from '@astrojs/mdx'

export default defineConfig({
  integrations: [mdx()],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          importers: [
            new NodePackageImporter()
          ]
        }
      }
    }
  }
})
