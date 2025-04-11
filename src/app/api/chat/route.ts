import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { createSystemMessage } from '@/lib/openai';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import OpenAI from 'openai';

// Define proper types for messages
type Role = 'user' | 'assistant' | 'system';
type Message = {
  role: Role;
  content: string;
};

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { messages } = await req.json();
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages are required' }, { status: 400 });
    }

    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured. Please contact the administrator.' }, 
        { status: 503 }
      );
    }

    const userId = session.user.id;
    const lastMessage = messages[messages.length - 1];

    // Create an OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Get the system message
    const systemMessage = createSystemMessage();
    
    // Format messages for OpenAI
    const formattedMessages: Message[] = [
      {
        role: 'system',
        content: systemMessage.content
      }
    ];

    // Add user and assistant messages
    for (const msg of messages) {
      if (msg.role === 'user') {
        formattedMessages.push({
          role: 'user',
          content: msg.content
        });
      } else if (msg.role === 'assistant') {
        formattedMessages.push({
          role: 'assistant',
          content: msg.content
        });
      }
    }

    // Create completion with streaming
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Using gpt-4o-mini as requested by the user for better efficiency
      stream: true,
      messages: formattedMessages,
      temperature: 0.8,
      max_tokens: 800,
    });

    // Save the user's message to the database
    try {
      await saveMessageToDb(userId, lastMessage.content, true);
    } catch (error) {
      console.error('Error saving user message:', error);
      // Continue even if saving fails
    }

    // Create a text stream response
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        let fullResponse = '';

        // Process each chunk from OpenAI
        for await (const chunk of response) {
          const content = chunk.choices[0]?.delta?.content || '';
          if (content) {
            controller.enqueue(encoder.encode(content));
            fullResponse += content;
          }
        }

        // Save the full AI response to the database
        try {
          await saveMessageToDb(userId, fullResponse, false);
        } catch (error) {
          console.error('Error saving AI response:', error);
        }

        controller.close();
      }
    });

    return new Response(stream);
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'An error occurred during the conversation' },
      { status: 500 }
    );
  }
}

async function saveMessageToDb(userId: string, content: string, isUserMessage: boolean) {
  try {
    // First check if the Message model/table exists
    const tableExists = await checkTableExists('Message');
    
    if (tableExists) {
      try {
        // Use the properly typed prisma client
        await prisma.$transaction(async (tx) => {
          // @ts-ignore - Access the model directly
          await tx.message.create({
            data: {
              content,
              userId,
              isUserMessage,
            },
          });
        });
      } catch (dbError) {
        console.error('Database error when saving message:', dbError);
      }
    }
  } catch (error) {
    console.error('Error saving message:', error);
    throw error;
  }
}

async function checkTableExists(tableName: string): Promise<boolean> {
  try {
    // For PostgreSQL
    await prisma.$queryRaw`SELECT 1 FROM information_schema.tables WHERE table_name=${tableName} AND table_schema='public'`;
    return true;
  } catch (error) {
    return false;
  }
}