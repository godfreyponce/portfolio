import type { Metadata } from "next";
import { Geist, Fraunces } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  style: ["normal", "italic"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://godfreyponce.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Godfrey Ponce | Developer",
  description: "Personal portfolio of a student web developer.",
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Godfrey Ponce | Developer",
    description: "Personal portfolio of a student web developer.",
    siteName: "Godfrey Ponce",
    images: [{ url: "/godfrey_headShot.JPG", width: 1200, height: 630, alt: "Godfrey Ponce" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Godfrey Ponce | Developer",
    description: "Personal portfolio of a student web developer.",
    images: ["/godfrey_headShot.JPG"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${fraunces.variable}`}>
      <body>{children}</body>
    </html>
  );
}
