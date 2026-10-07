import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://sync-digital-menu-app.vercel.app"
  ),
  title: {
    default: "Sync · Digital Menu",
    template: "%s · Sync",
  },
  description:
    "Sync digital cafe menu — order from your table with NFC/QR.",
  applicationName: "Sync",
  openGraph: {
    title: "Sync · Digital Menu",
    description: "Sync digital cafe menu — order from your table with NFC/QR.",
    siteName: "Sync",
    images: [{ url: "/logo.png", width: 512, height: 512, alt: "Sync" }],
  },
  twitter: {
    card: "summary",
    title: "Sync · Digital Menu",
    description: "Sync digital cafe menu — order from your table with NFC/QR.",
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
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full bg-[var(--bg)] text-[var(--text)]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
