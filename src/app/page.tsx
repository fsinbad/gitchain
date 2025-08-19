
'use client';

import { useState, useEffect } from 'react';
import { createWallet, getUSDCBalance } from '../services/cctpService';
import { TaskService } from '../services/taskService';
import { Task, TaskAssignment, WorkerProfile } from '../types/gigchain';
import { CCTP_CONFIG } from '../types/cctp';

export default function GigChainMarketplace() {
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [selectedChain, setSelectedChain] = useState<string>('base-sepolia');
  const [balance, setBalance] = useState<string>('0');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState<'browse' | 'create' | 'dashboard'>('browse');
  const [workerProfile, setWorkerProfile] = useState<WorkerProfile | null>(null);
  const [loading, setLoading] = useState(false);

  // Filter states
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [chainFilter, setChainFilter] = useState<string>('');

  // Create task form state
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    category: 'data-entry',
    reward: '',
    chain: selectedChain,
    estimatedTimeMinutes: 30,
    requirements: [''],
    maxWorkers: 1,
    expiresAt: '',
    verificationMethod: 'ai-image',
    proofRequired: true
  });

  useEffect(() => {
    loadTasks();
  }, [categoryFilter, chainFilter]);

  useEffect(() => {
    if (walletAddress) {
      loadBalance();
      loadWorkerProfile();
    }
  }, [walletAddress, selectedChain]);

  const loadTasks = async () => {
    try {
      const filters: any = {};
      if (categoryFilter) filters.category = categoryFilter;
      if (chainFilter) filters.chain = chainFilter;
      
      const fetchedTasks = await TaskService.getTasks(filters);
      setTasks(fetchedTasks);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    }
  };

  const loadBalance = async () => {
    if (!walletAddress) return;
    try {
      const balanceResponse = await getUSDCBalance(selectedChain, walletAddress);
      setBalance(balanceResponse.result.displayValue);
    } catch (error) {
      console.error('Failed to load balance:', error);
    }
  };

  const loadWorkerProfile = async () => {
    if (!walletAddress) return;
    try {
      const profile = await TaskService.getWorkerProfile(walletAddress);
      setWorkerProfile(profile);
    } catch (error) {
      console.error('Failed to load worker profile:', error);
      // Create default profile if doesn't exist
      setWorkerProfile({
        address: walletAddress,
        completedTasks: 0,
        totalEarnings: '0',
        averageRating: 0,
        skills: [],
        preferredChains: [selectedChain],
        isVerified: false,
        joinedAt: new Date(),
        lastActive: new Date()
      });
    }
  };

  const handleCreateWallet = async () => {
    setLoading(true);
    try {
      const wallet = await createWallet(selectedChain, 'GigChain Worker');
      setWalletAddress(wallet.result.walletAddress);
    } catch (error) {
      console.error('Failed to create wallet:', error);
      alert('Failed to create wallet');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async () => {
    if (!walletAddress) {
      alert('Please create a wallet first');
      return;
    }

    setLoading(true);
    try {
      const taskData = {
        ...newTask,
        createdBy: walletAddress,
        requirements: newTask.requirements.filter(req => req.trim() !== ''),
        expiresAt: new Date(newTask.expiresAt),
        reward: (parseFloat(newTask.reward) * 1000000).toString() // Convert to USDC decimals
      };

      await TaskService.createTask(taskData);
      
      // Reset form
      setNewTask({
        title: '',
        description: '',
        category: 'data-entry',
        reward: '',
        chain: selectedChain,
        estimatedTimeMinutes: 30,
        requirements: [''],
        maxWorkers: 1,
        expiresAt: '',
        verificationMethod: 'ai-image',
        proofRequired: true
      });
      
      setActiveTab('browse');
      await loadTasks();
    } catch (error) {
      console.error('Failed to create task:', error);
      alert('Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptTask = async (taskId: string) => {
    if (!walletAddress) {
      alert('Please create a wallet first');
      return;
    }

    setLoading(true);
    try {
      await TaskService.acceptTask(taskId, walletAddress);
      await loadTasks();
      alert('Task accepted! Check your dashboard for details.');
    } catch (error) {
      console.error('Failed to accept task:', error);
      alert('Failed to accept task');
    } finally {
      setLoading(false);
    }
  };

  const formatUSDC = (amount: string) => {
    return (parseInt(amount) / 1000000).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">🔗 GigChain</h1>
          <p className="text-gray-400">Decentralized Task Marketplace with Gasless USDC Payments</p>
        </div>

        {/* Wallet Section */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Wallet & Chain</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Select Chain</label>
              <select
                value={selectedChain}
                onChange={(e) => setSelectedChain(e.target.value)}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
              >
                {Object.keys(CCTP_CONFIG).map((chain) => (
                  <option key={chain} value={chain}>
                    {chain.charAt(0).toUpperCase() + chain.slice(1).replace('-', ' ')}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Wallet Address</label>
              {walletAddress ? (
                <p className="p-2 bg-gray-700 rounded text-sm">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </p>
              ) : (
                <button
                  onClick={handleCreateWallet}
                  disabled={loading}
                  className="w-full p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded"
                >
                  {loading ? 'Creating...' : 'Create Wallet'}
                </button>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">USDC Balance</label>
              <p className="p-2 bg-gray-700 rounded">${balance}</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-4 py-2 rounded ${
              activeTab === 'browse' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            Browse Tasks
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`px-4 py-2 rounded ${
              activeTab === 'create' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            Create Task
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded ${
              activeTab === 'dashboard' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            Dashboard
          </button>
        </div>

        {/* Browse Tasks Tab */}
        {activeTab === 'browse' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Filters</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
                  >
                    <option value="">All Categories</option>
                    <option value="data-entry">Data Entry</option>
                    <option value="content-moderation">Content Moderation</option>
                    <option value="survey">Survey</option>
                    <option value="image-labeling">Image Labeling</option>
                    <option value="verification">Verification</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Chain</label>
                  <select
                    value={chainFilter}
                    onChange={(e) => setChainFilter(e.target.value)}
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
                  >
                    <option value="">All Chains</option>
                    {Object.keys(CCTP_CONFIG).map((chain) => (
                      <option key={chain} value={chain}>
                        {chain.charAt(0).toUpperCase() + chain.slice(1).replace('-', ' ')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Task List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tasks.map((task) => (
                <div key={task.id} className="bg-gray-800 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold">{task.title}</h3>
                    <span className="text-green-400 font-bold">
                      ${formatUSDC(task.reward)}
                    </span>
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-3">{task.description}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Category:</span>
                      <span className="capitalize">{task.category.replace('-', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Chain:</span>
                      <span className="capitalize">{task.chain.replace('-', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Time:</span>
                      <span>{task.estimatedTimeMinutes} min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Workers:</span>
                      <span>{task.currentWorkers}/{task.maxWorkers}</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-xs text-gray-500 mb-3">
                      Requirements: {task.requirements.join(', ')}
                    </p>
                    
                    <button
                      onClick={() => handleAcceptTask(task.id)}
                      disabled={loading || task.currentWorkers >= task.maxWorkers}
                      className="w-full p-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded text-sm"
                    >
                      {task.currentWorkers >= task.maxWorkers ? 'Full' : 'Accept Task'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Create Task Tab */}
        {activeTab === 'create' && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Create New Task</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
                    placeholder="Enter task title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded h-24"
                    placeholder="Describe the task in detail"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    value={newTask.category}
                    onChange={(e) => setNewTask({...newTask, category: e.target.value})}
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
                  >
                    <option value="data-entry">Data Entry</option>
                    <option value="content-moderation">Content Moderation</option>
                    <option value="survey">Survey</option>
                    <option value="image-labeling">Image Labeling</option>
                    <option value="verification">Verification</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Reward (USDC)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newTask.reward}
                    onChange={(e) => setNewTask({...newTask, reward: e.target.value})}
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Payment Chain</label>
                  <select
                    value={newTask.chain}
                    onChange={(e) => setNewTask({...newTask, chain: e.target.value})}
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
                  >
                    {Object.keys(CCTP_CONFIG).map((chain) => (
                      <option key={chain} value={chain}>
                        {chain.charAt(0).toUpperCase() + chain.slice(1).replace('-', ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Estimated Time (minutes)</label>
                  <input
                    type="number"
                    value={newTask.estimatedTimeMinutes}
                    onChange={(e) => setNewTask({...newTask, estimatedTimeMinutes: parseInt(e.target.value)})}
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Max Workers</label>
                  <input
                    type="number"
                    min="1"
                    value={newTask.maxWorkers}
                    onChange={(e) => setNewTask({...newTask, maxWorkers: parseInt(e.target.value)})}
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Expires At</label>
                  <input
                    type="datetime-local"
                    value={newTask.expiresAt}
                    onChange={(e) => setNewTask({...newTask, expiresAt: e.target.value})}
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleCreateTask}
                disabled={loading || !newTask.title || !newTask.description || !newTask.reward}
                className="w-full p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded"
              >
                {loading ? 'Creating...' : 'Create Task'}
              </button>
            </div>
          </div>
        )}

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Worker Profile */}
            {workerProfile && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Worker Profile</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-400">{workerProfile.completedTasks}</p>
                    <p className="text-gray-400">Completed Tasks</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-400">${formatUSDC(workerProfile.totalEarnings)}</p>
                    <p className="text-gray-400">Total Earnings</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-400">{workerProfile.averageRating.toFixed(1)}</p>
                    <p className="text-gray-400">Average Rating</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-400">
                      {workerProfile.isVerified ? '✓' : '○'}
                    </p>
                    <p className="text-gray-400">Verified Worker</p>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-800 rounded-lg p-6 text-center">
                <h3 className="text-lg font-semibold mb-2">Active Tasks</h3>
                <p className="text-3xl font-bold text-blue-400">0</p>
                <p className="text-gray-400">Currently working on</p>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6 text-center">
                <h3 className="text-lg font-semibold mb-2">Pending Payments</h3>
                <p className="text-3xl font-bold text-yellow-400">$0.00</p>
                <p className="text-gray-400">Awaiting verification</p>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6 text-center">
                <h3 className="text-lg font-semibold mb-2">This Week</h3>
                <p className="text-3xl font-bold text-green-400">$0.00</p>
                <p className="text-gray-400">Earnings this week</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <div className="text-center text-gray-400 py-8">
                No recent activity. Start accepting tasks to see your progress here!
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
