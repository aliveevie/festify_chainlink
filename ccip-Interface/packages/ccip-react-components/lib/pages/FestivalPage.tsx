import { FestivalGreetings } from '../components/FestivalGreetings';
import { ChooseWallet } from '../components/ConnectWallet';
import { useAppContext } from '@/hooks/useAppContext';

export function FestivalPage() {
  const { isConnectOpen } = useAppContext();
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <FestivalGreetings />
      </div>
      {isConnectOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <ChooseWallet />
        </div>
      )}
    </div>
  );
} 