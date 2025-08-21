'use client';

import { useState, useEffect } from 'react';

interface WalletData {
  address: string;
  balance: string;
  isLoading: boolean;
}

export default function WalletInfo() {
  const [wallet, setWallet] = useState<WalletData>({
    address: '',
    balance: '0',
    isLoading: false
  });

  const [isCreating, setIsCreating] = useState(false);

  const createWallet = async () => {
    setIsCreating(true);
    try {
      const response = await fetch('/api/wallet/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          label: 'GigChain Wallet',
          chain: 'ethereum'
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.result) {
        setWallet(prev => ({
          ...prev,
          address: data.result.walletAddress
        }));

        // Fetch balance after creating wallet
        await fetchBalance(data.result.walletAddress);
      } else {
        console.error('Failed to create wallet:', data.error);
      }
    } catch (error) {
      console.error('Error creating wallet:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const fetchBalance = async (address: string) => {
    setWallet(prev => ({ ...prev, isLoading: true }));
    try {
      const response = await fetch(`/api/wallet/balance?address=${address}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setWallet(prev => ({
          ...prev,
          balance: data.balance,
          isLoading: false
        }));
      } else {
        console.error('Failed to fetch balance:', data.error);
        setWallet(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
      setWallet(prev => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-white mb-6">Wallet Information</h2>

      {!wallet.address ? (
        <div className="text-center">
          <p className="text-gray-400 mb-4">No wallet created yet</p>
          <button 
            onClick={createWallet}
            disabled={isCreating}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            {isCreating ? 'Creating...' : 'Create Wallet'}
          </button>
        </div>
      ) : (
        <div>
          <div className="space-y-4 mb-6">
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-gray-400 text-sm mb-1">Wallet Address</div>
              <div className="text-white font-mono text-sm break-all">{wallet.address}</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-gray-400 text-sm mb-1">USDC Balance</div>
              <div className="text-white text-xl font-semibold">
                {wallet.isLoading ? 'Loading...' : `${wallet.balance} USDC`}
              </div>
            </div>
          </div>

          <button 
            onClick={() => fetchBalance(wallet.address)}
            disabled={wallet.isLoading}
            className="w-full bg-gray-700 hover:bg-gray-600 disabled:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            {wallet.isLoading ? 'Refreshing...' : 'Refresh Balance'}
          </button>
        </div>
      )}
    </div>
  );
}