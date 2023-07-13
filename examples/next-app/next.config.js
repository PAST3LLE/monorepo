/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@past3lle/web3-modal', 
    '@past3lle/wagmi-connectors', 
    '@past3lle/hooks'
  ],
  reactStrictMode: true,
  compiler: {
      styledComponents: true,
  }
}

module.exports = nextConfig
