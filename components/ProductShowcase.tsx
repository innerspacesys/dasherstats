import { Shield, Zap, Database } from 'lucide-react';
import Reveal from './Reveal';

export default function ProductShowcase() {
  return (
    <section className="relative py-24 md:py-32 bg-gradient-to-b from-gray-950 to-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <Reveal>
            <div className="space-y-6">
              <div className="inline-block px-4 py-2 bg-blue-950/30 border border-blue-500/30 rounded-full">
                <span className="text-blue-400 text-sm font-medium">Built for gig work</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold text-white">
                Clear visibility into every dollar
              </h2>

              <p className="text-xl text-gray-400 leading-relaxed">
                DashMetrx helps you see gross earnings, tax reserves, extra holdbacks,
                and real take-home pay in one clean view.
              </p>

              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600/20 to-teal-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Secure & Private</h3>
                    <p className="text-gray-400">
                      Your earnings data stays tied to your account and is handled with privacy in mind.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600/20 to-teal-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Fast to Use</h3>
                    <p className="text-gray-400">
                      Log work sessions quickly and keep moving without digging through messy spreadsheets.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600/20 to-teal-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Database className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Your Data, Organized</h3>
                    <p className="text-gray-400">
                      Keep your earnings history in one place so it is easier to review, import, and understand over time.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="relative">
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 border border-gray-700/50 shadow-2xl">
                <div className="bg-gray-950/50 rounded-xl p-6 mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-400">Today</span>
                    <span className="text-green-400 text-sm font-medium">+$118.40</span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium">Gross earnings</span>
                      <span className="text-white text-lg">$118.40</span>
                    </div>

                    <div className="h-px bg-gray-800" />

                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Tax holdback (20%)</span>
                      <span className="text-red-400">-$24.50</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Extra savings (8%)</span>
                      <span className="text-yellow-400">-$10.00</span>
                    </div>

                    <div className="h-px bg-gray-800" />

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-white font-semibold">Net after holdbacks</span>
                      <span className="text-2xl font-bold text-blue-400">$83.90</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-gray-950/50 rounded-lg p-3 text-center">
                    <div className="text-gray-400 text-xs mb-1">Week</div>
                    <div className="text-white font-semibold">$1,245</div>
                  </div>
                  <div className="bg-gray-950/50 rounded-lg p-3 text-center">
                    <div className="text-gray-400 text-xs mb-1">Month</div>
                    <div className="text-white font-semibold">$4,892</div>
                  </div>
                  <div className="bg-gray-950/50 rounded-lg p-3 text-center">
                    <div className="text-gray-400 text-xs mb-1">Avg/Day</div>
                    <div className="text-white font-semibold">$156</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 -right-6 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl" />
            </div>
          </Reveal>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Reveal delay={0.05}>
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-900/40 p-8 rounded-2xl border border-gray-800/50">
              <div className="text-4xl font-bold text-white mb-2">10 sec</div>
              <p className="text-gray-400">Average time to log a work entry</p>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-900/40 p-8 rounded-2xl border border-gray-800/50">
              <div className="text-4xl font-bold text-white mb-2">100%</div>
              <p className="text-gray-400">Automatic holdback calculations</p>
            </div>
          </Reveal>

          <Reveal delay={0.19}>
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-900/40 p-8 rounded-2xl border border-gray-800/50">
              <div className="text-4xl font-bold text-white mb-2">24/7</div>
              <p className="text-gray-400">Access to your numbers whenever you need them</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}