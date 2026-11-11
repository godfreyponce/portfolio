import type { Metadata } from "next";
import { Geist, Geist_Mono, Spectral } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const spectral = Spectral({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-spectral",
  display: "swap",
});

const siteUrl = "https://godfreyponce.dev";

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
    images: [{ url: "/og-card.png", width: 1200, height: 630, alt: "Godfrey Ponce, developer, godfreyponce.dev" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Godfrey Ponce | Developer",
    description: "Personal portfolio of a student web developer.",
    images: ["/og-card.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable} ${spectral.variable} relative`}>
      <body>{children}</body>
    </html>
  );
}
