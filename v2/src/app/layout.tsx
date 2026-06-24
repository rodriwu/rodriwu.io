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

/* Blocking pre-paint script: read the saved theme (or system preference)
   and apply `.light` to <html> before the first frame paints. Avoids a
   flash of the wrong theme during hydration. */
const THEME_INIT_SCRIPT = `(function(){try{var s=localStorage.getItem('v2-theme');if(s==='light')document.documentElement.classList.add('light');}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="antialiased">
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
