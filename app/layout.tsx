import type { Metadata } from "next";
import { Geist, Fraunces, Nunito_Sans } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

// Streak number only (#26): Snapchat-style counter, owner picked VARIANT B
// (Nunito Sans ExtraBold) over the Apple-only Avenir Next system stack.
const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito-sans",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  style: ["normal", "italic"],
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
    <html lang="en" className={`${geist.variable} ${fraunces.variable} ${nunitoSans.variable} relative`}>
      <body>{children}</body>
    </html>
  );
}
