import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = "https://www.landoraapp.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: "Landlord Ledger — Simple Rental Property Management Software",
    template: "%s | Landlord Ledger",
  },

  description:
    "Manage your rental properties, tenants, leases, payments, and expenses in one place. Free property management software for independent US landlords.",

  keywords: [
    "property management software",
    "landlord software",
    "rental management",
    "tenant tracking",
    "rent collection",
    "landlord ledger",
    "property management app",
    "independent landlord",
  ],

  authors: [{ name: "Landlord Ledger", url: BASE_URL }],
  creator: "Landlord Ledger",
  publisher: "Landlord Ledger",

  alternates: {
    canonical: BASE_URL,
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "Landlord Ledger",
    title: "Landlord Ledger — Simple Rental Property Management",
    description:
      "Track rent, tenants, leases & expenses. Built for independent US landlords.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Landlord Ledger — Simple Rental Property Management Software",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@landlordledger",
    creator: "@landlordledger",
    title: "Landlord Ledger — Simple Rental Property Management",
    description:
      "Track rent, tenants, leases & expenses. Built for independent US landlords.",
    images: ["/opengraph-image"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Landlord Ledger",
  url: BASE_URL,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "Property management software for independent US landlords",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Property and unit management",
    "Tenant profiles",
    "Lease tracking",
    "Rent payment logging",
    "Expense tracking",
    "Financial reports",
  ],
  screenshot: `${BASE_URL}/opengraph-image`,
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
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
