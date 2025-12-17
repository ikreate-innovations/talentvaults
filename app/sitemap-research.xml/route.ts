import { NextRequest } from 'next/server';
import { supabase } from '@/lib/db/supabase';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://talentvaults.com';

export const dynamic = 'force-dynamic';
export const revalidate = 86400; // Cache for 24 hours

export async function GET(_req: NextRequest) {
  try {
    const { data: surveys, error } = await supabase
      .from('opportunities')
      .select('page_slug, updated_at, created_at')
      .eq('type', 'survey')
      .eq('page_generated', true)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching research for sitemap:', error);
      return new Response('', { status: 500 });
    }

    const urls = (surveys || [])
      .map((survey) => {
        const lastmod = survey.updated_at 
          ? new Date(survey.updated_at).toISOString()
          : (survey.created_at 
              ? new Date(survey.created_at).toISOString() 
              : new Date().toISOString());
        
        return `
  <url>
    <loc>${BASE_URL}/research/${survey.page_slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
      })
      .join('');

    // Include research listing page
    const listingPage = `
  <url>
    <loc>${BASE_URL}/research</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;

    const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${listingPage}
${urls}
</urlset>`.trim();

    return new Response(body, {
      headers: { 
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=172800',
      },
    });
  } catch (error) {
    console.error('❌ Error generating research sitemap:', error);
    return new Response('', { status: 500 });
  }
}