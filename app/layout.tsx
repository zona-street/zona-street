import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Zona Street - Moda Streetwear e Oversized",
    template: "%s | Zona Street",
  },
  description:
    "Descubra a melhor moda streetwear e oversized do Brasil. Camisetas, moletons, calças e acessórios com estilo urbano único. Compre online na Zona Street!",
  keywords: [
    "streetwear",
    "moda streetwear",
    "roupas oversized",
    "camisetas streetwear",
    "moletons oversized",
    "moda urbana",
    "street style",
    "roupas de rua",
    "calças streetwear",
    "acessórios streetwear",
    "moda jovem",
    "estilo urbano",
    "zona street",
  ],
  authors: [{ name: "Zona Street" }],
  creator: "Zona Street",
  publisher: "Zona Street",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://zonastreet.com.br"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Zona Street - Moda Streetwear e Oversized",
    description:
      "Descubra a melhor moda streetwear e oversized do Brasil. Camisetas, moletons, calças e acessórios com estilo urbano único.",
    url: "https://zonastreet.com.br",
    siteName: "Zona Street",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Zona Street - Moda Streetwear",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zona Street - Moda Streetwear e Oversized",
    description:
      "Descubra a melhor moda streetwear e oversized do Brasil. Compre online na Zona Street!",
    images: ["/og-image.png"],
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
  icons: {
    icon: "/favicon_io/favicon.ico",
    shortcut: "/favicon_io/favicon.ico",
    apple: "/favicon_io/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    name: "Zona Street",
    description:
      "Loja online de moda streetwear e oversized com os melhores produtos do Brasil",
    url: "https://zonastreet.com.br",
    logo: "https://zonastreet.com.br/logo-branca.png",
    image: "https://zonastreet.com.br/og-image.png",
    telephone: "+55-24-99206-0913",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressCountry: "BR",
      addressLocality: "Resende",
      addressRegion: "RJ",
    },
    sameAs: ["https://instagram.com/zonastreet01"],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "00:00",
        closes: "23:59",
      },
    ],
    paymentAccepted: ["Credit Card", "Debit Card", "PIX"],
  };

  return (
    <html lang="pt-BR">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
