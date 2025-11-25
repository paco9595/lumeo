import Hero from "@/components/hero";
import Categories from "@/components/home/Categories";
import FeaturedCards from "@/components/home/FeaturedCards";
import BestSellers from "@/components/home/BestSellers";
import Features from "@/components/home/Features";

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <Hero />
        <Categories />
        <FeaturedCards />
        <BestSellers />
        <Features />
      </div>
    </div>
  );
}
