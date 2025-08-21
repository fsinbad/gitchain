
'use client';

import { useState, useEffect } from 'react';

interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  reward: number;
  estimatedTime: string;
  image: string;
  completionRate?: string;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Data Entry Task',
      description: 'Enter data from images into a spreadsheet',
      category: 'Data Entry',
      difficulty: 'Easy',
      reward: 25,
      estimatedTime: '15 minutes',
      image: '🏠'
    },
    {
      id: '2',
      title: 'Content Moderation Task',
      description: 'Review user-generated content for policy violations',
      category: 'Content Moderation',
      difficulty: 'Medium',
      reward: 35,
      estimatedTime: '20 minutes',
      image: '📄'
    },
    {
      id: '3',
      title: 'Survey Task',
      description: 'Complete a survey about consumer preferences',
      category: 'Survey',
      difficulty: 'Easy',
      reward: 15,
      estimatedTime: '10 minutes',
      image: '📊'
    },
    {
      id: '4',
      title: 'Image Tagging Task',
      description: 'Tag objects in images for AI training',
      category: 'Image Processing',
      difficulty: 'Easy',
      reward: 20,
      estimatedTime: '12 minutes',
      image: '🏷️'
    },
    {
      id: '5',
      title: 'Video Review Task',
      description: 'Review video clips for inappropriate content',
      category: 'Content Review',
      difficulty: 'Medium',
      reward: 40,
      estimatedTime: '25 minutes',
      image: '▶️'
    },
    {
      id: '6',
      title: 'Transcription Task',
      description: 'Transcribe audio recordings into text',
      category: 'Transcription',
      difficulty: 'Medium',
      reward: 30,
      estimatedTime: '20 minutes',
      image: '🎧'
    }
  ]);

  const [filters, setFilters] = useState({
    category: 'all',
    difficulty: 'all',
    verification: 'all',
    reward: 'all'
  });

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Available Tasks</h1>
          <p className="text-gray-400">Browse and select from a variety of micro-tasks. Complete tasks to earn gasless USDC with instant global payouts.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          <select 
            className="bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.category}
            onChange={(e) => setFilters({...filters, category: e.target.value})}
          >
            <option value="all">Category</option>
            <option value="data-entry">Data Entry</option>
            <option value="content-moderation">Content Moderation</option>
            <option value="survey">Survey</option>
            <option value="transcription">Transcription</option>
          </select>

          <select 
            className="bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.difficulty}
            onChange={(e) => setFilters({...filters, difficulty: e.target.value})}
          >
            <option value="all">Difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <select 
            className="bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.verification}
            onChange={(e) => setFilters({...filters, verification: e.target.value})}
          >
            <option value="all">Verification Method</option>
            <option value="ai">AI Verification</option>
            <option value="manual">Manual Review</option>
          </select>

          <select 
            className="bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.reward}
            onChange={(e) => setFilters({...filters, reward: e.target.value})}
          >
            <option value="all">Reward Range</option>
            <option value="0-25">$0-25</option>
            <option value="25-50">$25-50</option>
            <option value="50+">$50+</option>
          </select>
        </div>

        {/* Task Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <div key={task.id} className="bg-gray-800 rounded-lg overflow-hidden task-card hover:bg-gray-750 transition-all">
              <div className="h-48 bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center">
                <div className="text-6xl">{task.image}</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2">{task.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{task.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Category:</span>
                    <span className="text-gray-300">{task.category}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Difficulty:</span>
                    <span className="text-gray-300">{task.difficulty}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Estimated Time:</span>
                    <span className="text-gray-300">{task.estimatedTime}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Reward:</span>
                    <span className="text-green-400 font-semibold">${task.reward}</span>
                  </div>
                </div>

                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors">
                  Start Task
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-12">
          <div className="flex space-x-2">
            <button className="w-8 h-8 bg-gray-700 hover:bg-gray-600 text-white rounded flex items-center justify-center">
              ‹
            </button>
            <button className="w-8 h-8 bg-blue-600 text-white rounded flex items-center justify-center">1</button>
            <button className="w-8 h-8 bg-gray-700 hover:bg-gray-600 text-white rounded flex items-center justify-center">2</button>
            <button className="w-8 h-8 bg-gray-700 hover:bg-gray-600 text-white rounded flex items-center justify-center">3</button>
            <button className="w-8 h-8 bg-gray-700 hover:bg-gray-600 text-white rounded flex items-center justify-center">4</button>
            <button className="w-8 h-8 bg-gray-700 hover:bg-gray-600 text-white rounded flex items-center justify-center">5</button>
            <button className="w-8 h-8 bg-gray-700 hover:bg-gray-600 text-white rounded flex items-center justify-center">
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
