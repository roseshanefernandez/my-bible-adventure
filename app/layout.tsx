import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * CRITICAL: Viewport configuration for mobile responsiveness
 * This is the most important configuration for mobile phones
 */
export const viewport: Viewport = {
  // Use device width - CRITICAL for mobile responsiveness
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  
  // Support for notched phones (iPhone X, 12, 13, 14, 15, etc.)
  viewportFitCover: true,
  
  // Color scheme preference
  colorScheme: "light dark",
  
  // Theme color for browser UI
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a2e" },
  ],
};

export const metadata: Metadata = {
  title: "My Bible Adventure - Interactive Stories for Children",
  description: "Beautiful interactive Bible stories with audio narration, animations, and coloring pages for Christian families and Sunday schools.",
  applicationName: "My Bible Adventure",
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* MOBILE OPTIMIZATION - Critical Meta Tags */}
        
        {/* iOS Web App */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Bible Adventure" />
        
        {/* Android Chrome */}
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#1a1a2e" media="(prefers-color-scheme: dark)" />
        
        {/* Windows Phone */}
        <meta name="msapplication-TileColor" content="#9f7aea" />
        
        {/* Prevents font scaling issues on landscape */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=yes, maximum-scale=5" />
        
        {/* Favicon emoji (works on all devices) */}
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='75' font-size='75'>🙏</text></svg>" />
      </head>
      
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
