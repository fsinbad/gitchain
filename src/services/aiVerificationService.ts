
import { AIVerificationRequest } from '../types/gigchain';

export class AIVerificationService {
  private static readonly OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
  private static readonly VISION_MODEL = 'gpt-4-vision-preview';

  static async verifyImageTask(request: AIVerificationRequest): Promise<{
    score: number;
    confidence: number;
    details: string;
    approved: boolean;
  }> {
    try {
      const prompt = this.generateVerificationPrompt(request);
      
      const response = await fetch(this.OPENAI_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.VISION_MODEL,
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: prompt
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: request.proofUrl
                  }
                }
              ]
            }
          ],
          max_tokens: 500,
          temperature: 0.1
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;
      
      return this.parseAIResponse(aiResponse);
    } catch (error) {
      console.error('AI verification error:', error);
      return {
        score: 0,
        confidence: 0,
        details: 'AI verification failed',
        approved: false
      };
    }
  }

  static async verifyVideoTask(request: AIVerificationRequest): Promise<{
    score: number;
    confidence: number;
    details: string;
    approved: boolean;
  }> {
    // For video, we could extract frames and analyze them
    // For now, return a placeholder implementation
    return {
      score: 85,
      confidence: 80,
      details: 'Video verification not fully implemented yet',
      approved: true
    };
  }

  private static generateVerificationPrompt(request: AIVerificationRequest): string {
    const basePrompt = `
You are an AI task verification system. Analyze the provided image/video proof for the following task:

Task Category: ${request.taskCategory}
Verification Criteria: ${request.verificationCriteria.join(', ')}

Please evaluate the submission and respond in this exact JSON format:
{
  "score": [0-100],
  "confidence": [0-100],
  "details": "[explanation of your assessment]",
  "approved": [true/false]
}

Scoring Guidelines:
- 90-100: Perfect completion, exceeds requirements
- 80-89: Good completion, meets all requirements
- 70-79: Acceptable completion, minor issues
- 60-69: Borderline completion, some requirements not met
- Below 60: Incomplete or incorrect

Focus on:
1. Task completion accuracy
2. Quality of work shown
3. Adherence to requirements
4. Professional presentation
`;

    // Add category-specific prompts
    switch (request.taskCategory) {
      case 'data-entry':
        return basePrompt + `
Specific criteria for data entry:
- Text should be clearly visible and legible
- Data appears to be accurately transcribed
- Format follows specified guidelines
- No obvious errors or omissions
`;

      case 'content-moderation':
        return basePrompt + `
Specific criteria for content moderation:
- Content has been properly reviewed
- Appropriate flags or categories applied
- Decision rationale is clear
- Follows platform guidelines
`;

      case 'image-labeling':
        return basePrompt + `
Specific criteria for image labeling:
- Labels are accurate and descriptive
- All required objects/features identified
- Consistent labeling format
- No mislabeled elements
`;

      default:
        return basePrompt;
    }
  }

  private static parseAIResponse(response: string): {
    score: number;
    confidence: number;
    details: string;
    approved: boolean;
  } {
    try {
      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      return {
        score: Math.max(0, Math.min(100, parsed.score || 0)),
        confidence: Math.max(0, Math.min(100, parsed.confidence || 0)),
        details: parsed.details || 'No details provided',
        approved: parsed.approved === true && parsed.score >= 70
      };
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      return {
        score: 0,
        confidence: 0,
        details: 'Failed to parse AI verification response',
        approved: false
      };
    }
  }
}
