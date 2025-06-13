import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAccount, useReadContract, useWriteContract, useWatchContractEvent } from 'wagmi';
import { parseEther } from 'viem';
import { Button } from './ui/button';
import { ConnectWallet } from './ConnectWallet';
import { cn } from '../utils/cn';
import { Sparkles } from 'lucide-react';
import { useChains } from '@/hooks/useChains';
import { Copy, ArrowRight, Eye } from 'lucide-react';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from './ui/select';

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

const CHAIN_COLORS: Record<string, string> = {
  'Avalanche Fuji': 'bg-red-500',
  'Ethereum Sepolia': 'bg-blue-500',
  'Arbitrum Sepolia': 'bg-orange-500',
  'Polygon Mumbai': 'bg-fuchsia-500',
  'Optimism Sepolia': 'bg-pink-400',
};

const MANUAL_CHAINS = [
  { chainId: '43113', label: 'Avalanche Fuji', color: 'bg-red-500' },
  { chainId: '11155111', label: 'Ethereum Sepolia', color: 'bg-blue-500' },
  { chainId: '421614', label: 'Arbitrum Sepolia', color: 'bg-orange-500' },
  { chainId: '80001', label: 'Polygon Mumbai', color: 'bg-fuchsia-500' },
  { chainId: '11155420', label: 'Optimism Sepolia', color: 'bg-pink-400' },
];

