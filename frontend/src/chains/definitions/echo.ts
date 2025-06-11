import { Chain } from '@wagmi/core/chains';

export const echo: Chain = {
  id: 43_114,
  name: 'Echo',
  network: 'echo',
  nativeCurrency: {
    decimals: 18,
    name: 'Echo',
    symbol: 'ECHO',
  },
  rpcUrls: {
    default: { http: ['https://echo.avax.network/ext/bc/C/rpc'] },
    public: { http: ['https://echo.avax.network/ext/bc/C/rpc'] },
  },
  blockExplorers: {
    default: { name: 'Echo Explorer', url: 'https://echo.avax.network' },
  },
  testnet: false,
}; 