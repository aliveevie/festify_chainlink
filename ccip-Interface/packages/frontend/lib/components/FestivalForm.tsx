import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useContractWrite, useWaitForTransaction } from 'wagmi';
import { SendButton } from './SendButton';
import { Error } from './Error';
import { cn } from '../utils/cn';

// Contract addresses
const SENDER_CONTRACT = '0x18545C92aa24A6822FB105b70A2f40B169c92C44';
const RECEIVER_CONTRACT = '0xF295339Dbc882Cfe6E9AD0515bF00e3a92b8376f';

// ABI for the sender contract
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

export function FestivalForm() {
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form setup
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      greeting: '',
      name: '',
      festival: ''
    }
  });

  // Contract writes
  const { write: sendGreeting, data: sendData } = useContractWrite({
    address: SENDER_CONTRACT as `0x${string}`,
    abi: senderAbi,
    functionName: 'sendFestivalData'
  });

  const { isLoading: isTransactionLoading } = useWaitForTransaction({
    hash: sendData?.hash
  });

  // Handle form submission
  const onSubmit = async (data: FormData) => {
    try {
      setIsSending(true);
      setError(null);

      const festivalData = JSON.stringify({
        greeting: data.greeting,
        name: data.name,
        festival: data.festival,
        timestamp: new Date().toISOString()
      });

      await sendGreeting({
        args: [RECEIVER_CONTRACT, festivalData]
      });

      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send greeting');
    } finally {
      setIsSending(false);
    }
  };

  return (
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

      <SendButton
        isLoading={isSending || isTransactionLoading}
        disabled={!form.formState.isValid || isSending || isTransactionLoading}
        className="w-full"
      >
        Send Greeting
      </SendButton>

      {error && <Error message={error} />}
    </form>
  );
} 