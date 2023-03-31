/** @type {import('next').NextConfig} */
const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT || "http://127.0.0.1:8000";

const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/file_manage",
        destination: `${API_ENDPOINT}/upload_file/`,
      },
    ];
  },
};

module.exports = nextConfig;
