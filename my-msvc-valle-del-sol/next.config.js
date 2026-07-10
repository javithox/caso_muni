/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true, // Ignora errores de TypeScript en Vercel
  },
  eslint: {
    ignoreDuringBuilds: true, // Evita que ESLint detenga el despliegue
  }
};

export default nextConfig;
