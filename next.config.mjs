// PostHog is reached through this site (/ingest) rather than directly, so
// its requests are first-party and not dropped by tracker blockers.
const POSTHOG_HOST =
  process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";
const POSTHOG_ASSETS = POSTHOG_HOST.replace(
  /^https:\/\/(\w+)\.i\./,
  "https://$1-assets.i.",
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: `${POSTHOG_ASSETS}/static/:path*`,
      },
      {
        source: "/ingest/array/:path*",
        destination: `${POSTHOG_ASSETS}/array/:path*`,
      },
      { source: "/ingest/:path*", destination: `${POSTHOG_HOST}/:path*` },
    ];
  },
  // PostHog's API paths end in a slash; don't redirect them.
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
