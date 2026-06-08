import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import Shell from "@/components/Shell";
import "./globals.css";

export const metadata: Metadata = {
  title: "rodriwu.io",
  description: "Rodrigo Martínez — Designer · Portfolio",
};

export const viewport: Viewport = {
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`light ${GeistSans.className}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
