import { NextRequest } from 'next/server';
import { supabase } from '@/lib/db/supabase';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://talentvaults.com';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Cache for 1 hour

export async function GET(_req: NextRequest) {
  try {
    const { data: jobs, error } = await supabase
      .from('opportunities')
      .select('page_slug, updated_at, created_at')
      .eq('type', 'job')
      .eq('page_generated', true)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching jobs for sitemap:', error);
      return new Response('', { status: 500 });
    }

    const urls = (jobs || [])
      .map((job) => {
        const lastmod = job.updated_at 
          ? new Date(job.updated_at).toISOString()
          : (job.created_at 
              ? new Date(job.created_at).toISOString() 
              : new Date().toISOString());
        
        return `
  <url>
    <loc>${BASE_URL}/jobs/${job.page_slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>`;
      })
      .join('');

    // Also include the jobs listing page
    const listingPage = `
  <url>
    <loc>${BASE_URL}/jobs</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`;

    const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${listingPage}
${urls}
</urlset>`.trim();

    return new Response(body, {
      headers: { 
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    });
  } catch (error) {
    console.error('❌ Error generating jobs sitemap:', error);
    return new Response('', { status: 500 });
  }
}