import { DollarSign, Calculator, PiggyBank, Upload, TrendingUp } from 'lucide-react';
import Reveal from './Reveal';

const features = [
  {
    icon: DollarSign,
    title: 'Quick Earnings Logging',
    description:
      'Log each work session in seconds. Enter your gross earnings and let DashMetrx handle the math.',
  },
  {
    icon: Calculator,
    title: 'Smart Tax Tracking',
    description:
      'Automatically calculate and set aside your tax obligations so you have a clearer picture of what you actually keep.',
  },
  {
    icon: PiggyBank,
    title: 'Extra Savings Goals',
    description:
      'Set aside money for gas, maintenance, repairs, or any other expense and build your cushion over time.',
  },
  {
    icon: Upload,
    title: 'Flexible Importing',
    description:
      'Bring in earnings manually, by spreadsheet, or from screenshots so you can add past work without re-entering everything.',
  },
  {
    icon: TrendingUp,
    title: 'Insightful Analytics',
    description:
      'Spot trends, monitor patterns, and understand how your gig work is really performing over time.',
  },
];

export default function Features() {
  return (
    <section id="features" className="relative py-24 md:py-32 bg-gray-950">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Everything you need
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Practical tools built to help gig workers understand their real earnings
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-8">
          {features.map((feature, idx) => {
            const isLastTwo = idx >= 3;

            return (
              <Reveal
                key={idx}
                delay={idx * 0.08}
                className={isLastTwo ? 'xl:col-span-3' : 'xl:col-span-2'}
              >
                <div className="group relative h-full bg-gradient-to-br from-gray-900/50 to-gray-900/30 p-8 rounded-2xl border border-gray-800/50 hover:border-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-teal-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600/20 to-teal-600/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <feature.icon className="w-6 h-6 text-blue-400" />
                    </div>

                    <h3 className="text-xl font-semibold text-white mb-3">
                      {feature.title}
                    </h3>

                    <p className="text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}