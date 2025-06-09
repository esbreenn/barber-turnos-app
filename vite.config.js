import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/barber-turnos-app/', // <-- ¡AÑADE ESTA LÍNEA AQUÍ!
})