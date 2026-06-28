/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Los paquetes del workspace exportan TS directamente (sin build),
  // así que Next debe transpilarlos.
  transpilePackages: ["@az/core", "@az/ui-tokens", "@az/supabase"],
};

export default nextConfig;
