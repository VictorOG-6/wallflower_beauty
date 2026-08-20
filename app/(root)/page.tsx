import CTA from "@/components/pages/home/cta";
import Categories from "@/components/pages/home/categories";
import HeroSection from "@/components/pages/home/hero-section";
import Sale from "@/components/pages/home/sale";
import Exclusive from "@/components/pages/home/exclusive";
import Customers from "@/components/pages/home/customers";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <CTA />
      <Categories />
      <Sale />
      <Exclusive />
      <Customers />
    </main>
  );
}
