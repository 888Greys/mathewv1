import mdx from "@next/mdx";

const withMDX = mdx({
  extension: /\.mdx?$/,
  options: {},
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // For better production builds
  poweredByHeader: false,
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  transpilePackages: ["next-mdx-remote"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.google.com",
        pathname: "**",
      },
    ],
  },
  sassOptions: {
    compiler: "modern",
    silenceDeprecations: ["legacy-js-api"],
  },
  env: {
    CUSTOM_PORT: process.env.PORT || '3001'
  },
  // Ensure styled-jsx is properly handled in standalone builds
  serverExternalPackages: ['styled-jsx']
};

export default withMDX(nextConfig);