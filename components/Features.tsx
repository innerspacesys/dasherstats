import { DollarSign, Calculator, PiggyBank, Upload, TrendingUp, Users } from 'lucide-react';

const features = [
  {
    icon: DollarSign,
    title: 'Quick Dash Logging',
    description: 'Log each dash in seconds. Enter your gross earnings and let DashMetrx handle the math.',
  },
  {
    icon: Calculator,
    title: 'Smart Tax Tracking',
    description: 'Automatically calculate and set aside your tax obligations. Never be caught short at tax time.',
  },
  {
    icon: PiggyBank,
    title: 'Extra Savings Goals',
    description: 'Set aside money for gas, maintenance, or any other expense. Build your car fund effortlessly.',
  },
  {
    icon: Upload,
    title: 'Batch Import',
    description: 'Upload your DoorDash history via CSV. Import weeks or months of dashes instantly.',
  },
  {
    icon: TrendingUp,
    title: 'Insightful Analytics',
    description: 'Track patterns, spot trends, and understand your earning velocity over time.',
  },
];

export default function Features() {
  return (
    <section id="features" className="relative py-24 md:py-32 bg-gray-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Everything you need
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Powerful tools designed to help gig drivers understand their real earnings
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group relative bg-gradient-to-br from-gray-900/50 to-gray-900/30 p-8 rounded-2xl border border-gray-800/50 hover:border-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-teal-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

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
          ))}
        </div>
      </div>
    </section>
  );
}
