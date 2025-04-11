import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const API_KEY = process.env.BIBLE_API_KEY;
const API_URL = 'https://api.scripture.api.bible/v1';

// Helper function to make authenticated API requests to the Bible API
async function makeApiRequest(endpoint: string) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'api-key': API_KEY || '',
      },
    });

    if (!response.ok) {
      throw new Error(`Bible API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error making Bible API request:', error);
    throw error;
  }
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const bibleId = searchParams.get('bibleId');
  const bookId = searchParams.get('bookId');
  const chapterId = searchParams.get('chapterId');
  const query = searchParams.get('query');

  try {
    let response;

    switch (action) {
      case 'getBibles':
        response = await makeApiRequest('/bibles');
        return NextResponse.json(response.data);

      case 'getBooks':
        if (!bibleId) {
          return NextResponse.json({ error: 'Bible ID is required' }, { status: 400 });
        }
        response = await makeApiRequest(`/bibles/${bibleId}/books`);
        return NextResponse.json(response.data);

      case 'getChapters':
        if (!bibleId || !bookId) {
          return NextResponse.json({ error: 'Bible ID and Book ID are required' }, { status: 400 });
        }
        response = await makeApiRequest(`/bibles/${bibleId}/books/${bookId}/chapters`);
        return NextResponse.json(response.data);

      case 'getChapterContent':
        if (!bibleId || !chapterId) {
          return NextResponse.json({ error: 'Bible ID and Chapter ID are required' }, { status: 400 });
        }
        response = await makeApiRequest(`/bibles/${bibleId}/chapters/${chapterId}?content-type=text&include-notes=false&include-titles=true&include-chapter-numbers=false&include-verse-numbers=true&include-verse-spans=false`);
        return NextResponse.json(response.data);

      case 'search':
        if (!bibleId || !query) {
          return NextResponse.json({ error: 'Bible ID and query are required for search' }, { status: 400 });
        }
        response = await makeApiRequest(`/bibles/${bibleId}/search?query=${encodeURIComponent(query)}&limit=25`);
        return NextResponse.json(response.data);

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error(`Bible API error (${action}):`, error);
    return NextResponse.json(
      { error: 'Failed to fetch Bible data. Please try again later.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { action, bibleId, bookId, chapterId, query } = body;

    let response;

    switch (action) {
      case 'getBibles':
        response = await makeApiRequest('/bibles');
        return NextResponse.json(response.data);

      case 'getBooks':
        if (!bibleId) {
          return NextResponse.json({ error: 'Bible ID is required' }, { status: 400 });
        }
        response = await makeApiRequest(`/bibles/${bibleId}/books`);
        return NextResponse.json(response.data);

      case 'getChapters':
        if (!bibleId || !bookId) {
          return NextResponse.json({ error: 'Bible ID and Book ID are required' }, { status: 400 });
        }
        response = await makeApiRequest(`/bibles/${bibleId}/books/${bookId}/chapters`);
        return NextResponse.json(response.data);

      case 'getChapterContent':
        if (!bibleId || !chapterId) {
          return NextResponse.json({ error: 'Bible ID and Chapter ID are required' }, { status: 400 });
        }
        response = await makeApiRequest(`/bibles/${bibleId}/chapters/${chapterId}?content-type=text&include-notes=false&include-titles=true&include-chapter-numbers=false&include-verse-numbers=true&include-verse-spans=false`);
        return NextResponse.json(response.data);

      case 'search':
        if (!bibleId || !query) {
          return NextResponse.json({ error: 'Bible ID and query are required for search' }, { status: 400 });
        }
        response = await makeApiRequest(`/bibles/${bibleId}/search?query=${encodeURIComponent(query)}&limit=25`);
        return NextResponse.json(response.data);

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Bible API post error:', error);
    return NextResponse.json(
      { error: 'Failed to process Bible data request. Please try again later.' },
      { status: 500 }
    );
  }
}