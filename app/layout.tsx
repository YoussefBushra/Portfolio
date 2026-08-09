import type { Metadata, Viewport } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { profile } from "@/content/profile";
import "./globals.css";

const sans = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const siteUrl = "https://youssefbushra.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${profile.name} — ${profile.role}`,
    template: `%s — ${profile.name}`,
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
    title: `${profile.name} — ${profile.role}`,
    description: profile.metaDescription,
    siteName: profile.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — ${profile.role}`,
    description: profile.metaDescription,
  },
  icons: {
    icon: [
      {
        url:
          "data:image/svg+xml," +
          encodeURIComponent(
            `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='7' fill='#0b0e18'/><circle cx='16' cy='16' r='4' fill='#7c7aff'/><circle cx='7' cy='8' r='2.2' fill='#2dd4bf'/><circle cx='25' cy='9' r='2.2' fill='#2dd4bf'/><circle cx='8' cy='24' r='2.2' fill='#2dd4bf'/><circle cx='24' cy='24' r='2.2' fill='#2dd4bf'/><g stroke='#7c7aff' stroke-width='1.2' opacity='0.6'><line x1='16' y1='16' x2='7' y2='8'/><line x1='16' y1='16' x2='25' y2='9'/><line x1='16' y1='16' x2='8' y2='24'/><line x1='16' y1='16' x2='24' y2='24'/></g></svg>`
          ),
        type: "image/svg+xml",
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f7fb" },
    { media: "(prefers-color-scheme: dark)", color: "#070910" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${sans.variable} ${mono.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
