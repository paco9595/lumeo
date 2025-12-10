import type { Metadata } from "next";
import Hero from "@/components/hero";
// import Categories from "@/components/home/Categories";
import FeaturedCards from "@/components/home/FeaturedCards";
import { BestSellers } from "@/components/home/BestSellers";
import { Features } from "@/components/home/Features";

export const metadata: Metadata = {
  title: "Inicio - Diseña Tus Productos Personalizados",
  description: "Descubre la nueva colección de productos personalizados en Lumeo. Stickers personalizadas, cake toppers únicos y playeras personalizadas. Crea diseños únicos para ti o como regalo perfecto.",
  openGraph: {
    title: "Lumeo - Productos Personalizados 2025",
    description: "Crea stickers, cake toppers y playeras personalizadas con diseños únicos. Calidad premium y envío rápido.",
    images: ['/og-home.jpg'],
  },
};

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <Hero />
        {/* <Categories /> */}
        <FeaturedCards />
        <BestSellers />
        <Features />
      </div>
    </div>
  );
}
