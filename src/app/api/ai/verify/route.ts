
import { NextResponse } from 'next/server';
import { AIVerificationService } from '../../../services/aiVerificationService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.proofUrl || !body.taskCategory || !body.proofType) {
      return NextResponse.json(
        { error: 'Missing required fields: proofUrl, taskCategory, proofType' },
        { status: 400 }
      );
    }

    let verificationResult;
    
    if (body.proofType === 'image') {
      verificationResult = await AIVerificationService.verifyImageTask(body);
    } else if (body.proofType === 'video') {
      verificationResult = await AIVerificationService.verifyVideoTask(body);
    } else {
      return NextResponse.json(
        { error: 'Unsupported proof type. Use "image" or "video"' },
        { status: 400 }
      );
    }

    console.log('AI verification completed:', {
      taskId: body.taskId,
      score: verificationResult.score,
      approved: verificationResult.approved
    });

    return NextResponse.json(verificationResult);
  } catch (error) {
    console.error('Error in AI verification:', error);
    return NextResponse.json(
      { error: 'AI verification failed' },
      { status: 500 }
    );
  }
}
