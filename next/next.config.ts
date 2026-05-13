import type { NextConfig } from "next";

const securityHeaders = [
    {
        key: "X-DNS-Prefetch-Control",
        value: "on",
    },
    {
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
    },
    {
        key: "X-Frame-Options",
        value: "SAMEORIGIN",
    },
    {
        key: "X-Content-Type-Options",
        value: "nosniff",
    },
    {
        key: "X-XSS-Protection",
        value: "1; mode=block",
    },
    {
        key: "Referrer-Policy",
        value: "strict-origin-when-cross-origin",
    },
    {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=()",
    },
    {
        key: "Content-Security-Policy",
        value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.google.com https://www.gstatic.com https://www.recaptcha.net",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com",
            "img-src 'self' data: blob: https://setaseisakusyo.com https://*.googleusercontent.com",
            "frame-src https://www.google.com https://www.recaptcha.net",
            "connect-src 'self' https://www.google.com https://www.recaptcha.net",
        ].join("; "),
    },
];

const nextConfig: NextConfig = {
    output: "standalone",
    distDir: ".next",
    experimental: {
        serverActions: { bodySizeLimit: "2mb" },
    },
    images: {
        localPatterns: [
            {
                pathname: "/uploads/**",
            },
        ],
        remotePatterns: [
            {
                protocol: "https",
                hostname: "setaseisakusyo.com",
            },
        ],
    },
    async headers() {
        return [
            {
                source: "/:path*",
                headers: securityHeaders,
            },
        ];
    },
    async redirects() {
        return [
            {
                source: "/discription",
                destination: "/description",
                permanent: true,
            },
        ];
    },
};

export default nextConfig;
