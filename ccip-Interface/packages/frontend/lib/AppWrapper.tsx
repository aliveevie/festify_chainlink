import { Providers } from './AppProviders';
import { FestivalGreetings } from './components/FestivalGreetings';
import { ConfigProps } from './types';

export function AppWrapper({ config, networkConfig }: ConfigProps) {
  return (
    <Providers config={config} networkConfig={networkConfig}>
      <FestivalGreetings />
    </Providers>
  );
} 