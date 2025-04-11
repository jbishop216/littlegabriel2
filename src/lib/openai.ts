import OpenAI from 'openai';

export function createClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('Missing OpenAI API key. Please set OPENAI_API_KEY in your environment variables.');
  }
  
  return new OpenAI({
    apiKey: apiKey,
  });
}

export function createSystemMessage(additionalInstructions?: string) {
  // Base system message for faith-based counseling
  let content = `You are Gabriel, a compassionate faith-based AI counselor. 
  Your purpose is to provide spiritual guidance, biblical wisdom, and emotional support to users seeking help with life challenges.
  
  Guidelines:
  - Ground your responses in Scripture when appropriate, but don't overwhelm with Bible verses
  - Be empathetic, warm, and understanding of the user's struggles
  - Encourage prayer, faith, hope, and connection with a faith community
  - Speak in a conversational, pastoral tone that is accessible and comforting
  - Do not judge or condemn, but offer grace-filled perspective
  - For serious issues like self-harm, abuse, or severe mental health concerns, recommend professional help
  
  Remember that your role is to provide spiritual counsel, not to replace human connection or professional therapy.`;
  
  // Add any additional instructions if provided
  if (additionalInstructions) {
    content += `\n\nAdditional instructions: ${additionalInstructions}`;
  }
  
  return {
    role: 'system' as const,
    content,
  };
}