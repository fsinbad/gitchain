
'use client';

import { useState } from 'react';
import { TaskService } from '../../services/taskService';
import { Task, TaskAssignment } from '../../types/gigchain';

interface TaskSubmissionProps {
  task: Task;
  assignment: TaskAssignment;
  onSubmitted: () => void;
}

export default function TaskSubmission({ task, assignment, onSubmitted }: TaskSubmissionProps) {
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofText, setProofText] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProofFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!proofFile && !proofText) {
      alert('Please provide proof of completion');
      return;
    }

    setIsSubmitting(true);
    try {
      const submission = {
        taskId: task.id,
        assignmentId: assignment.id,
        proofData: {
          type: proofFile ? 'image' : 'text',
          content: proofFile || proofText,
          metadata: {
            fileName: proofFile?.name,
            fileSize: proofFile?.size
          }
        },
        notes
      };

      await TaskService.submitTask(submission);
      onSubmitted();
      alert('Task submitted successfully! AI verification is in progress.');
    } catch (error) {
      console.error('Failed to submit task:', error);
      alert('Failed to submit task');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Submit Task: {task.title}</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Proof of Completion
            {task.verificationMethod === 'ai-image' && (
              <span className="text-blue-400 ml-2">(Image will be verified by AI)</span>
            )}
          </label>
          
          {task.proofRequired && task.verificationMethod === 'ai-image' ? (
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
            />
          ) : (
            <textarea
              value={proofText}
              onChange={(e) => setProofText(e.target.value)}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded h-24"
              placeholder="Describe your completed work or provide links to deliverables"
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Additional Notes (Optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded h-20"
            placeholder="Any additional information about your submission"
          />
        </div>

        <div className="bg-gray-700 p-4 rounded">
          <h4 className="font-medium mb-2">Verification Process:</h4>
          <ul className="text-sm text-gray-400 space-y-1">
            <li>1. Your submission will be verified by AI</li>
            <li>2. If approved, payment will be processed automatically</li>
            <li>3. You'll receive USDC directly to your wallet</li>
            <li>4. No gas fees - completely gasless experience!</li>
          </ul>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting || (!proofFile && !proofText)}
          className="w-full p-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Task for Verification'}
        </button>
      </div>
    </div>
  );
}
