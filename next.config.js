/** @type {import('next').NextConfig} */
const nextConfig = {
  // The game runs entirely in the browser, so build it as static files
  // (written to out/). Vercel hosts them.
  output: "export",
  reactStrictMode: false,
  transpilePackages: ["react-hexgrid"],
};

module.exports = nextConfig;
