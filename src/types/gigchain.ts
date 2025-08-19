
export interface Task {
  id: string;
  title: string;
  description: string;
  category: 'data-entry' | 'content-moderation' | 'survey' | 'image-labeling' | 'verification';
  reward: string; // USDC amount with decimals
  chain: string; // Payment chain
  estimatedTimeMinutes: number;
  requirements: string[];
  createdBy: string; // wallet address
  createdAt: Date;
  expiresAt: Date;
  status: 'open' | 'assigned' | 'submitted' | 'under-review' | 'completed' | 'rejected';
  maxWorkers: number;
  currentWorkers: number;
  verificationMethod: 'ai-image' | 'ai-video' | 'manual' | 'quiz';
  proofRequired: boolean;
}

export interface TaskAssignment {
  id: string;
  taskId: string;
  workerAddress: string;
  assignedAt: Date;
  submittedAt?: Date;
  completedAt?: Date;
  status: 'assigned' | 'submitted' | 'verified' | 'rejected' | 'paid';
  proofData?: {
    type: 'image' | 'video' | 'text';
    url: string;
    metadata?: any;
  };
  aiVerificationResult?: {
    score: number;
    confidence: number;
    details: string;
    timestamp: Date;
  };
  paymentTxHash?: string;
}

export interface WorkerProfile {
  address: string;
  completedTasks: number;
  totalEarnings: string;
  averageRating: number;
  skills: string[];
  preferredChains: string[];
  isVerified: boolean;
  joinedAt: Date;
  lastActive: Date;
}

export interface TaskSubmission {
  taskId: string;
  assignmentId: string;
  proofData: {
    type: 'image' | 'video' | 'text';
    content: string | File;
    metadata?: any;
  };
  notes?: string;
}

export interface AIVerificationRequest {
  taskId: string;
  assignmentId: string;
  proofType: 'image' | 'video';
  proofUrl: string;
  taskCategory: string;
  verificationCriteria: string[];
}

export interface PayoutBatch {
  id: string;
  createdBy: string;
  totalAmount: string;
  chain: string;
  assignments: TaskAssignment[];
  status: 'pending' | 'processing' | 'completed' | 'failed';
  transactionHash?: string;
  createdAt: Date;
}
