import nextPWA from "next-pwa"

const withPWA = nextPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^\/assets\/audio\/.*$/i,
      handler: "CacheFirst",
      options: {
        cacheName: "pul-audio",
        expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 365 },
      },
    },
    {
      urlPattern: /^\/assets\/images\/.*$/i,
      handler: "CacheFirst",
      options: {
        cacheName: "pul-images",
        expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 365 },
      },
    },
    {
      urlPattern: /\.(?:js|css|woff2?|svg|png|jpg|jpeg|webp)$/i,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "pul-static",
        expiration: { maxEntries: 160, maxAgeSeconds: 60 * 60 * 24 * 30 },
      },
    },
  ],
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["framer-motion"],
}

export default withPWA(nextConfig)
