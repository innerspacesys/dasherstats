export default function ComingSoonPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-950 to-gray-900">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.16),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(20,184,166,0.12),transparent_30%)]" />

        <div className="relative max-w-4xl mx-auto px-6 pt-32 pb-24 md:pt-40 md:pb-32">
          <div className="max-w-2xl mx-auto">
            <div className="rounded-3xl border border-gray-800/60 bg-gradient-to-br from-gray-900/80 to-gray-900/40 p-8 md:p-12 text-center shadow-2xl shadow-blue-500/10">
              <div className="inline-flex items-center rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-300 mb-6">
                DashMetrx Mobile Apps
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                We’re working on the apps right now
              </h1>

              <p className="text-lg text-gray-400 leading-relaxed mb-8">
                DashMetrx is currently in development for iPhone and Android.
                We’re getting everything ready and will post the real download
                links here as soon as the apps are available.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/"
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all"
                >
                  Back to Home
                </a>

                <a
                  href="/#features"
                  className="px-6 py-3 rounded-xl border border-gray-700 hover:border-gray-500 text-gray-200 hover:text-white font-semibold transition-all bg-white/[0.02] hover:bg-white/[0.04]"
                >
                  View Features
                </a>
              </div>

              <p className="mt-8 text-sm text-gray-500">
                App Store and Google Play links will be added here when the apps launch.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}