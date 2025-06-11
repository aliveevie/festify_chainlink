import { Chain } from '@wagmi/core/chains';

export const dispatch: Chain = {
  id: 43_115,
  name: 'Dispatch',
  network: 'dispatch',
  nativeCurrency: {
    decimals: 18,
    name: 'Dispatch',
    symbol: 'DISPATCH',
  },
  rpcUrls: {
    default: { http: ['https://dispatch.avax.network/ext/bc/C/rpc'] },
    public: { http: ['https://dispatch.avax.network/ext/bc/C/rpc'] },
  },
  blockExplorers: {
    default: { name: 'Dispatch Explorer', url: 'https://dispatch.avax.network' },
  },
  testnet: false,
}; 