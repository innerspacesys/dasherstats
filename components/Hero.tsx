import { ArrowRight } from 'lucide-react';
import PhoneMockup from './PhoneMockup';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-950 pt-20">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950/20 via-gray-950 to-gray-950"></div>
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-glow"></div>

      <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="text-center lg:text-left space-y-8 animate-fadeInUp">
            <div className="inline-block px-4 py-2 bg-blue-950/30 border border-blue-500/30 rounded-full">
              <span className="text-blue-400 text-sm font-medium">Track Your Real Earnings</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              Know what you
              <span className="block bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
                really earned
              </span>
            </h1>

            <p className="text-xl text-gray-400 leading-relaxed max-w-xl">
              Log your dashes, track tax holdbacks and car maintenance, and see your actual take-home pay.
              Simple, clear, and built for gig drivers.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button className="group px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all hover:shadow-xl hover:shadow-blue-500/30 hover:scale-105 flex items-center justify-center space-x-2">
                <span>Get Started Free</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
             
            </div>
          </div>

          <div className="relative flex justify-center lg:justify-end">
            <PhoneMockup />

            <div className="absolute top-20 -left-4 md:left-0 bg-gray-900/90 backdrop-blur-xl border border-gray-700/50 rounded-xl p-4 shadow-2xl animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              <div className="text-gray-400 text-xs mb-1">Gross</div>
              <div className="text-green-400 text-xl font-bold">$118.40</div>
            </div>

            <div className="absolute top-40 -right-5 md:-right-22 bg-gray-900/90 backdrop-blur-xl border border-gray-700/50 rounded-xl p-4 shadow-2xl animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
              <div className="text-gray-400 text-xs mb-1">Tax holdback</div>
              <div className="text-red-400 text-xl font-bold">$24.50</div>
            </div>

            <div className="absolute bottom-32 -left-4 md:left-0 bg-gray-900/90 backdrop-blur-xl border border-gray-700/50 rounded-xl p-4 shadow-2xl animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
              <div className="text-gray-400 text-xs mb-1">Car maintenance</div>
              <div className="text-yellow-400 text-xl font-bold">$10.00</div>
            </div>

            <div className="absolute -bottom-15 -right-10 md:-right-12 bg-gradient-to-br from-blue-600/20 to-teal-600/20 backdrop-blur-xl border border-blue-500/50 rounded-xl p-4 shadow-2xl animate-fadeInUp" style={{ animationDelay: '0.8s' }}>
              <div className="text-gray-300 text-xs mb-1">Net after holdbacks</div>
              <div className="text-white text-2xl font-bold">$83.90</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
