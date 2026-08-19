import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { VisitTracker } from "@/components/system/VisitTracker";
import { profile } from "@/content/profile";
import "./globals.css";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

/* Plus Jakarta Sans carries both display and body — a rounded, premium
   humanist face that suits the soft, luminous liquid-glass surfaces.
   JetBrains Mono keeps every date, figure and label crisp. */
const display = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const sans = Plus_Jakarta_Sans({
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
        // A circular liquid-glass orb with a "Y" monogram: an indigo aurora
        // refracted through glass — a top sheen, a bright rim, a soft edge.
        // Real `#` colours, encoded once, so the data URI stays valid.
        url:
          "data:image/svg+xml," +
          encodeURIComponent(
            `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><defs><radialGradient id='orb' cx='38%' cy='30%' r='85%'><stop offset='0' stop-color='#c7d2fe'/><stop offset='0.45' stop-color='#6366f1'/><stop offset='1' stop-color='#3730a3'/></radialGradient><linearGradient id='sheen' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#ffffff' stop-opacity='0.72'/><stop offset='0.55' stop-color='#ffffff' stop-opacity='0'/></linearGradient></defs><circle cx='16' cy='16' r='15' fill='#0b0a20'/><circle cx='16' cy='16' r='14' fill='url(#orb)'/><path d='M4 15 A12 12 0 0 1 28 15 A15 9 0 0 0 4 15 Z' fill='url(#sheen)'/><path d='M10 9.5 L16 16.5 L22 9.5 M16 16.5 L16 23' fill='none' stroke='#ffffff' stroke-width='2.6' stroke-linecap='round' stroke-linejoin='round'/><circle cx='16' cy='16' r='14' fill='none' stroke='#ffffff' stroke-opacity='0.55' stroke-width='1'/></svg>`
          ),
        type: "image/svg+xml",
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ecedf7" },
    { media: "(prefers-color-scheme: dark)", color: "#030308" },
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
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {/* The living aurora the glass refracts. */}
          <div className="aurora" aria-hidden="true" />
          <div className="aurora-grain" aria-hidden="true" />
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
