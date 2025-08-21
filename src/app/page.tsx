'use client';

import { useState, useEffect } from 'react';
import WalletInfo from './components/WalletInfo';

interface Task {
  id: string;
  title: string;
  status: string;
  reward: number;
  date: string;
}

interface UserStats {
  tasksCompleted: number;
  completionRate: number;
  averageRating: number;
  totalEarnings: number;
  availableBalance: number;
  earningsOverTime: number;
  lastMonthChange: string;
}

export default function Dashboard() {
  const [userStats, setUserStats] = useState<UserStats>({
    tasksCompleted: 120,
    completionRate: 98,
    averageRating: 4.8,
    totalEarnings: 1500,
    availableBalance: 300,
    earningsOverTime: 1500,
    lastMonthChange: '+35%'
  });

  const [recentTasks, setRecentTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Write a blog post about AI',
      status: 'Completed',
      reward: 50,
      date: '2024-09-18'
    },
    {
      id: '2',
      title: 'Translate document to Spanish',
      status: 'Completed',
      reward: 100,
      date: '2024-09-16'
    },
    {
      id: '3',
      title: 'Design a logo for a startup',
      status: 'Completed',
      reward: 200,
      date: '2024-09-15'
    },
    {
      id: '4',
      title: 'Create social media content',
      status: 'Completed',
      reward: 75,
      date: '2024-09-14'
    },
    {
      id: '5',
      title: 'Edit a video tutorial',
      status: 'Completed',
      reward: 150,
      date: '2024-09-10'
    }
  ]);

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Profile Section */}
        <div className="flex items-center mb-8">
          <div className="w-20 h-20 bg-gray-600 rounded-full mr-6 flex items-center justify-center">
            <span className="text-2xl text-white font-semibold">OB</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Olivia Bennett</h1>
            <p className="text-gray-400">@olivia_bennett</p>
            <p className="text-gray-500 text-sm">Joined 7 • 2023</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="text-4xl font-bold text-white">{userStats.tasksCompleted}</div>
            <div className="text-gray-400 text-sm">Tasks Completed</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="text-4xl font-bold text-white">{userStats.completionRate}%</div>
            <div className="text-gray-400 text-sm">Completion Rate</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="text-4xl font-bold text-white">{userStats.averageRating}</div>
            <div className="text-gray-400 text-sm">Average Rating</div>
          </div>
        </div>

        {/* Earnings Overview */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-6">Earnings Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-gray-400 text-sm mb-1">Total Earnings</div>
              <div className="text-2xl font-bold text-white">${userStats.totalEarnings}</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-gray-400 text-sm mb-1">Available Balance</div>
              <div className="text-2xl font-bold text-white">${userStats.availableBalance}</div>
            </div>
          </div>

          <div className="bg-gray-700 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <div className="text-gray-400 text-sm">Earnings Over Time</div>
              <div className="text-green-400 text-sm">{userStats.lastMonthChange}</div>
            </div>
            <div className="text-2xl font-bold text-white mb-4">${userStats.earningsOverTime}</div>
            <div className="text-gray-500 text-sm">Last 6 Months</div>

            {/* Simple chart placeholder */}
            <div className="mt-4 h-32 bg-gray-600 rounded-lg flex items-end justify-between p-4">
              <div className="w-8 bg-blue-500 rounded-t" style={{height: '40%'}}></div>
              <div className="w-8 bg-blue-500 rounded-t" style={{height: '60%'}}></div>
              <div className="w-8 bg-blue-500 rounded-t" style={{height: '30%'}}></div>
              <div className="w-8 bg-blue-500 rounded-t" style={{height: '80%'}}></div>
              <div className="w-8 bg-blue-500 rounded-t" style={{height: '90%'}}></div>
              <div className="w-8 bg-blue-500 rounded-t" style={{height: '70%'}}></div>
            </div>
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors">
            Withdraw Earnings
          </button>
        </div>

        {/* Task History */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-6">Task History</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left text-gray-400 text-sm font-medium py-3">Task</th>
                  <th className="text-left text-gray-400 text-sm font-medium py-3">Status</th>
                  <th className="text-left text-gray-400 text-sm font-medium py-3">Reward</th>
                  <th className="text-left text-gray-400 text-sm font-medium py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentTasks.map((task) => (
                  <tr key={task.id} className="border-b border-gray-700">
                    <td className="py-4 text-white">{task.title}</td>
                    <td className="py-4">
                      <span className="bg-green-900 text-green-300 px-2 py-1 rounded-full text-xs">
                        {task.status}
                      </span>
                    </td>
                    <td className="py-4 text-white">${task.reward}</td>
                    <td className="py-4 text-gray-400">{task.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Wallet Info */}
        <WalletInfo />
      </div>
    </div>
  );
}