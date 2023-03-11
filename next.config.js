/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/file_manage',
        destination: 'http://127.0.0.1:8000/upload_file/'
      }
    ]
  }
}

module.exports = nextConfig
