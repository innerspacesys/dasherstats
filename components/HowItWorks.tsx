import { FileText, Calculator, Eye, LineChart } from 'lucide-react';
import Reveal from './Reveal';

const steps = [
  {
    icon: FileText,
    title: 'Log your earnings',
    description: 'Add a work entry in seconds with your gross earnings and keep your records organized.',
  },
  {
    icon: Calculator,
    title: 'DashMetrx calculates',
    description: 'Tax holdbacks and extra savings are automatically applied based on your settings.',
  },
  {
    icon: Eye,
    title: 'See what you keep',
    description: 'View your net earnings after holdbacks so you know what is actually yours to use.',
  },
  {
    icon: LineChart,
    title: 'Track over time',
    description: 'Spot trends, compare periods, and get a clearer view of how your gig work is performing.',
  },
];

export default function HowItWorks() {
  return (
    <section className="relative py-24 md:py-32 bg-gradient-to-b from-gray-950 to-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              How it works
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Four simple steps to get a clearer picture of your real earnings
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

          {steps.map((step, idx) => (
            <Reveal key={idx} delay={idx * 0.08}>
              <div className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="relative z-10 w-20 h-20 bg-gradient-to-br from-blue-600 to-teal-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30">
                    <step.icon className="w-10 h-10 text-white" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-950 rounded-full flex items-center justify-center border-2 border-blue-500">
                      <span className="text-sm font-bold text-blue-400">{idx + 1}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-white mb-3">
                    {step.title}
                  </h3>

                  <p className="text-gray-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}