import { Globe, Shield, Zap, MessageSquare, Link, Lock } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Globe,
      title: "Cross-Chain Messaging",
      description: "Send festival messages across multiple blockchains seamlessly using Chainlink CCIP technology."
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Built on Chainlink's battle-tested infrastructure ensuring message delivery and security."
    },
    {
      icon: Zap,
      title: "Instant Delivery",
      description: "Lightning-fast message delivery across chains with minimal latency and maximum reliability."
    },
    {
      icon: MessageSquare,
      title: "Rich Messages",
      description: "Send text, images, and custom data across chains with support for various message formats."
    },
    {
      icon: Link,
      title: "Chainlink CCIP",
      description: "Leveraging Chainlink's Cross-Chain Interoperability Protocol for secure cross-chain communication."
    },
    {
      icon: Lock,
      title: "End-to-End Security",
      description: "Enterprise-grade security with encryption and verification at every step of the process."
    }
  ];

  return (
    <section id="features" className="py-24 bg-gradient-to-b from-background via-background to-muted/20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full px-4 py-2 mb-4">
            <span className="text-sm font-medium bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
              Powered by Chainlink CCIP
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Cross-Chain Festival
            <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent block mt-2">
              Messaging Features
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience the future of cross-chain communication with our advanced festival messaging platform
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-gradient-to-b from-purple-500/5 to-transparent p-8 rounded-2xl border border-purple-500/10 hover:border-purple-500/20 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 text-purple-500" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Chain Support Section */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-semibold text-foreground mb-8">Supported Chains</h3>
          <div className="flex flex-wrap justify-center gap-8">
            {['Avalanche', 'Ethereum', 'Polygon', 'Arbitrum', 'Optimism'].map((chain) => (
              <div
                key={chain}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500/5 to-blue-500/5 border border-purple-500/10 text-foreground font-medium"
              >
                {chain}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
