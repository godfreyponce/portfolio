import type { Metadata } from "next";
import { Geist, Fraunces, Libre_Baskerville } from "next/font/google";
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

const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-baskerville",
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
    <html lang="en" className={`${geist.variable} ${fraunces.variable} ${libreBaskerville.variable} relative`}>
      <body>{children}</body>
    </html>
  );
}
