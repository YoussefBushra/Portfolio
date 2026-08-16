import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { VisitTracker } from "@/components/system/VisitTracker";
import { profile } from "@/content/profile";
import "./globals.css";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

/* Three faces, three jobs. Space Grotesk is the display voice: technical,
   geometric, with just enough character to feel engineered rather than
   generic. Inter carries dense body copy at small sizes. JetBrains Mono is
   the telemetry voice, on every date, duration, figure and label. */
const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

/**
 * Absolute base for canonical URLs and Open Graph images. On Vercel this
 * resolves itself from the project's production URL, so a preview or a
 * *.vercel.app deployment still emits working absolute URLs. Set
 * NEXT_PUBLIC_SITE_URL once a custom domain is attached.
 */
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://youssefbushra.com");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${profile.name} - ${profile.role}`,
    template: `%s - ${profile.name}`,
  },
  description: profile.metaDescription,
  keywords: [
    "Youssef Bushra",
    "Full Stack Engineer",
    "Backend Engineer",
    "Distributed Systems",
    "Microservices",
    "Next.js",
    "NestJS",
    "TypeScript",
    "Node.js",
  ],
  authors: [{ name: profile.name }],
  creator: profile.name,
  openGraph: {
    type: "website",
    title: `${profile.name} - ${profile.role}`,
    description: profile.metaDescription,
    siteName: profile.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} - ${profile.role}`,
    description: profile.metaDescription,
  },
  icons: {
    icon: [
      {
        url:
          "data:image/svg+xml," +
          encodeURIComponent(
            `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='6' fill='#090c11'/><circle cx='8' cy='16' r='2.6' fill='#2de0c2'/><circle cx='24' cy='9' r='2.6' fill='#2de0c2'/><circle cx='24' cy='23' r='2.6' fill='#2de0c2'/><path d='M10.3 15 L21.7 9.6 M10.3 17 L21.7 22.4' stroke='#2de0c2' stroke-width='1.5' opacity='0.6'/></svg>`
          ),
        type: "image/svg+xml",
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f6f9" },
    { media: "(prefers-color-scheme: dark)", color: "#090c11" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${display.variable} ${sans.variable} ${mono.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>

        {/* Privacy-first product analytics */}
        <VisitTracker />
        <Analytics />
        <SpeedInsights />

        {/* Optional Google Analytics 4, enabled only when NEXT_PUBLIC_GA_ID is set */}
        {GA_ID ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', { anonymize_ip: true });
              `}
            </Script>
          </>
        ) : null}
      </body>
    </html>
  );
}
