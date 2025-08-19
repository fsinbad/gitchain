
import axios from 'axios';
import { Task, TaskAssignment, WorkerProfile, TaskSubmission, AIVerificationRequest, PayoutBatch } from '../types/gigchain';
import { sendPayrollBatchTransaction, pollTransactionStatus } from './cctpService';

const API_BASE_URL = '/api';

export class TaskService {
  // Task Management
  static async createTask(task: Omit<Task, 'id' | 'createdAt' | 'status' | 'currentWorkers'>): Promise<Task> {
    const response = await axios.post(`${API_BASE_URL}/tasks/create`, task);
    return response.data;
  }

  static async getTasks(filters?: {
    category?: string;
    chain?: string;
    status?: string;
    minReward?: string;
    maxReward?: string;
  }): Promise<Task[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    
    const response = await axios.get(`${API_BASE_URL}/tasks?${params.toString()}`);
    return response.data;
  }

  static async getTask(taskId: string): Promise<Task> {
    const response = await axios.get(`${API_BASE_URL}/tasks/${taskId}`);
    return response.data;
  }

  // Worker Management
  static async acceptTask(taskId: string, workerAddress: string): Promise<TaskAssignment> {
    const response = await axios.post(`${API_BASE_URL}/tasks/${taskId}/accept`, {
      workerAddress
    });
    return response.data;
  }

  static async submitTask(submission: TaskSubmission): Promise<TaskAssignment> {
    const formData = new FormData();
    formData.append('taskId', submission.taskId);
    formData.append('assignmentId', submission.assignmentId);
    formData.append('proofType', submission.proofData.type);
    
    if (submission.proofData.content instanceof File) {
      formData.append('proofFile', submission.proofData.content);
    } else {
      formData.append('proofContent', submission.proofData.content);
    }
    
    if (submission.notes) {
      formData.append('notes', submission.notes);
    }

    const response = await axios.post(`${API_BASE_URL}/tasks/submit`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // AI Verification
  static async verifyTaskSubmission(request: AIVerificationRequest): Promise<{
    score: number;
    confidence: number;
    details: string;
    approved: boolean;
  }> {
    const response = await axios.post(`${API_BASE_URL}/ai/verify`, request);
    return response.data;
  }

  // Worker Profile
  static async getWorkerProfile(address: string): Promise<WorkerProfile> {
    const response = await axios.get(`${API_BASE_URL}/workers/${address}`);
    return response.data;
  }

  static async updateWorkerProfile(address: string, updates: Partial<WorkerProfile>): Promise<WorkerProfile> {
    const response = await axios.put(`${API_BASE_URL}/workers/${address}`, updates);
    return response.data;
  }

  // Batch Payments
  static async createPayoutBatch(
    creatorAddress: string,
    assignments: TaskAssignment[],
    sourceChain: string
  ): Promise<PayoutBatch> {
    // Convert assignments to payment recipients
    const recipients = assignments.map(assignment => ({
      address: assignment.workerAddress,
      amount: assignment.taskId, // We'll need to fetch task reward
      chain: sourceChain // For now, same chain - can be enhanced for cross-chain
    }));

    // Use existing CCTP service for atomic batch payment
    const payrollResponse = await sendPayrollBatchTransaction(
      sourceChain,
      creatorAddress,
      recipients
    );

    const payoutBatch: PayoutBatch = {
      id: payrollResponse.result.queueId,
      createdBy: creatorAddress,
      totalAmount: payrollResponse.result.totalAmount,
      chain: sourceChain,
      assignments,
      status: 'processing',
      createdAt: new Date()
    };

    // Store batch in database
    const response = await axios.post(`${API_BASE_URL}/payouts/create`, payoutBatch);
    return response.data;
  }

  static async getPayoutStatus(batchId: string): Promise<PayoutBatch> {
    const response = await axios.get(`${API_BASE_URL}/payouts/${batchId}`);
    return response.data;
  }

  // Worker Dashboard
  static async getWorkerTasks(workerAddress: string): Promise<{
    assigned: TaskAssignment[];
    completed: TaskAssignment[];
    earnings: { [chain: string]: string };
  }> {
    const response = await axios.get(`${API_BASE_URL}/workers/${workerAddress}/tasks`);
    return response.data;
  }

  // Task Creator Dashboard
  static async getCreatorTasks(creatorAddress: string): Promise<{
    active: Task[];
    completed: Task[];
    totalSpent: { [chain: string]: string };
  }> {
    const response = await axios.get(`${API_BASE_URL}/creators/${creatorAddress}/tasks`);
    return response.data;
  }
}
