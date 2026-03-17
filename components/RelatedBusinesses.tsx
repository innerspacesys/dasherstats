import { Building2, Globe, Package } from 'lucide-react';

const businesses = [
  {
    name: 'ISSI Office',
    description: 'Professional workspace solutions and office management services',
    icon: Building2,
    href: 'https://www.issioffice.com',
  },
  {
    name: 'ISSI Digital',
    description: 'Digital strategy and web development for modern businesses',
    icon: Globe,
    href: 'https://issidigital.com',
  },
  {
    name: 'Restok',
    description: 'Inventory management and supply tracking made simple',
    icon: Package,
    href: 'https://getrestok.com',
  },
];

export default function RelatedBusinesses() {
  return (
    <section className="relative py-24 md:py-32 bg-gradient-to-b from-gray-950 to-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Explore our family of products
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Practical solutions built by Inner Space Systems, Inc.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {businesses.map((business, idx) => (
            <a
              key={idx}
              href={business.href}
              className="group bg-gradient-to-br from-gray-900/50 to-gray-900/30 p-8 rounded-2xl border border-gray-800/50 hover:border-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-blue-600/20 to-teal-600/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <business.icon className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">
                {business.name}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {business.description}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
