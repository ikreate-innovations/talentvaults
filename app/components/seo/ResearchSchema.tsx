// components/seo/ResearchSchema.tsx
import Script from 'next/script';

interface ResearchSchemaProps {
  opportunity: {
    id: string;
    title: string;
    description: string;
    reward: string | null;
    time_estimate: string | null;
    category: string | null;
    created_at?: string;
    page_slug: string;
    // Structured fields for surveys
    country_code?: string;
    compensation_amount?: number;
    compensation_currency?: string;
  };
}

const cleanDescription = (html: string): string => {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 2000);
};

const parseReward = (reward: string | null): { value: number; currency: string } => {
  if (!reward) return { value: 0, currency: 'USD' };
  
  let value = 0;
  let currency = 'USD';
  
  // Extract number
  const numMatch = reward.match(/\$(\d+)/) || reward.match(/(\d+)\s*(USD|EUR|GBP)/i);
  if (numMatch) {
    value = parseFloat(numMatch[1]);
  }
  
  // Extract currency
  if (reward.includes('€') || reward.toLowerCase().includes('eur')) {
    currency = 'EUR';
  } else if (reward.includes('£') || reward.toLowerCase().includes('gbp')) {
    currency = 'GBP';
  }
  
  return { value, currency };
};

export default function ResearchSchema({ opportunity }: ResearchSchemaProps) {
  const cleanDesc = cleanDescription(opportunity.description);
  const { value, currency } = parseReward(opportunity.reward);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://talentvaults.com';
  
  // Use structured compensation if available
  const compensationValue = opportunity.compensation_amount || value;
  const compensationCurrency = opportunity.compensation_currency || currency;
  
  const schema = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": `Research Study: ${opportunity.title}`,
    "description": cleanDesc,
    "identifier": {
      "@type": "PropertyValue",
      "name": "TalentVaults Research",
      "value": opportunity.id
    },
    "datePosted": opportunity.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
    "validThrough": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    "employmentType": ["CONTRACTOR", "TEMPORARY"],
    "hiringOrganization": {
      "@type": "Organization",
      "name": opportunity.category ? `${opportunity.category} Research Partner` : "TalentVaults Research Partner",
      "url": baseUrl
    },
    "jobLocationType": "TELECOMMUTE",
    ...(opportunity.country_code && {
      "applicantLocationRequirements": {
        "@type": "Country",
        "name": opportunity.country_code
      }
    }),
    ...(compensationValue > 0 && {
      "baseSalary": {
        "@type": "MonetaryAmount",
        "currency": compensationCurrency,
        "value": {
          "@type": "QuantitativeValue",
          "value": compensationValue,
          "unitText": "PROJECT"
        }
      }
    })
  };

  return (
    <Script
      id={`research-schema-${opportunity.id}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      strategy="afterInteractive"
    />
  );
}