export default function Footer() {
  return (
    <footer className="relative bg-gray-950 border-t border-gray-800/50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-teal-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">DM</span>
              </div>
              <span className="text-xl font-semibold text-white">DashMetrx</span>
            </div>
            <p className="text-gray-400 leading-relaxed max-w-md">
              Clear visibility into your real earnings. Built for gig drivers who want to understand what they actually take home.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a>
              </li>
              <li>
                <a href="#pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</a>
              </li>
              <li>
                <a href="#about" className="text-gray-400 hover:text-white transition-colors">About</a>
              </li>
              <li>
                <a href="#faq" className="text-gray-400 hover:text-white transition-colors">FAQ</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Account</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Log in</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Get Started</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Support</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800/50 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()}{' '}
            <a
              href="https://www.issioffice.com"
              className="hover:text-white transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Inner Space Systems, Inc.
            </a>
            {' '}All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
