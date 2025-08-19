
import { NextResponse } from 'next/server';
import { Wallet } from 'ethers';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Creating local wallet with params:', body);
    
    // Generate a new wallet locally using ethers
    const wallet = Wallet.createRandom();
    
    // Return the same format as Thirdweb Engine would
    const response = {
      result: {
        walletAddress: wallet.address,
        privateKey: wallet.privateKey, // In production, encrypt this
        status: 'success'
      }
    };

    console.log('Local wallet created:', {
      address: wallet.address,
      label: body.label
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error creating local wallet:', error);
    return NextResponse.json(
      { error: 'Failed to create wallet' },
      { status: 500 }
    );
  }
}
