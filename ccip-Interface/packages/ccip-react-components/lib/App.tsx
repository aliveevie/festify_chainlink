'use client';

import { forwardRef } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { Default } from '@/AppDefault';
import { Providers } from '@/AppProviders';
import { Drawer } from '@/components/Drawer';
import { cn } from '@/utils';
import { ConfigProps, TDrawer } from '@/types';
import { FestivalPage } from './pages/FestivalPage';

export const App = forwardRef<TDrawer, ConfigProps>(
  ({ config, drawer, networkConfig }, ref) => {
    if (config?.variant === 'drawer') {
      return (
        <Providers config={config} networkConfig={networkConfig}>
          <div className="flex items-center justify-center min-h-screen w-full">
            <Drawer open={drawer?.open} ref={ref}>
              <Container>
                <FestivalPage />
              </Container>
            </Drawer>
          </div>
        </Providers>
      );
    }

    return (
      <Providers config={config} networkConfig={networkConfig}>
        <div className="flex items-center justify-center min-h-screen w-full">
          <Container>
            <FestivalPage />
          </Container>
        </div>
      </Providers>
    );
  }
);

const Container = ({ children }: { children: React.ReactNode }) => {
  const { style, variant } = useTheme();

  return (
    <div
      className="bg-ccip-background text-ccip-text w-full h-full"
      style={style}
    >
      {children}
    </div>
  );
};
