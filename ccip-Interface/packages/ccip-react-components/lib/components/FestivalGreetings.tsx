import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAccount, useReadContract, useWriteContract, useWatchContractEvent } from 'wagmi';
import { parseEther } from 'viem';
import { Button } from './ui/button';
import { ConnectWallet } from './ConnectWallet';
import { cn } from '../utils/cn';

// Contract addresses
const SENDER_CONTRACT = '0x18545C92aa24A6822FB105b70A2f40B169c92C44';
const RECEIVER_CONTRACT = '0xF295339Dbc882Cfe6E9AD0515bF00e3a92b8376f';

// ABI for the contracts
const senderAbi = [
  {
    inputs: [
      { name: 'receiver', type: 'address' },
      { name: 'festivalData', type: 'string' }
    ],
    name: 'sendFestivalData',
    outputs: [{ name: 'messageId', type: 'bytes32' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getLinkToken',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'messageId', type: 'bytes32' },
      { indexed: true, name: 'destinationChainSelector', type: 'uint64' },
      { indexed: false, name: 'receiver', type: 'address' },
      { indexed: false, name: 'festivalData', type: 'string' },
      { indexed: false, name: 'feeToken', type: 'address' },
      { indexed: false, name: 'fees', type: 'uint256' }
    ],
    name: 'FestivalDataSent',
    type: 'event'
  }
] as const;

const receiverAbi = [
  {
    inputs: [],
    name: 'getLastReceivedFestivalData',
    outputs: [
      { name: 'messageId', type: 'bytes32' },
      { name: 'festivalData', type: 'string' }
    ],
    stateMutability: 'view',
    type: 'function'
  }
] as const;

// Form validation schema
const formSchema = z.object({
  greeting: z.string()
    .min(1, 'Greeting is required')
    .max(500, 'Greeting must be less than 500 characters'),
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters'),
  festival: z.string()
    .min(1, 'Festival name is required')
    .max(100, 'Festival name must be less than 100 characters')
});

type FormData = z.infer<typeof formSchema>;

type FestivalDataSentEvent = {
  messageId: `0x${string}`;
  destinationChainSelector: bigint;
  receiver: `0x${string}`;
  festivalData: string;
  feeToken: `0x${string}`;
  fees: bigint;
  transactionHash: `0x${string}`;
};

export function FestivalGreetings() {
  const { address, isConnected } = useAccount();
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transactionHash, setTransactionHash] = useState<`0x${string}` | null>(null);

  // Form setup
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      greeting: '',
      name: '',
      festival: ''
    }
  });

  // Contract reads
  const { data: lastGreeting, refetch: refetchLastGreeting } = useReadContract({
    address: RECEIVER_CONTRACT as `0x${string}`,
    abi: receiverAbi,
    functionName: 'getLastReceivedFestivalData'
  });

  // Contract writes
  const { writeContract, isPending } = useWriteContract();

  // Watch for transaction events
  useWatchContractEvent({
    address: SENDER_CONTRACT as `0x${string}`,
    abi: senderAbi,
    eventName: 'FestivalDataSent',
    onLogs: (logs) => {
      const event = logs[0] as unknown as FestivalDataSentEvent;
      if (event?.transactionHash) {
        setTransactionHash(event.transactionHash);
        refetchLastGreeting();
      }
    },
  });

  // Handle form submission
  const onSubmit = async (data: FormData) => {
    try {
      setIsSending(true);
      setError(null);
      setTransactionHash(null);

      const festivalData = JSON.stringify({
        greeting: data.greeting,
        name: data.name,
        festival: data.festival,
        timestamp: new Date().toISOString()
      });

      await writeContract({
        address: SENDER_CONTRACT as `0x${string}`,
        abi: senderAbi,
        functionName: 'sendFestivalData',
        args: [RECEIVER_CONTRACT, festivalData]
      });

      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send greeting');
    } finally {
      setIsSending(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Connect to Send Festival Greetings</h2>
        <ConnectWallet />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Festival Greetings
        </h1>
        <p className="text-gray-600">
          Send your festival greetings across chains using Chainlink CCIP
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Send Greeting Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">Send a Greeting</h2>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Name
              </label>
              <input
                {...form.register('name')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your name"
              />
              {form.formState.errors.name && (
                <p className="mt-1 text-sm text-red-600">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Festival Name
              </label>
              <input
                {...form.register('festival')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter festival name"
              />
              {form.formState.errors.festival && (
                <p className="mt-1 text-sm text-red-600">{form.formState.errors.festival.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Greeting
              </label>
              <textarea
                {...form.register('greeting')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[100px]"
                placeholder="Write your festival greeting..."
              />
              {form.formState.errors.greeting && (
                <p className="mt-1 text-sm text-red-600">{form.formState.errors.greeting.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={!form.formState.isValid || isSending || isPending}
              className={cn(
                "w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white",
                "hover:from-purple-700 hover:to-blue-700",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              {isSending || isPending ? 'Sending...' : 'Send Greeting'}
            </Button>

            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
            {transactionHash && (
              <p className="mt-2 text-sm text-green-600">
                Transaction sent! Hash: {transactionHash.slice(0, 6)}...{transactionHash.slice(-4)}
              </p>
            )}
          </form>
        </div>

        {/* Received Greetings */}
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">Latest Greeting</h2>
          {lastGreeting ? (
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6">
              <div className="space-y-4">
                {(() => {
                  try {
                    const data = JSON.parse(lastGreeting[1]);
                    return (
                      <>
                        <p className="text-lg font-medium text-gray-800">{data.greeting}</p>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>From: {data.name}</span>
                          <span>Festival: {data.festival}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          Sent at: {new Date(data.timestamp).toLocaleString()}
                        </div>
                      </>
                    );
                  } catch {
                    return <p className="text-gray-600">Invalid greeting data</p>;
                  }
                })()}
              </div>
            </div>
          ) : (
            <p className="text-gray-600">No greetings received yet</p>
          )}
        </div>
      </div>
    </div>
  );
} 