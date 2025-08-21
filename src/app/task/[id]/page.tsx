
'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';

export default function TaskDetailsPage() {
  const params = useParams();
  const taskId = params.id;

  const [task] = useState({
    id: taskId,
    title: 'Transcribe audio to text',
    description: 'Transcribe the provided audio file into accurate and coherent text. Ensure proper grammar, punctuation, and spelling. The transcription should capture all spoken words and relevant non-verbal cues (e.g., laughter, pauses) in the audio. The final text should be formatted for readability and clarity.',
    category: 'Transcription',
    difficulty: 'Easy',
    estimatedTime: '30 minutes',
    reward: 5.00,
    completionRate: 25
  });

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-400 mb-8">
          <span>Explore</span>
          <span className="mx-2">/</span>
          <span>Task Details</span>
        </div>

        {/* Task Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">{task.title}</h1>
          <p className="text-gray-300 leading-relaxed">{task.description}</p>
        </div>

        {/* Task Details */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-6">Task Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between border-b border-gray-700 pb-3">
                <span className="text-gray-400">Task ID</span>
                <span className="text-white">#{task.id}</span>
              </div>
              <div className="flex justify-between border-b border-gray-700 pb-3">
                <span className="text-gray-400">Category</span>
                <span className="text-white">{task.category}</span>
              </div>
              <div className="flex justify-between border-b border-gray-700 pb-3">
                <span className="text-gray-400">Difficulty</span>
                <span className="text-white">{task.difficulty}</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between border-b border-gray-700 pb-3">
                <span className="text-gray-400">Estimated Time</span>
                <span className="text-white">{task.estimatedTime}</span>
              </div>
              <div className="flex justify-between border-b border-gray-700 pb-3">
                <span className="text-gray-400">Reward</span>
                <span className="text-green-400 font-semibold">${task.reward}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Submission Guidelines */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Submission Guidelines</h2>
          <div className="text-gray-300 space-y-2">
            <p><strong>1.</strong> Download the audio file provided. <strong>2.</strong> Transcribe the audio into a text document. <strong>3.</strong> Ensure the transcription is accurate, complete, and well-formatted. <strong>4.</strong> Upload the text document as your submission.</p>
          </div>
        </div>

        {/* Proof of Work Requirements */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Proof of Work Requirements</h2>
          <div className="text-gray-300 space-y-2">
            <p><strong>1.</strong> The transcribed text must match the audio content. <strong>2.</strong> The text should be free of grammatical errors and typos. <strong>3.</strong> The document should be in a standard text format (e.g., .txt, .docx).</p>
          </div>
        </div>

        {/* Progress */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white font-semibold">{task.completionRate}% completed</span>
            <span className="text-gray-400 text-sm">125/500 tasks completed</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="progress-bar h-2 rounded-full" 
              style={{width: `${task.completionRate}%`}}
            ></div>
          </div>
        </div>

        {/* Start Task Button */}
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors text-lg">
          Start Task
        </button>
      </div>
    </div>
  );
}
