import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import type { ReactNode } from "react";
import { RouteWarmup } from "@/components/navigation/route-warmup";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta-sans"
});

export const metadata: Metadata = {
  title: "Memetrest",
  description: "Memetrest prototype screens rebuilt as a real Next.js app."
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html className="light" lang="en">
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${plusJakartaSans.variable} light min-h-screen bg-background font-body-md text-on-background`}
        suppressHydrationWarning
      >
        <RouteWarmup />
        {children}
      </body>
    </html>
  );
}
