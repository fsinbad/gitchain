
import { useState, useEffect } from 'react';

interface StoredWallet {
  address: string;
  chain: string;
  label: string;
  createdAt: string;
}

interface WalletInfoProps {
  currentWallet?: string;
}

export default function WalletInfo({ currentWallet }: WalletInfoProps) {
  const [wallets, setWallets] = useState<StoredWallet[]>([]);
  const [showWallets, setShowWallets] = useState(false);

  useEffect(() => {
    loadWallets();
  }, [currentWallet]);

  const loadWallets = () => {
    if (typeof window !== 'undefined') {
      try {
        const stored = JSON.parse(localStorage.getItem('gigchain_wallets') || '[]');
        setWallets(stored);
      } catch {
        setWallets([]);
      }
    }
  };

  const clearWallets = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('gigchain_wallets');
      setWallets([]);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 mt-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">Local Wallets</h3>
        <div className="space-x-2">
          <button
            onClick={() => setShowWallets(!showWallets)}
            className="text-blue-400 hover:text-blue-300"
          >
            {showWallets ? 'Hide' : 'Show'} ({wallets.length})
          </button>
          {wallets.length > 0 && (
            <button
              onClick={clearWallets}
              className="text-red-400 hover:text-red-300 text-sm"
            >
              Clear All
            </button>
          )}
        </div>
      </div>
      
      {showWallets && (
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {wallets.length === 0 ? (
            <p className="text-gray-500 text-sm">No wallets created yet</p>
          ) : (
            wallets.map((wallet, index) => (
              <div
                key={index}
                className={`p-2 rounded border ${
                  wallet.address === currentWallet
                    ? 'border-blue-500 bg-blue-900/20'
                    : 'border-gray-600 bg-gray-700'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">{wallet.label}</p>
                    <p className="text-xs text-gray-400">
                      {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                    </p>
                    <p className="text-xs text-gray-500">{wallet.chain}</p>
                  </div>
                  {wallet.address === currentWallet && (
                    <span className="text-xs bg-blue-600 px-2 py-1 rounded">
                      Current
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
      
      <div className="mt-2 p-2 bg-yellow-900/20 border border-yellow-600 rounded text-xs">
        <p className="text-yellow-400">
          ⚠️ Demo Mode: Wallets are stored locally and private keys are visible. 
          Not for production use.
        </p>
      </div>
    </div>
  );
}
