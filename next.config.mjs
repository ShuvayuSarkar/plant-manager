import createNextIntlPlugin from 'next-intl/plugin'

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "tradiohub.s3.us-east-1.amazonaws.com",
                pathname: "/chart_images/**"
            }
        ]
    }
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
