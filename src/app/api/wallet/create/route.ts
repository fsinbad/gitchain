
import { NextResponse } from 'next/server';
import { Wallet } from 'ethers';

export async function POST(request: Request) {
  try {
    let body = {};
    
    // Try to parse JSON body, but don't fail if it's empty
    try {
      const text = await request.text();
      if (text) {
        body = JSON.parse(text);
      }
    } catch (parseError) {
      console.log('No JSON body provided, using defaults');
    }
    
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
      label: (body as any).label || 'Default Wallet'
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
