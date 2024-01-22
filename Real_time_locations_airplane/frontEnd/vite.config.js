import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Τοποθεσία IP του διακομιστή
    port: 3001, // Πόρτα του διακομιστή
  },
});