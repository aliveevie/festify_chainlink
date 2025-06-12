import { ArrowRight, Sparkles, MessageSquare, Globe, Send } from 'lucide-react';
import { ConnectButton } from "@avalabs/builderkit";

const Hero = () => {
  return (
    <section id="home" className="min-h-[90vh] flex items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Badge */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-sm rounded-full px-6 py-3 border border-purple-500/20">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <span className="text-sm font-medium bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
              Powered by Chainlink CCIP
            </span>
          </div>
        </div>
        
        {/* Main Title */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-foreground mb-8 leading-tight">
          Send Festival
          <span className="bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600 bg-clip-text text-transparent block mt-2">
            Messages Across Chains
          </span>
        </h1>
        
        {/* Description */}
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
          Connect with festival-goers across different blockchains using Chainlink CCIP. 
          Send secure, cross-chain messages and greetings powered by Avalanche and Chainlink.
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
          <button className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition-all duration-300 flex items-center space-x-3 group shadow-lg shadow-purple-500/20">
            <MessageSquare className="w-5 h-5" />
            <span>Send Message</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="border border-purple-500/20 text-foreground px-8 py-4 rounded-xl font-semibold text-lg hover:bg-purple-500/5 transition-all duration-300 flex items-center space-x-3">
            <Globe className="w-5 h-5" />
            <span>Explore Chains</span>
          </button>
        </div>

        {/* Connect Wallet Section */}
        <div className="bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-2xl p-8 border border-purple-500/20 max-w-2xl mx-auto">
          <div className="flex flex-col items-center space-y-4">
            <Send className="w-8 h-8 text-purple-500" />
            <h3 className="text-xl font-semibold text-foreground">Connect Your Wallet to Start</h3>
            <p className="text-muted-foreground text-center mb-4">
              Connect your wallet to send cross-chain festival messages using Chainlink CCIP
            </p>
            <ConnectButton className="!bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 !text-white !font-medium !px-6 !py-3 !rounded-xl !transition-all !duration-200 !shadow-lg !shadow-purple-500/20" />
          </div>
        </div>
        
        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="bg-gradient-to-b from-purple-500/5 to-transparent p-6 rounded-xl border border-purple-500/10">
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">5+</div>
            <div className="text-muted-foreground">Supported Chains</div>
          </div>
          <div className="bg-gradient-to-b from-purple-500/5 to-transparent p-6 rounded-xl border border-purple-500/10">
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">100%</div>
            <div className="text-muted-foreground">Secure Messages</div>
          </div>
          <div className="bg-gradient-to-b from-purple-500/5 to-transparent p-6 rounded-xl border border-purple-500/10">
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">24/7</div>
            <div className="text-muted-foreground">Cross-Chain Support</div>
          </div>
          <div className="bg-gradient-to-b from-purple-500/5 to-transparent p-6 rounded-xl border border-purple-500/10">
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">10k+</div>
            <div className="text-muted-foreground">Messages Sent</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
