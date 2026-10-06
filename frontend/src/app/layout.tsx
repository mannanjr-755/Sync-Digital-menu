import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://sync-digital-menu.vercel.app"
  ),
  title: {
    default: "Sync · Digital Menu",
    template: "%s · Sync",
  },
  description:
    "Sync digital restaurant menu and kitchen dashboard — NFC/QR table ordering.",
  applicationName: "Sync",
  openGraph: {
    title: "Sync · Digital Menu",
    description:
      "Sync digital restaurant menu and kitchen dashboard — NFC/QR table ordering.",
    siteName: "Sync",
    images: [{ url: "/logo.png", width: 512, height: 512, alt: "Sync" }],
  },
  twitter: {
    card: "summary",
    title: "Sync · Digital Menu",
    description:
      "Sync digital restaurant menu and kitchen dashboard — NFC/QR table ordering.",
    images: ["/logo.png"],
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-theme="light" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-full flex-col bg-[var(--bg)] text-[var(--text)]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
