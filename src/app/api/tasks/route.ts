
import { NextResponse } from 'next/server';

// Mock data for demo - replace with database queries
const mockTasks = [
  {
    id: 'task_1',
    title: 'Moderate 100 User Comments',
    description: 'Review user comments for inappropriate content, spam, or violations of community guidelines.',
    category: 'content-moderation',
    reward: '25000000', // $25 USDC (6 decimals)
    chain: 'base-sepolia',
    estimatedTimeMinutes: 60,
    requirements: ['Experience with content moderation', 'Understanding of community guidelines'],
    createdBy: '0x1234567890123456789012345678901234567890',
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    status: 'open',
    maxWorkers: 1,
    currentWorkers: 0,
    verificationMethod: 'ai-image',
    proofRequired: true
  },
  {
    id: 'task_2',
    title: 'Label 500 Product Images',
    description: 'Add accurate labels and tags to product images for e-commerce catalog.',
    category: 'image-labeling',
    reward: '15000000', // $15 USDC
    chain: 'ethereum-sepolia',
    estimatedTimeMinutes: 45,
    requirements: ['Attention to detail', 'Basic product knowledge'],
    createdBy: '0x2345678901234567890123456789012345678901',
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    status: 'open',
    maxWorkers: 3,
    currentWorkers: 1,
    verificationMethod: 'ai-image',
    proofRequired: true
  },
  {
    id: 'task_3',
    title: 'Data Entry: Customer Survey Results',
    description: 'Enter customer survey responses into structured database format.',
    category: 'data-entry',
    reward: '10000000', // $10 USDC
    chain: 'avalanche-fuji',
    estimatedTimeMinutes: 30,
    requirements: ['Fast typing speed', 'Accuracy in data entry'],
    createdBy: '0x3456789012345678901234567890123456789012',
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    status: 'open',
    maxWorkers: 2,
    currentWorkers: 0,
    verificationMethod: 'ai-image',
    proofRequired: true
  }
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const chain = searchParams.get('chain');
    const status = searchParams.get('status');
    
    let filteredTasks = mockTasks;
    
    if (category) {
      filteredTasks = filteredTasks.filter(task => task.category === category);
    }
    
    if (chain) {
      filteredTasks = filteredTasks.filter(task => task.chain === chain);
    }
    
    if (status) {
      filteredTasks = filteredTasks.filter(task => task.status === status);
    }
    
    return NextResponse.json(filteredTasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}
