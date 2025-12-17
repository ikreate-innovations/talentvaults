import { NextRequest } from 'next/server';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://talentvaults.com';

export const revalidate = 86400; // Cache for 24 hours

export async function GET(_req: NextRequest) {
  const now = new Date().toISOString();
  
  const staticPages = [
    // Homepage & Core Pages
    { path: '/', priority: '1.0', changefreq: 'daily' },
    { path: '/vetting-process', priority: '0.9', changefreq: 'weekly' },
    
    // Listing Pages
    { path: '/jobs', priority: '0.8', changefreq: 'daily' },
    { path: '/research', priority: '0.8', changefreq: 'weekly' },
    { path: '/tools', priority: '0.8', changefreq: 'weekly' },
    
    // Legal Pages (NEW - MUST ADD TO YOUR FOOTER NAVIGATION)
    { path: '/legal/imprint', priority: '0.3', changefreq: 'monthly' },
    { path: '/legal/privacy', priority: '0.3', changefreq: 'monthly' },
    { path: '/legal/terms', priority: '0.3', changefreq: 'monthly' },
    
    // Admin Page (optional - might want to exclude from sitemap)
    // { path: '/admin/add-opportunity', priority: '0.1', changefreq: 'monthly' },
  ];

  const urls = staticPages
    .map((page) => {
      return `
  <url>
    <loc>${BASE_URL}${page.path}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
    })
    .join('');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`.trim();

  return new Response(body, {
    headers: { 
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
    },
  });
}