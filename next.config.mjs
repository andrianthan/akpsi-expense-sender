/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Critical: prevents @react-pdf/renderer from being bundled by webpack
    // (it uses Node.js APIs that are incompatible with the Edge/browser bundler)
    serverComponentsExternalPackages: ['@react-pdf/renderer'],
  },
};

export default nextConfig;
