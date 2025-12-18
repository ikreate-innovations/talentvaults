// netlify/edge-functions/cache-homepage.ts
export default async (request: Request, context: any) => {
  const url = new URL(request.url);
  const response = await context.next();
  
  // Only cache GET requests with 200 status
  if (request.method === 'GET' && response.status === 200) {
    // Homepage caching (1 hour + 24hr stale-while-revalidate)
    if (url.pathname === '/' || url.pathname === '/index.html') {
      response.headers.set(
        'Netlify-CDN-Cache-Control',
        'public, s-maxage=3600, stale-while-revalidate=86400, durable'
      );
      response.headers.set('Cache-Tag', 'homepage-jobs,homepage-surveys');
    }
    
    // Jobs listing page caching
    else if (url.pathname === '/jobs') {
      response.headers.set(
        'Netlify-CDN-Cache-Control',
        'public, s-maxage=1800, stale-while-revalidate=86400, durable' // 30 minutes
      );
      response.headers.set('Cache-Tag', 'jobs-list,opportunities-jobs');
    }
    
    // Research listing page caching
    else if (url.pathname === '/research') {
      response.headers.set(
        'Netlify-CDN-Cache-Control',
        'public, s-maxage=1800, stale-while-revalidate=86400, durable' // 30 minutes
      );
      response.headers.set('Cache-Tag', 'surveys-list,opportunities-surveys');
    }
    
    // Individual job pages (shorter cache)
    else if (url.pathname.match(/^\/jobs\/[^\/]+$/)) {
      const slug = url.pathname.split('/')[2];
      response.headers.set(
        'Netlify-CDN-Cache-Control',
        'public, s-maxage=900, stale-while-revalidate=86400, durable' // 15 minutes
      );
      response.headers.set('Cache-Tag', `job-${slug}`);
    }
    
    // Individual research pages
    else if (url.pathname.match(/^\/research\/[^\/]+$/)) {
      const slug = url.pathname.split('/')[2];
      response.headers.set(
        'Netlify-CDN-Cache-Control',
        'public, s-maxage=900, stale-while-revalidate=86400, durable' // 15 minutes
      );
      response.headers.set('Cache-Tag', `survey-${slug}`);
    }
    
    // Static assets (long cache)
    else if (url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
      response.headers.set(
        'Netlify-CDN-Cache-Control',
        'public, max-age=31536000, immutable' // 1 year
      );
    }
  }
  
  return response;
};

export const config = { 
  path: ['/*'] 
};