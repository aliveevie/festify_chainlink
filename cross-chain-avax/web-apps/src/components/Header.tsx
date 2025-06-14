"use client";

import { Web3Provider } from "@0xstt/builderkit";
import { ConnectButton } from "@avalabs/builderkit";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CHAINS } from '../app/constants';

const Header = () => {
  const pathname = usePathname();

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Features', path: '/features' },
  ];

  return (
    <Web3Provider appName="Festify" projectId="YOUR_PROJECT_ID" chains={CHAINS}>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center text-white font-bold text-xl">
                  FT
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                  Festify
                </span>
              </Link>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`text-sm font-medium transition-colors ${
                    pathname === item.path
                      ? 'text-purple-600 dark:text-purple-400'
                      : 'text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Wallet Connect */}
            <div className="flex items-center">
              <ConnectButton />
            </div>
          </div>
        </div>
      </header>
    </Web3Provider>
  );
};

export default Header; 