import { ConnectButton } from "@avalabs/builderkit";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const Header = () => {
  const location = useLocation();

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Features', path: '/features' },
    { label: 'Events', path: '/events' },
    { label: 'Create', path: '/create' },
    { label: 'Cross-Chain', path: '/cross-chain' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <span className="flex items-center space-x-3 group cursor-default">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl transform transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
                FT
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Festify
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 -mt-1">Avalanche Events</span>
              </div>
            </span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer text-gray-600 dark:text-gray-300",
                  location.pathname === item.path
                    ? "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 shadow"
                    : "hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Wallet Connect */}
          <div className="flex items-center space-x-4">
            <ConnectButton 
              className="!bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 !text-white !font-medium !px-4 !py-2 !rounded-lg !transition-all !duration-200 !shadow-sm hover:!shadow-md"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 