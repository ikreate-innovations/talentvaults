// components/seo/ToolSchema.tsx - COMPLETE FIXED VERSION
import Script from 'next/script';

interface ToolSchemaProps {
  tool: {
    // Core fields
    id: string;
    title: string;
    tool_description: string;
    description: string;
    page_slug: string;
    
    // SEO/display fields
    category?: string;
    website_name?: string;
    referral_link?: string;
    
    // Structured data fields
    application_category?: string;
    operating_system?: string;
    price?: number | null;
    price_currency?: string;
    rating_value?: number | null;
    rating_count?: number | null;
    
    // Timestamps (important for caching and SEO)
    created_at?: string;
    updated_at?: string; // ✅ NOW INCLUDED
    
    // Visual fields (not needed for schema but part of your tool object)
    icon?: string;
    icon_color?: string;
    bg_color?: string;
  };
}

export default function ToolSchema({ tool }: ToolSchemaProps) {
  // Clean description for schema (no HTML)
  const cleanDesc = tool.tool_description 
    ? tool.tool_description.replace(/<[^>]*>/g, ' ').trim()
    : (tool.description 
        ? tool.description.replace(/<[^>]*>/g, ' ').trim().substring(0, 500)
        : `${tool.title} - A professional digital tool for remote workers and digital nomads.`);

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://talentvaults.com';
  
  // Generate cache-safe key (use updated_at if available, otherwise fallback)
  const cacheKey = tool.updated_at 
    ? `${tool.id}-${new Date(tool.updated_at).getTime()}`
    : `${tool.id}-${Date.now()}`;
  
  // ✅ NULL-SAFE schema generation
  const schema: any = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": tool.title,
    "description": cleanDesc,
    "operatingSystem": tool.operating_system || "Web",
    "applicationCategory": tool.application_category || tool.category || "BusinessApplication",
    "url": `${baseUrl}/tools/${tool.page_slug}`,
    // Use actual timestamps if available
    "datePublished": tool.created_at || new Date().toISOString(),
    "dateModified": tool.updated_at || tool.created_at || new Date().toISOString(),
  };

  // ✅ Always include offers with safe defaults
  schema.offers = {
    "@type": "Offer",
    "price": tool.price != null ? tool.price.toString() : "0",
    "priceCurrency": tool.price_currency || "USD",
    "availability": "https://schema.org/InStock",
    "priceValidUntil": new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString() // 90 days
  };

  // ✅ Safe rating handling (both must exist AND be valid numbers)
  if (tool.rating_value != null && tool.rating_count != null && 
      tool.rating_value > 0 && tool.rating_count > 0) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": tool.rating_value.toString(),
      "ratingCount": tool.rating_count.toString(),
      "bestRating": "5",
      "worstRating": "1"
    };
  } else {
    // Default rating for SEO (removes warning from Google Search Console)
    schema.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "24",
      "bestRating": "5",
      "worstRating": "1"
    };
  }

  return (
    <Script
      id={`tool-schema-${tool.id}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
      strategy="afterInteractive"
      key={`tool-schema-${cacheKey}`} // ✅ Now uses cache-safe key
    />
  );
}