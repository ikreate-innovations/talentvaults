import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

// Track last revalidation for monitoring
let lastRevalidation = {
  timestamp: new Date().toISOString(),
  tag: '',
  success: true
};

// Helper function to determine which paths to revalidate
function determinePaths(record: any): string[] {
  const paths: string[] = [];
  const type = record?.type || record?.opportunity_type;

  if (!type) return paths;

  // Always revalidate homepage if it contains this type
  paths.push('/');

  if (type === 'job') {
    paths.push('/jobs');  // Jobs listing page
    if (record?.page_slug) {
      paths.push(`/jobs/${record.page_slug}`);  // Job detail page
    }
  } else if (type === 'survey') {
    paths.push('/research');  // Surveys listing page
    if (record?.page_slug) {
      paths.push(`/research/${record.page_slug}`);  // Survey detail page
    }
  } else if (type === 'tool') {
    paths.push('/tools');  // Tools listing page
    if (record?.page_slug) {
      paths.push(`/tools/${record.page_slug}`);  // Tool detail page
    }
  }

  return paths;
}

// Helper function to determine which tags to revalidate
function determineTags(table: string, record: any): string[] {
  const tags = ['opportunities'];
  const type = record?.type || record?.opportunity_type;

  if (table === 'opportunities' && type) {
    if (type === 'job') {
      tags.push('opportunities-jobs');
      tags.push('jobs-list');
    } else if (type === 'survey') {
      tags.push('opportunities-surveys');
      tags.push('surveys-list');
    } else if (type === 'tool') {
      tags.push('digital-tools');
      tags.push('tools-list');
    }

    // Add specific page slug for detail page cache
    if (record?.page_slug) {
      if (type === 'job') {
        tags.push(`job-${record.page_slug}`);
      } else if (type === 'survey') {
        tags.push(`survey-${record.page_slug}`);
      } else if (type === 'tool') {
        tags.push(`tool-${record.page_slug}`);
      }
    }
  }

  return tags;
}

export async function POST(request: NextRequest) {
  // 1. AUTHENTICATION
  const secret = request.headers.get('x-revalidate-secret');
  
  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    console.error('🚨 Unauthorized revalidation attempt:', {
      timestamp: new Date().toISOString(),
      ip: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown'
    });
    
    return NextResponse.json(
      { error: 'Unauthorized' }, 
      { status: 401 }
    );
  }

  try {
    // 2. Parse the incoming webhook payload
    const body = await request.json();
    const { table, event_type, record } = body;
    
    // Log for debugging
    console.log('📨 Webhook received:', {
      table,
      event_type,
      recordId: record?.id,
      recordType: record?.type || record?.opportunity_type,
      page_slug: record?.page_slug,
      timestamp: new Date().toISOString()
    });
    
    // 3. Determine which cache tags to revalidate
    const tagsToRevalidate = determineTags(table, record);
    
    // 4. Revalidate each tag in Next.js cache
    const tagResults = tagsToRevalidate.map(tag => {
      try {
        revalidateTag(tag);
        console.log(`✅ Revalidated tag: ${tag}`);
        return { tag, success: true };
      } catch (error) {
        console.error(`❌ Failed to revalidate tag ${tag}:`, error);
        return { tag, success: false, error: String(error) };
      }
    });
    
    // 5. Determine which paths to revalidate (CRITICAL FIX)
    const pathsToRevalidate = determinePaths(record);
    
    // 6. Revalidate each path (This clears the Full Route Cache)
    const pathResults = pathsToRevalidate.map(path => {
      try {
        revalidatePath(path);
        console.log(`✅ Revalidated path: ${path}`);
        return { path, success: true };
      } catch (error) {
        console.error(`❌ Failed to revalidate path ${path}:`, error);
        return { path, success: false, error: String(error) };
      }
    });
    
    // 7. Update monitoring info
    lastRevalidation = {
      timestamp: new Date().toISOString(),
      tag: tagsToRevalidate.join(', '),
      success: tagResults.every(r => r.success) && pathResults.every(r => r.success)
    };
    
    // 8. Return success response
    return NextResponse.json({
      success: true,
      revalidated: true,
      tags: tagsToRevalidate,
      paths: pathsToRevalidate,
      tagResults,
      pathResults,
      timestamp: lastRevalidation.timestamp,
      message: `Cache invalidated for ${tagsToRevalidate.length} tags and ${pathsToRevalidate.length} paths`,
      event_type,
      record_type: record?.type || record?.opportunity_type
    });
    
  } catch (error) {
    // 9. Handle errors gracefully
    console.error('❌ Revalidation error:', error);
    
    lastRevalidation.success = false;
    
    return NextResponse.json(
      { 
        error: 'Revalidation failed',
        details: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// GET endpoint for testing
export async function GET(request: NextRequest) {
  const secret = request.headers.get('x-revalidate-secret');
  
  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  return NextResponse.json({
    status: 'operational',
    lastRevalidation,
    cacheTags: [
      'opportunities', 
      'opportunities-jobs', 
      'opportunities-surveys', 
      'digital-tools',
      'jobs-list',
      'surveys-list',
      'tools-list'
    ],
    note: 'Webhook-only cache strategy. Cache updates only on webhook events.',
    timestamp: new Date().toISOString()
  });
}