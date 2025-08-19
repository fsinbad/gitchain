
import { NextResponse } from 'next/server';
import { Task } from '../../../../types/gigchain';

// In-memory storage for demo - replace with database
const tasks: Task[] = [];
let taskCounter = 1;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.description || !body.reward || !body.chain) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description, reward, chain' },
        { status: 400 }
      );
    }

    const newTask: Task = {
      ...body,
      id: `task_${taskCounter++}`,
      createdAt: new Date(),
      status: 'open',
      currentWorkers: 0
    };

    tasks.push(newTask);
    
    console.log('Created new task:', {
      id: newTask.id,
      title: newTask.title,
      reward: newTask.reward,
      chain: newTask.chain
    });

    return NextResponse.json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}
