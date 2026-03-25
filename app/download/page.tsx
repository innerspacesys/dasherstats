import { Apple, Smartphone } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function DownloadPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-950 to-gray-900">
      <Header />
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.16),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(20,184,166,0.12),transparent_30%)]" />

        <div className="relative max-w-6xl mx-auto px-6 pt-32 pb-24 md:pt-40 md:pb-32">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-300 mb-6">
              DashMetrx Mobile Apps
            </div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
              Download DashMetrx
            </h1>

            <p className="text-lg md:text-xl text-gray-400 leading-relaxed mb-10">
              DashMetrx is built for drivers who want a clearer picture of what they
              actually make. Download the app below for iPhone or Android.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <a
              href="/coming-soon"
              className="group rounded-3xl border border-gray-800/60 bg-gradient-to-br from-gray-900/80 to-gray-900/40 p-8 md:p-10 hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/10 transition-all"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <Apple className="w-8 h-8 text-white" />
              </div>

              <p className="text-sm uppercase tracking-[0.18em] text-gray-500 mb-2">
                iPhone
              </p>

              <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">
                Download on the App Store
              </h2>

              <p className="text-gray-400 leading-relaxed mb-6">
                Install DashMetrx for iOS and keep track of your dashes, holdbacks,
                and net earnings on the go.
              </p>

              <div className="inline-flex items-center rounded-xl bg-blue-600 px-5 py-3 text-white font-medium group-hover:bg-blue-500 transition-colors">
                App Store Link (Coming Soon)
              </div>
            </a>

            <a
              href="/coming-soon"
              className="group rounded-3xl border border-gray-800/60 bg-gradient-to-br from-gray-900/80 to-gray-900/40 p-8 md:p-10 hover:border-teal-500/30 hover:shadow-2xl hover:shadow-teal-500/10 transition-all"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <Smartphone className="w-8 h-8 text-white" />
              </div>

              <p className="text-sm uppercase tracking-[0.18em] text-gray-500 mb-2">
                Android
              </p>

              <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">
                Get it on Google Play
              </h2>

              <p className="text-gray-400 leading-relaxed mb-6">
                Download DashMetrx for Android to log earnings, manage holdbacks,
                and stay on top of what you really take home.
              </p>

              <div className="inline-flex items-center rounded-xl bg-teal-600 px-5 py-3 text-white font-medium group-hover:bg-teal-500 transition-colors">
                Google Play Link (Coming Soon)
              </div>
            </a>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}