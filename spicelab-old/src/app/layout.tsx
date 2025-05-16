import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./providers";
import { GoogleAnalytics } from "@next/third-parties/google";
import { CSPostHogProvider } from "@/app/posthog-provider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "SpiceLab",
  description: "Aplikacja do zarządzania projektami SpiceGears",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" suppressHydrationWarning>
    <GoogleAnalytics gaId="G-Y54ZE7C3VP" />
    <CSPostHogProvider>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-black`}
      >
        <Providers>{children}</Providers>
      </body>
    </CSPostHogProvider>
    </html>
  );
}
