/** @type {import('next').NextConfig} */
const nextConfig = {
  // The game runs entirely in the browser, so build it as static files
  // (written to out/) for Firebase Hosting to serve.
  output: "export",
  reactStrictMode: false,
  transpilePackages: ["react-hexgrid"],
};

module.exports = nextConfig;
