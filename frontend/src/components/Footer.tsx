import { Github, Twitter, Linkedin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-border bg-background/80 backdrop-blur-sm py-12 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
          {/* Logo & Description */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center text-white font-bold text-xl">
                FT
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                Festify
              </span>
            </div>
            <p className="text-muted-foreground mb-4">
              Festify is a cross-chain festival messaging platform powered by Avalanche and Chainlink CCIP. Send secure, cross-chain greetings and connect with festival-goers everywhere.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Quick Links</h4>
            <ul className="space-y-2">
              <li><span className="text-muted-foreground hover:text-purple-600 transition-colors cursor-default">Home</span></li>
              <li><span className="text-muted-foreground hover:text-purple-600 transition-colors cursor-default">Features</span></li>
              <li><span className="text-muted-foreground hover:text-purple-600 transition-colors cursor-default">Send Message</span></li>
              <li><span className="text-muted-foreground hover:text-purple-600 transition-colors cursor-default">Explore Chains</span></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Resources</h4>
            <ul className="space-y-2">
              <li><span className="text-muted-foreground hover:text-purple-600 transition-colors cursor-default">Chainlink CCIP</span></li>
              <li><span className="text-muted-foreground hover:text-purple-600 transition-colors cursor-default">Avalanche</span></li>
              <li><span className="text-muted-foreground hover:text-purple-600 transition-colors cursor-default">Support</span></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center border-t border-border pt-6">
          <span className="text-muted-foreground text-sm mb-2 md:mb-0">© {new Date().getFullYear()} Festify. All rights reserved.</span>
          <span className="text-muted-foreground text-sm">Made with <span className="text-red-500">♥</span> by <span className="underline hover:text-purple-600 cursor-default">@ibrahim_193</span> (tg)</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
