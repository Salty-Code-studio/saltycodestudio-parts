/**
 * saltycodestudio — root layout (App Router)
 * ----------------------------------------------------------------------------
 * - Loads the three brand fonts via `next/font/google` (self-hosted, zero
 *   layout shift, no extra <link> tags). Each exposes a CSS variable that
 *   tailwind.config.ts maps onto `font-display` / `font-sans` / `font-mono`.
 *      Space Grotesk  -> --font-space-grotesk -> font-display (headings, mark)
 *      Inter          -> --font-inter         -> font-sans / font-body
 *      JetBrains Mono  -> --font-jetbrains-mono -> font-mono (labels, code)
 * - Exports `metadata` (App Router's typed head API) for SEO defaults.
 * - Sets the brand palette on <html> via the data-* attributes that
 *   foundations/palettes.css reads.
 */
import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

/* ── Fonts ─────────────────────────────────────────────────────────────── */
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
  variable: "--font-jetbrains-mono",
});

/* ── SEO metadata ──────────────────────────────────────────────────────── */
export const metadata: Metadata = {
  // Set this to your deployed origin so relative OG/canonical URLs resolve.
  metadataBase: new URL("https://saltycodestudio.com"),
  title: {
    default: "saltycodestudio — Clean code, warm coast.",
    template: "%s · saltycodestudio",
  },
  description:
    "Coastal × tech web design and development. Clean code, warm coast.",
  applicationName: "saltycodestudio",
  authors: [{ name: "saltycodestudio" }],
  keywords: ["web design", "web development", "frontend", "saltycodestudio"],
  openGraph: {
    type: "website",
    title: "saltycodestudio — Clean code, warm coast.",
    description:
      "Coastal × tech web design and development. Clean code, warm coast.",
    siteName: "saltycodestudio",
  },
  twitter: {
    card: "summary_large_image",
    title: "saltycodestudio — Clean code, warm coast.",
    description:
      "Coastal × tech web design and development. Clean code, warm coast.",
  },
  icons: {
    // Swap these for the real favicons in saltycodestudio-brand-kit/assets/.
    icon: "/favicon.ico",
  },
};

/* Viewport / theme-color is its own export in the App Router. */
export const viewport: Viewport = {
  themeColor: "#F2EBDD", // Warm Sand
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      // palettes.css keys off these; "sand-surf" + "light" is the official theme.
      data-palette="sand-surf"
      data-mode="light"
      // Expose the three font CSS variables document-wide.
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-sand font-body text-teal antialiased">
        {children}
      </body>
    </html>
  );
}
