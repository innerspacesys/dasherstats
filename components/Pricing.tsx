'use client'

import { useState } from 'react';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Standard',
    price: { monthly: '$5', yearly: '$49.95' },
    period: { monthly: '/month', yearly: '/year' },
    description: 'All the basics to track your earnings and stay on top of taxes.',
    features: [
      'Track delivery earnings',
      'Batch CSV import',
      'Advanced analytics',
      'Earning trends & forecasts',
      'Priority support',
      'Export reports',
    ],
    highlighted: true,
    badge: 'One Option',
  },
];

export default function Pricing() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <section id="pricing" className="relative py-24 md:py-32 bg-gradient-to-b from-gray-900 to-gray-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Only one plan. Simple pricing.
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-6">
            Choose either monthly or yearly billing. No hidden fees, no surprises. Just one simple plan to help you track your real earnings.
          </p>

          <div className="inline-flex rounded-full bg-gray-800/40 p-1">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                billingPeriod === 'monthly'
                  ? 'bg-white text-gray-900'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                billingPeriod === 'yearly'
                  ? 'bg-white text-gray-900'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Yearly
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`relative md:col-start-2 bg-gradient-to-br rounded-3xl p-8 transition-all hover:-translate-y-2 ${
                plan.highlighted
                  ? 'from-blue-600/10 to-teal-600/10 border-2 border-blue-500/50 shadow-2xl shadow-blue-500/20'
                  : 'from-gray-900/50 to-gray-900/30 border border-gray-800/50'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-blue-600 to-teal-600 rounded-full">
                  <span className="text-white text-sm font-semibold">{plan.badge}</span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center">
                  <span className="text-5xl font-bold text-white">{plan.price[billingPeriod]}</span>
                  <span className="text-gray-400 ml-1">{plan.period[billingPeriod]}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIdx) => (
                  <li key={featureIdx} className="flex items-start space-x-3">
                    <div className="w-5 h-5 bg-blue-600/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-blue-400" />
                    </div>
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 rounded-xl font-semibold transition-all ${
                  plan.highlighted
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40'
                    : 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700'
                }`}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}