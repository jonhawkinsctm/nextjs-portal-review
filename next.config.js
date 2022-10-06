/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    env: {
        DOG_API_BASE_URL: process.env.DOG_API_BASE_URL,
    },
};

module.exports = nextConfig;
