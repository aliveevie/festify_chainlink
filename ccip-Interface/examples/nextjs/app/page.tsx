'use client';

import { AppWrapper } from '@chainlink/ccip-react-components';
import { config } from '../config';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <AppWrapper 
        config={{
          variant: 'default',
          theme: 'dark',
          showHeader: true,
          showFooter: true,
        }}
        networkConfig={config}
      />
    </main>
  );
}
