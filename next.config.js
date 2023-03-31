/** @type {import('next').NextConfig} */
import { API_ENDPOINT } from "config";
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
