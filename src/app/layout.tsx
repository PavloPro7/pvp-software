import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { site } from "@/data/site";
import "@/styles/globals.scss";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — ${site.slogan}`, template: `%s — ${site.name}` },
  description: site.description,
  authors: [{ name: site.owner }],
  creator: site.owner,
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — ${site.slogan}`,
    description: site.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#111217",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
