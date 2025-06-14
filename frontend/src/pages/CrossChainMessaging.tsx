import { useState } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { ConnectButton } from '@avalabs/builderkit';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { FaPaperPlane, FaLink } from 'react-icons/fa';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

const CHAIN_OPTIONS = [
  { label: 'Fuji (Avalanche Testnet)', value: 'fuji' },
  { label: 'Avalanche C-Chain', value: 'avalanche' },
  { label: 'Subnet', value: 'subnet' },
];

// Contract addresses from README.md
const CROSS_CHAIN_CONTRACT_ADDRESS = '0x8df379BbCCFDa5E8A0ca0D14889d49ba39613F15'; // Fuji Sender Contract
const RECEIVER_CONTRACT_ADDRESS = '0x75773539b96E90A18408a30b4eeb16D511B37AA4'; // Subnet Receiver

// Basic ABI for the cross-chain messaging contract
const CROSS_CHAIN_CONTRACT_ABI = [
  {
    "inputs": [
      { "internalType": "string", "name": "destinationChain", "type": "string" },
      { "internalType": "string", "name": "festivalName", "type": "string" },
      { "internalType": "string", "name": "festivalDescription", "type": "string" }
    ],
    "name": "sendCrossChainFestival",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "sender", "type": "address" },
      { "indexed": false, "internalType": "string", "name": "destinationChain", "type": "string" },
      { "indexed": false, "internalType": "string", "name": "festivalName", "type": "string" }
    ],
    "name": "FestivalMessageSent",
    "type": "event"
  }
] as const;

export default function CrossChainMessaging() {
  const { address } = useAccount();
  const [destinationChain, setDestinationChain] = useState('');
  const [festivalName, setFestivalName] = useState('');
  const [festivalDescription, setFestivalDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const { writeContract, data: hash } = useWriteContract();

  const { isLoading, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!writeContract) return;

    try {
      setLoading(true);
      writeContract({
        address: CROSS_CHAIN_CONTRACT_ADDRESS,
        abi: CROSS_CHAIN_CONTRACT_ABI,
        functionName: 'sendCrossChainFestival',
        args: [destinationChain, festivalName, festivalDescription],
      });
      toast.success('Cross-chain festival message sent!');
    } catch (error) {
      console.error('Error sending cross-chain message:', error);
      toast.error('Failed to send cross-chain message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 mt-16 flex flex-col items-center min-h-[80vh]">
      <Card className="w-full max-w-2xl shadow-xl border-0">
        <div className="rounded-t-xl bg-gradient-to-r from-purple-600 to-blue-500 p-6 flex items-center space-x-3">
          <FaPaperPlane className="text-white text-2xl" />
          <div>
            <CardTitle className="text-white text-2xl font-bold">Cross-Chain Festival Messaging</CardTitle>
            <CardDescription className="text-white/90 text-base mt-1">
              Send festival information from Fuji to Subnet using cross-chain messaging
            </CardDescription>
          </div>
        </div>
        <CardContent className="pt-6 pb-2 px-6">
          <div className="mb-4 text-xs text-gray-500 flex flex-col gap-1">
            <span className="flex items-center gap-1"><FaLink /> Sender: <span className="font-mono">{CROSS_CHAIN_CONTRACT_ADDRESS}</span></span>
            <span className="flex items-center gap-1"><FaLink /> Receiver: <span className="font-mono">{RECEIVER_CONTRACT_ADDRESS}</span></span>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="destinationChain" className="text-base font-semibold">Destination Chain</Label>
              <Select value={destinationChain} onValueChange={setDestinationChain} required>
                <SelectTrigger className="mt-1 focus:ring-2 focus:ring-blue-400">
                  <SelectValue placeholder="Select destination chain" />
                </SelectTrigger>
                <SelectContent>
                  {CHAIN_OPTIONS.map((chain) => (
                    <SelectItem key={chain.value} value={chain.value}>
                      {chain.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="festivalName" className="text-base font-semibold">Festival Name</Label>
              <Input
                id="festivalName"
                value={festivalName}
                onChange={(e) => setFestivalName(e.target.value)}
                placeholder="Enter festival name"
                required
                className="mt-1 focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <Label htmlFor="festivalDescription" className="text-base font-semibold">Festival Description</Label>
              <Textarea
                id="festivalDescription"
                value={festivalDescription}
                onChange={(e) => setFestivalDescription(e.target.value)}
                placeholder="Enter festival description"
                required
                className="mt-1 min-h-[100px] focus:ring-2 focus:ring-blue-400"
              />
            </div>
            {!address ? (
              <div className="flex justify-center">
                <ConnectButton />
              </div>
            ) : (
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg text-lg flex items-center justify-center gap-2"
                disabled={loading || isLoading || !writeContract || !destinationChain}
              >
                <FaPaperPlane />
                {loading || isLoading ? "Sending..." : "Send Cross-Chain Message"}
              </Button>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 px-6 pb-6">
          {isSuccess && (
            <div className="text-sm text-green-600 dark:text-green-400">
              Transaction successful! View on explorer:{" "}
              <a
                href={`https://snowtrace.io/tx/${hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                {hash}
              </a>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
