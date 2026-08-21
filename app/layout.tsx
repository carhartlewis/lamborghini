import type { Metadata } from "next";
import { Geist, Geist_Mono, Saira_Condensed } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const saira = Saira_Condensed({
  variable: "--font-saira",
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lamborghini.lol"),
  title: "lamborghini.lol — Your logo. On a Lamborghini. Forever.",
  description:
    "Bid for screen time on a real Lamborghini's digital billboard. $1,000 minimum, $200,000 total. Your ad runs for the lifetime of the car.",
  openGraph: {
    title: "lamborghini.lol",
    description:
      "SaaS companies bid for ad time on a physical Lamborghini. Bid $50k, own 1/4 of the car. Forever.",
    url: "https://lamborghini.lol",
    siteName: "lamborghini.lol",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "lamborghini.lol",
    description:
      "Bid for a permanent share of a real Lamborghini's digital billboard. From $1,000.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${saira.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
