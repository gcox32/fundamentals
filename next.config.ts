import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
      remotePatterns: [
          {
              protocol: 'https',
              hostname: '**',
          },
      ],
  },
  env: {
    ACCESS_KEY_ID: process.env.ACCESS_KEY_ID || '',
    SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY || '',
    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME || ''
  }
}


export default nextConfig;
