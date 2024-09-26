/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        "child_process": false,
      };
    }

    // Add external modules
    config.externals.push('@node-rs/argon2', '@node-rs/bcrypt');

    // You can add more webpack configurations here if needed

    return config;
  },
};

export default nextConfig;