export function FestivalGreetings() {
  const { address, isConnected } = useAccount();
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transactionHash, setTransactionHash] = useState<`0x${string}` | null>(null);
  const [messageId, setMessageId] = useState<string | null>(null);
  const [sentGreetings, setSentGreetings] = useState<Array<{
    greeting: string;
    name: string;
    festival: string;
    timestamp: string;
    transactionHash: string;
    messageId?: string;
    fromChain: string;
    toChain: string;
  }>>([]);
  const [fromChain, setFromChain] = useState<string | undefined>(MANUAL_CHAINS[0].chainId);
  const [toChain, setToChain] = useState<string | undefined>(MANUAL_CHAINS[1].chainId);
  const { chainsInfo } = useChains();

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
        setMessageId(event.messageId);
        refetchLastGreeting();
        try {
          const data = JSON.parse(event.festivalData);
          setSentGreetings((prev) => [
            {
              greeting: data.greeting,
              name: data.name,
              festival: data.festival,
              timestamp: data.timestamp,
              transactionHash: event.transactionHash,
              messageId: event.messageId,
              fromChain: fromChain || '',
              toChain: toChain || '',
            },
            ...prev.slice(0, 4)
          ]);
        } catch {}
      }
    },
  });

  // Handle form submission
  const onSubmit = async (data: FormData) => {
    if (!fromChain || !toChain) {
      setError('Please select both source and destination chains.');
      return;
    }
    try {
      setIsSending(true);
      setError(null);
      setTransactionHash(null);
      setMessageId(null);

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

  // Copy to clipboard helper
  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
  }, []);

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl shadow-2xl border border-gray-100">
        <Sparkles className="w-10 h-10 text-purple-500 mb-4 animate-pulse" />
        <h2 className="text-3xl font-extrabold text-gray-800 mb-2 tracking-tight">Connect to Send Festival Greetings</h2>
        <p className="text-gray-500 mb-6 text-center max-w-xs">Connect your wallet to send and receive greetings across chains.</p>
        <ConnectWallet />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-white to-purple-50 py-12 px-2">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center mb-2">
          <Sparkles className="w-8 h-8 text-purple-600 mr-2" />
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">Festival Greetings</h1>
        </div>
        <p className="text-lg text-gray-500 font-medium max-w-2xl mx-auto">
          Send your festival greetings across chains using <span className="font-semibold text-purple-600">Chainlink CCIP</span>
        </p>
      </div>
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 flex flex-col space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center mb-4">
            <Sparkles className="w-6 h-6 text-purple-500 mr-2" />
            Send a Greeting
          </h2>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-1">Your Name</label>
              <input
                {...form.register('name')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base"
                placeholder="Enter your name"
              />
              {form.formState.errors.name && (
                <p className="mt-1 text-xs text-red-600">{form.formState.errors.name.message}</p>
              )}
            </div>
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-1">Festival Name</label>
              <input
                {...form.register('festival')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base"
                placeholder="e.g., Diwali, Christmas, Eid, Chinese New Year"
              />
              {form.formState.errors.festival && (
                <p className="mt-1 text-xs text-red-600">{form.formState.errors.festival.message}</p>
              )}
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full">
                <label className="block text-base font-semibold text-gray-700 mb-1">From Chain</label>
                <Select value={fromChain} onValueChange={setFromChain}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select source chain" />
                  </SelectTrigger>
                  <SelectContent>
                    {MANUAL_CHAINS.map((chain) => (
                      <SelectItem key={chain.chainId} value={chain.chainId}>
                        <span className="flex items-center gap-2">
                          <span className={`w-3 h-3 rounded-full ${chain.color}`} />
                          {chain.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full">
                <label className="block text-base font-semibold text-gray-700 mb-1">To Chain</label>
                <Select value={toChain} onValueChange={setToChain}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select destination chain" />
                  </SelectTrigger>
                  <SelectContent>
                    {MANUAL_CHAINS.map((chain) => (
                      <SelectItem key={chain.chainId} value={chain.chainId}>
                        <span className="flex items-center gap-2">
                          <span className={`w-3 h-3 rounded-full ${chain.color}`} />
                          {chain.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-1">Your Greeting</label>
              <textarea
                {...form.register('greeting')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[100px] text-base"
                placeholder="Write your festival greeting..."
              />
              {form.formState.errors.greeting && (
                <p className="mt-1 text-xs text-red-600">{form.formState.errors.greeting.message}</p>
              )}
            </div>
            <Button
              type="submit"
              disabled={!form.formState.isValid || isSending || isPending}
              className={cn(
                "w-full bg-gradient-to-r from-purple-600 to-pink-400 text-white font-bold py-3 rounded-lg shadow-md flex items-center justify-center gap-2 text-lg",
                "hover:from-purple-700 hover:to-pink-500 hover:shadow-lg transition-all duration-150",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              <Sparkles className="w-5 h-5" />
              {isSending || isPending ? 'Sending...' : 'Send Greeting'}
            </Button>
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
            {transactionHash && (
              <div className="mt-4 flex flex-col gap-2">
                <span className="text-green-700 text-sm font-medium flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Transaction sent!
                  <a
                    href={`https://ccip.chain.link/tx/${transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-blue-600 hover:text-blue-800 ml-1"
                  >
                    View on CCIP Explorer
                  </a>
                </span>
                <span className="text-xs text-gray-700 flex items-center gap-2">
                  Hash: {transactionHash.slice(0, 8)}...{transactionHash.slice(-6)}
                  <button type="button" onClick={() => copyToClipboard(transactionHash)}><Copy className="w-4 h-4" /></button>
                </span>
                {messageId && (
                  <span className="text-xs text-gray-700 flex items-center gap-2">
                    CCIP Message ID: {messageId.slice(0, 8)}...{messageId.slice(-6)}
                    <button type="button" onClick={() => copyToClipboard(messageId)} className="ml-1"><Copy className="w-4 h-4" /></button>
                    <a
                      href={`https://ccip.chain.link/msg/${messageId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-blue-600 hover:text-blue-800 ml-1"
                    >
                      View Message
                    </a>
                  </span>
                )}
              </div>
            )}
          </form>
        </div>
        {/* Right: Recent Greetings Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 flex flex-col space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center mb-4">
            <Sparkles className="w-6 h-6 text-purple-500 mr-2" />
            Recent Greetings
          </h2>
          {sentGreetings.length === 0 ? (
            <div className="text-gray-500 text-center py-8">No greetings sent yet.</div>
          ) : (
            <div className="flex flex-col gap-6">
              {sentGreetings.map((g, idx) => {
                const from = MANUAL_CHAINS.find(c => c.chainId === g.fromChain);
                const to = MANUAL_CHAINS.find(c => c.chainId === g.toChain);
                return (
                  <div
                    key={g.transactionHash + idx}
                    className="bg-white rounded-xl border border-gray-200 p-6"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl font-bold text-gray-900">{g.festival}</span>
                      <span className="ml-2 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 flex items-center gap-1">
                        <svg className="w-4 h-4 inline-block" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        Delivered
                      </span>
                    </div>
                    <div className="text-sm text-gray-700 mb-1">From {g.name}</div>
                    <div className="text-xs text-gray-500 mb-2">{new Date(g.timestamp).toLocaleString()}</div>
                    <div className="bg-purple-50 rounded-lg p-4 text-base text-gray-800 mb-4 border border-purple-100">"{g.greeting}"</div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${from?.color}`} />
                        <span className="text-sm font-medium text-gray-700">{from?.label || g.fromChain}</span>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400" />
                      <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${to?.color}`} />
                        <span className="text-sm font-medium text-gray-700">{to?.label || g.toChain}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                      <div>
                        <div className="text-xs text-gray-500 font-semibold mb-1">TRANSACTION HASH</div>
                        <div className="flex items-center gap-2 text-sm font-mono bg-gray-50 rounded px-2 py-1">
                          {g.transactionHash.slice(0, 8)}...{g.transactionHash.slice(-6)}
                          <button type="button" onClick={() => copyToClipboard(g.transactionHash)}><Copy className="w-4 h-4" /></button>
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 font-semibold mb-1">CCIP MESSAGE ID</div>
                        <div className="flex items-center gap-2 text-sm font-mono bg-gray-50 rounded px-2 py-1">
                          {g.messageId ? (
                            <>
                              {g.messageId.slice(0, 8)}...{g.messageId.slice(-6)}
                              <button type="button" onClick={() => copyToClipboard(g.messageId!)}><Copy className="w-4 h-4" /></button>
                            </>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mt-2">
                      <a
                        href={`https://ccip.chain.link/tx/${g.transactionHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm font-semibold text-gray-800 transition"
                      >
                        <Eye className="w-4 h-4" />
                        View in CCIP Explorer
                      </a>
                      {g.messageId && (
                        <a
                          href={`https://ccip.chain.link/msg/${g.messageId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm font-semibold text-gray-800 transition ml-2"
                        >
                          <Eye className="w-4 h-4" />
                          View Message
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 