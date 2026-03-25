import Image from 'next/image'
import Reveal from './Reveal'

const businesses = [
  {
    name: 'ISSI Office',
    description: 'Office products, workspace solutions, and archive storage services for businesses.',
    href: 'https://www.issioffice.com',
    logo: '/issilogo.png',
  },
  {
    name: 'ISSI Digital',
    description: 'Modern website design and digital solutions for growing businesses.',
    href: 'https://issidigital.com',
    logo: '/issidiglogo.png',
  },
  {
    name: 'Restok',
    description: 'Simple inventory and supply tracking built for everyday business operations.',
    href: 'https://getrestok.com',
    logo: '/restoklogo.png',
  },
]

export default function RelatedBusinesses() {
  return (
    <section className="relative py-24 md:py-32 bg-gradient-to-b from-gray-950 to-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Explore our family of products
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Practical tools and services built by Inner Space Systems, Inc.
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-8">
          {businesses.map((business, idx) => (
            <Reveal key={idx} delay={idx * 0.08}>
              <a
                href={business.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-2xl border border-gray-800/60 bg-gradient-to-br from-gray-900/70 to-gray-900/30 p-8 transition-all hover:-translate-y-1 hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/10"
              >
                <div className="mb-7 rounded-2xl border border-white/8 bg-white/[0.03] px-5 py-5 min-h-[96px] flex items-center justify-center">
                  <Image
                    src={business.logo}
                    alt={`${business.name} logo`}
                    width={180}
                    height={60}
                    className="h-12 w-auto max-w-full object-contain opacity-90 transition-opacity duration-300 group-hover:opacity-100"
                  />
                </div>

                <h3 className="text-2xl font-semibold text-white mb-3">
                  {business.name}
                </h3>

                <p className="text-gray-400 leading-relaxed">
                  {business.description}
                </p>

                <div className="mt-6 inline-flex items-center text-sm font-medium text-blue-400 group-hover:text-blue-300 transition-colors">
                  Visit site
                  <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}