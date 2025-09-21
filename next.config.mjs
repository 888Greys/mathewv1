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
  // Fix styled-jsx issues in standalone builds
  outputFileTracingExcludes: {
    '*': [
      'node_modules/@swc/core-linux-x64-gnu',
      'node_modules/@swc/core-linux-x64-musl',
      'node_modules/@esbuild/darwin-x64',
      'node_modules/@esbuild/linux-x64-gnu',
    ],
  },
  // Ensure styled-jsx is bundled correctly
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        'styled-jsx/style': 'styled-jsx/style',
      });
    }
    return config;
  },
};

export default withMDX(nextConfig);