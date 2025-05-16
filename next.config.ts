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
    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME || '',
    FMP_API_KEY: process.env.FMP_API_KEY || '',
    RAPID_API_KEY: process.env.RAPID_API_KEY || '',
    REGION: process.env.REGION || 'us-east-1',
    FRED_API_KEY: process.env.FRED_API_KEY || '',
  }
}


export default nextConfig;
