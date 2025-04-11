import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import OpenAI from 'openai';
import { authOptions } from '@/lib/auth';

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const {
      title,
      biblePassage,
      theme,
      audienceType,
      lengthMinutes,
      additionalNotes,
    } = await req.json();

    // Validate required fields
    if (!biblePassage || !theme) {
      return NextResponse.json(
        { error: 'Bible passage and theme are required' },
        { status: 400 }
      );
    }

    // Create system message
    const systemMessage = `
      You are an expert sermon writer with deep knowledge of Biblical teachings. Create a well-structured, inspiring sermon based on the provided details.
      Respond with a JSON object structured as follows:
      {
        "title": "Sermon title",
        "introduction": "Opening paragraph introducing the topic",
        "mainPoints": [
          {
            "title": "Point 1 Title",
            "content": "Detailed explanation of point 1"
          }
        ],
        "conclusion": "Concluding thoughts",
        "scriptureReferences": ["Scripture references used"],
        "illustrations": ["Optional illustrative stories or examples"]
      }
      The sermon should be biblically sound, theologically accurate, and spiritually uplifting.
    `;

    // Create user prompt
    const userPrompt = `
      Please create a sermon with the following specifications:
      ${title ? `Title: ${title} (or suggest a better one if appropriate)` : 'Please suggest an appropriate title.'}
      Bible Passage: ${biblePassage}
      Theme: ${theme}
      Target Audience: ${audienceType}
      Approximate Length: ${lengthMinutes} minutes
      ${additionalNotes ? `Additional Notes: ${additionalNotes}` : ''}

      The sermon should include:
      1. A compelling introduction that explains the context of the scripture
      2. 3-4 main points with Biblical support and explanation
      3. Practical applications for daily life
      4. A powerful conclusion with a call to action
      5. Additional scripture references that support the message
      
      Make the sermon relatable, inspirational, and grounded in Biblical truth.
    `;

    // Generate sermon using OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: userPrompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 3000,
    });

    // Get the content from the response
    const content = response.choices[0].message.content || '';
    
    // Check if content is empty
    if (!content) {
      return NextResponse.json(
        { error: 'No content returned from OpenAI' },
        { status: 500 }
      );
    }
    
    try {
      // Try to parse the JSON response
      const sermon = JSON.parse(content);
      
      // Validate the sermon data structure
      if (!sermon.title || !sermon.introduction || !Array.isArray(sermon.mainPoints) || !sermon.conclusion || !Array.isArray(sermon.scriptureReferences)) {
        return NextResponse.json(
          { error: 'Invalid sermon structure returned from API' },
          { status: 500 }
        );
      }
      
      // Add empty array for illustrations if not present
      if (!sermon.illustrations) {
        sermon.illustrations = [];
      }
      
      return NextResponse.json(sermon);
    } catch (parseError: any) {
      console.error('JSON parsing error:', parseError);
      return NextResponse.json(
        { error: 'Could not parse the sermon data: ' + (parseError.message || 'Unknown error') },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Error generating sermon:', error);
    return NextResponse.json(
      { error: 'Failed to generate sermon: ' + (error.message || 'Unknown error') },
      { status: 500 }
    );
  }
}