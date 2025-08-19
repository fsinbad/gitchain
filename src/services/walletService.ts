
import { Wallet, JsonRpcProvider } from 'ethers';
import { CCTP_CONFIG } from '../types/cctp';

export interface LocalWallet {
  address: string;
  privateKey: string;
  mnemonic?: string;
}

export interface WalletCreateResponse {
  result: {
    walletAddress: string;
    privateKey: string;
  };
}

// Generate a new wallet locally
export const generateWallet = (): LocalWallet => {
  const wallet = Wallet.createRandom();
  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
    mnemonic: wallet.mnemonic?.phrase
  };
};

// Create wallet with chain-specific provider
export const createLocalWallet = async (chain: string, label: string): Promise<WalletCreateResponse> => {
  try {
    const config = CCTP_CONFIG[chain];
    if (!config) {
      throw new Error(`Invalid chain: ${chain}`);
    }

    const wallet = generateWallet();
    
    // Store wallet info in localStorage for this demo
    // In production, you'd want to use proper encrypted storage
    const walletData = {
      address: wallet.address,
      privateKey: wallet.privateKey,
      chain,
      label,
      createdAt: new Date().toISOString()
    };

    // Store in browser's localStorage
    if (typeof window !== 'undefined') {
      const existingWallets = JSON.parse(localStorage.getItem('gigchain_wallets') || '[]');
      existingWallets.push(walletData);
      localStorage.setItem('gigchain_wallets', JSON.stringify(existingWallets));
    }

    return {
      result: {
        walletAddress: wallet.address,
        privateKey: wallet.privateKey
      }
    };
  } catch (error) {
    console.error('Error creating local wallet:', error);
    throw error;
  }
};

// Get wallet balance using ethers
export const getWalletBalance = async (chain: string, walletAddress: string): Promise<string> => {
  try {
    const config = CCTP_CONFIG[chain];
    if (!config) {
      throw new Error(`Invalid chain: ${chain}`);
    }

    // For demo purposes, return a mock balance
    // In production, you'd connect to the actual RPC endpoint
    return '1000000'; // 1 USDC in 6 decimals
  } catch (error) {
    console.error('Error getting wallet balance:', error);
    throw error;
  }
};

// Get stored wallets from localStorage
export const getStoredWallets = (): any[] => {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem('gigchain_wallets') || '[]');
  } catch {
    return [];
  }
};
