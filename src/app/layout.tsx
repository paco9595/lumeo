import type { Metadata } from "next";
import { ClerkProvider } from '@clerk/nextjs';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import FooterWrapper from "@/components/FooterWrapper";
import { CartProvider } from "@/context/CartContext";
import CartSidebar from "@/components/cart/CartSidebar";

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
    default: "Lumeo - Stickers Personalizadas, Cake Toppers y Playeras Personalizadas",
    template: "%s | Lumeo"
  },
  description: "Crea productos personalizados únicos en Lumeo. Diseña stickers personalizadas, cake toppers para fiestas y playeras personalizadas. Envío gratis en pedidos mayores a $200.",
  keywords: ["stickers personalizadas", "calcomanías personalizadas", "cake toppers", "toppers para pastel", "playeras personalizadas", "camisetas personalizadas", "productos personalizados", "regalos personalizados", "diseño personalizado"],
  authors: [{ name: "Lumeo" }],
  creator: "Lumeo",
  publisher: "Lumeo",
  metadataBase: new URL('https://lumeo.com'),
  alternates: {
    canonical: '/',
    languages: {
      'es-MX': '/',
      'en-US': '/en',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: 'https://lumeo.com',
    siteName: 'Lumeo',
    title: 'Lumeo - Stickers, Cake Toppers y Playeras Personalizadas',
    description: 'Crea productos personalizados únicos. Diseña stickers, cake toppers y playeras con tus propios diseños. Calidad premium y envío rápido.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Lumeo - Productos Personalizados',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lumeo - Productos Personalizados',
    description: 'Stickers personalizadas, cake toppers y playeras personalizadas. Diseña tus productos únicos.',
    images: ['/og-image.jpg'],
    creator: '@lumeo',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="canonical" href="https://lumeo.com" />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased max-w-8xl mx-auto flex flex-col h-screen`}
        >
          <CartProvider>
            <Navbar />
            <CartSidebar />
            <div className="flex-1">
              {children}
            </div>
            <FooterWrapper />
          </CartProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}