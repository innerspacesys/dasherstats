import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import HowItWorks from '@/components/HowItWorks';
import ProductShowcase from '@/components/ProductShowcase';
import Pricing from '@/components/Pricing';
import About from '@/components/About';
import RelatedBusinesses from '@/components/RelatedBusinesses';
import Footer from '@/components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-gray-950">
      <Header />
      <Hero />
      <Features />
      <HowItWorks />
      <ProductShowcase />
      <Pricing />
      <About />
      <RelatedBusinesses />
      <Footer />
    </div>
  );
}

export default App;
