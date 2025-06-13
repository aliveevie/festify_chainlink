import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './styles.css';
import { ConfigProps, Config, NetworkConfig } from './types';
import { sepolia } from 'viem/chains';

// Development configuration
const config: Config = {
  variant: 'default',
  theme: {
    palette: {
      primary: '#000000',
      background: '#FFFFFF',
      border: '#B3B7C0',
      text: '#000000',
      muted: '#6D7480',
      input: '#FFFFFF',
      popover: '#F5F7FA',
      selected: '#D7DBE0',
      warning: '#F7B955',
      warningBackground: '#FFF5E0',
    },
    shape: {
      radius: 6,
    },
  },
};

// Network configuration
const networkConfig: NetworkConfig = {
  chains: [
    {
      chain: sepolia,
      logoURL: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg',
    },
  ],
  tokensList: [
    {
      symbol: 'LINK',
      address: {
        [sepolia.id]: '0x779877A7B0D9E8603169DdbD7836e478b4624789',
      },
      logoURL: 'https://cryptologos.cc/logos/chainlink-link-logo.svg',
      tags: ['ccip', 'testnet'],
    },
  ],
  linkContracts: {
    [sepolia.id]: '0x779877A7B0D9E8603169DdbD7836e478b4624789',
  },
  routerAddresses: {
    [sepolia.id]: '0x0BF3dE8c5D3e8A2A34fC9F33FB1B9809540374E8',
  },
  chainSelectors: {
    [sepolia.id]: '16015286601757825753',
    43113: '14767482510784806043', // Avalanche Fuji
  },
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App config={config} networkConfig={networkConfig} />
  </React.StrictMode>
); 