/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static-first: export to plain HTML/CSS/JS. No server runtime needed.
  output: "export",
  reactStrictMode: true,
  images: {
    // next/image optimization is unavailable in a static export.
    unoptimized: true,
  },
  // Trailing slash keeps clean paths when served from static hosts / CDNs.
  trailingSlash: true,
};

export default nextConfig;
