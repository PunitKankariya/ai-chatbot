// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import path from 'path'

// export default defineConfig({
//   plugins: [react()],
//   css: {
//     postcss: path.resolve(__dirname, 'src/postcss.config.cjs')
//   }
// })
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.cjs'  // Ensure this path is correct
  }
})