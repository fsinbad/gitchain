
import { NextResponse } from 'next/server';
import { CCTP_CONFIG } from '@/types/cctp';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const chainId = searchParams.get('chain');
    const wallet_address = searchParams.get('wallet_address');

    if (!chainId || !wallet_address) {
      return NextResponse.json(
        { error: 'Chain ID and wallet address are required' },
        { status: 400 }
      );
    }

    // Find chain config by chain ID
    const chainConfig = Object.values(CCTP_CONFIG).find(
      config => config.chainId.toString() === chainId
    );

    if (!chainConfig) {
      console.error('Invalid chain ID:', chainId);
      return NextResponse.json(
        { error: 'Invalid chain ID' },
        { status: 400 }
      );
    }

    // For demo purposes, return a mock balance
    // In production, you'd query the actual blockchain
    const mockBalance = {
      result: {
        displayValue: "1.0",
        symbol: "USDC",
        name: "USD Coin",
        decimals: 6,
        value: "1000000" // 1 USDC in wei (6 decimals)
      }
    };

    console.log('Returning mock balance for:', {
      chainId,
      wallet_address,
      balance: mockBalance.result.displayValue
    });

    return NextResponse.json(mockBalance);
  } catch (error) {
    console.error('Error getting balance:', error);
    return NextResponse.json(
      { error: 'Failed to get balance' },
      { status: 500 }
    );
  }
}
