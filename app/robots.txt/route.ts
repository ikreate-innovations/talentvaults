import { NextRequest } from 'next/server';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://talentvaults.com';

export async function GET(_req: NextRequest) {
  const body = `# robots.txt - TalentVaults
# Updated: ${new Date().toISOString().split('T')[0]}
# Generator: Next.js App Router

User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /private/

User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: AhrefsBot
Crawl-delay: 5

User-agent: SemrushBot
Crawl-delay: 5

User-agent: MJ12bot
Disallow: /

User-agent: DotBot
Disallow: /

Sitemap: ${BASE_URL}/sitemap.xml
Sitemap: ${BASE_URL}/sitemap-jobs.xml
Sitemap: ${BASE_URL}/sitemap-research.xml
Sitemap: ${BASE_URL}/sitemap-tools.xml
Sitemap: ${BASE_URL}/sitemap-static.xml`.trim();

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
    },
  });
}