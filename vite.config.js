import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        manifesto: resolve(__dirname, 'manifesto.html'),
        ventures: resolve(__dirname, 'ventures.html'),
        roadmap: resolve(__dirname, 'roadmap.html'),
        team: resolve(__dirname, 'team.html'),
        contact: resolve(__dirname, 'contact.html'),
        opportunities: resolve(__dirname, 'opportunities.html'),
        lab: resolve(__dirname, 'lab.html'),
        catalyst: resolve(__dirname, 'catalyst.html'),
        hybrid: resolve(__dirname, 'hybrid.html'),
        legal: resolve(__dirname, 'legal.html'),
      }
    }
  }
})
