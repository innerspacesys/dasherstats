'use client'

import { useState, useEffect } from 'react';
import { DollarSign, Plus, Upload, TrendingUp, Settings } from 'lucide-react';

const screens = [
  {
    id: 'dashboard',
    title: 'Today\'s Overview',
    content: (
      <div className="space-y-4">
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
          <div className="text-gray-400 text-sm mb-1">Gross Earnings</div>
          <div className="text-3xl font-bold text-white">$118.40</div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/30">
            <div className="text-gray-400 text-xs mb-1">Tax Holdback</div>
            <div className="text-lg font-semibold text-red-400">-$24.50</div>
          </div>
          <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/30">
            <div className="text-gray-400 text-xs mb-1">Car Fund</div>
            <div className="text-lg font-semibold text-yellow-400">-$10.00</div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-600/20 to-teal-600/20 rounded-xl p-4 border border-blue-500/30">
          <div className="text-gray-300 text-sm mb-1">Net After Holdbacks</div>
          <div className="text-3xl font-bold text-white">$83.90</div>
        </div>
      </div>
    ),
  },
  {
    id: 'add-dash',
    title: 'Log New Dash',
    content: (
      <div className="space-y-4">
        <div className="space-y-3">
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Gross Earnings</label>
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
              <input
                type="text"
                placeholder="$0.00"
                className="bg-transparent text-white text-2xl w-full outline-none"
                value="$45.80"
                readOnly
              />
            </div>
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Date</label>
            <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50 text-white">
              Today, 2:30 PM
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Tax %</label>
              <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50 text-white">
                20%
              </div>
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Extra %</label>
              <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50 text-white">
                8%
              </div>
            </div>
          </div>
        </div>
        <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold">
          Save Dash
        </button>
      </div>
    ),
  },
  {
    id: 'batch',
    title: 'Batch Import',
    content: (
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-800/30 rounded-xl p-6 border border-gray-700/50 text-center">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <div className="text-white font-semibold mb-1">Import CSV</div>
          <div className="text-gray-400 text-sm">Upload your DoorDash earnings history</div>
        </div>
        <div className="space-y-2">
          <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/30 flex items-center justify-between">
            <div>
              <div className="text-white text-sm font-medium">Jan 15 - Jan 21</div>
              <div className="text-gray-400 text-xs">12 dashes imported</div>
            </div>
            <div className="text-green-400 text-sm font-semibold">$842.50</div>
          </div>
          <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/30 flex items-center justify-between">
            <div>
              <div className="text-white text-sm font-medium">Jan 8 - Jan 14</div>
              <div className="text-gray-400 text-xs">15 dashes imported</div>
            </div>
            <div className="text-green-400 text-sm font-semibold">$1,024.20</div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'insights',
    title: 'Insights',
    content: (
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-blue-600/20 to-teal-600/20 rounded-xl p-4 border border-blue-500/30">
          <div className="text-gray-300 text-sm mb-1">This Week</div>
          <div className="text-2xl font-bold text-white mb-2">$1,245.80</div>
          <div className="flex items-center text-green-400 text-sm">
            <TrendingUp className="w-4 h-4 mr-1" />
            +12% vs last week
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/30">
            <div className="text-gray-400 text-xs mb-1">Avg per Dash</div>
            <div className="text-xl font-semibold text-white">$32.50</div>
          </div>
          <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/30">
            <div className="text-gray-400 text-xs mb-1">Total Dashes</div>
            <div className="text-xl font-semibold text-white">38</div>
          </div>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
          <div className="text-gray-300 text-sm mb-3">Holdback Summary</div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Tax reserve</span>
              <span className="text-red-400 font-medium">$249.16</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Car fund</span>
              <span className="text-yellow-400 font-medium">$99.66</span>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'settings',
    title: 'Settings',
    content: (
      <div className="space-y-4">
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
          <div className="text-white font-semibold mb-3">Default Holdbacks</div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">Tax percentage</span>
              <span className="text-white font-medium">20%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">Extra holdback</span>
              <span className="text-white font-medium">8%</span>
            </div>
          </div>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
          <div className="text-white font-semibold mb-3">Account</div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">Email</span>
              <span className="text-white text-sm">driver@email.com</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">Plan</span>
              <span className="text-blue-400 text-sm font-medium">Standard</span>
            </div>
          </div>
        </div>
        <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/30">
          <div className="flex items-center justify-between">
            <span className="text-gray-300 text-sm">Dark mode</span>
            <div className="w-12 h-6 bg-blue-600 rounded-full flex items-center justify-end px-1">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
];

export default function PhoneMockup() {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentScreen((prev) => (prev + 1) % screens.length);
        setIsTransitioning(false);
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const screen = screens[currentScreen];
  const Icon = [DollarSign, Plus, Upload, TrendingUp, Settings][currentScreen];

  return (
    <div className="relative animate-float">
      <div className="relative w-[300px] h-[600px] md:w-[340px] md:h-[680px] bg-gray-900 rounded-[3rem] border-[8px] border-gray-800 shadow-2xl overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-gray-900 rounded-b-3xl z-10"></div>

        <div className="relative w-full h-full bg-gradient-to-br from-gray-950 to-gray-900 p-6 overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Icon className="w-5 h-5 text-blue-400" />
              <h2 className={`text-white font-semibold transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
                {screen.title}
              </h2>
            </div>
            <div className="flex space-x-1">
              {screens.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    idx === currentScreen ? 'bg-blue-500 w-4' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className={`transition-all duration-300 ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
            {screen.content}
          </div>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent rounded-[3rem] pointer-events-none blur-2xl"></div>
    </div>
  );
}
