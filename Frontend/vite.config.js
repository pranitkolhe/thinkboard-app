import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0', // This line is crucial for network access
    port: 5173 // Specify your frontend port
  }
});




// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import path from 'path' // Required for alias

// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       '@': path.resolve(__dirname, './src'), // Setup '@' alias
//     },
//   },
// })