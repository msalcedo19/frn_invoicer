/** @type {import('next').NextConfig} */
const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT || "http://127.0.0.1:8000";

const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/file_manage",
        destination: `${API_ENDPOINT}/generate_pdf`,
      },
      {
        source: "/api/get_pages",
        destination: `${API_ENDPOINT}/get_pages`,
      },
      {
        source: "/api/authenticate",
        destination: `${API_ENDPOINT}/authenticate`,
      },
    ];
  },
};

module.exports = nextConfig;
