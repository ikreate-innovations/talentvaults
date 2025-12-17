// components/seo/JobSchema.tsx - PRODUCTION VERSION
import Script from 'next/script';

interface JobSchemaProps {
  job: {
    id: string;
    title: string;
    description: string;
    company?: string;
    location?: string;
    hourly_rate?: string;
    employment_type?: string;
    created_at?: string;
    company_website?: string; // Should come from DB
    page_slug: string;
    // NEW: Structured fields (should be in DB)
    country_code?: string; // "US", "DE", "GB"
    is_remote?: boolean;
    is_worldwide?: boolean;
    salary_min?: number;
    salary_max?: number;
    salary_currency?: string; // "USD", "EUR"
    salary_unit?: 'HOUR' | 'YEAR' | 'MONTH';
  };
}

// SIMPLE: Clean HTML, no clever parsing
const cleanDescription = (html: string): string => {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 2500); // Even safer
};

// SIMPLE: Safe date handling only
const getValidDates = (createdAt?: string) => {
  try {
    const datePosted = createdAt ? new Date(createdAt) : new Date();
    if (isNaN(datePosted.getTime())) throw new Error('Invalid');
    
    const validThrough = new Date(datePosted);
    validThrough.setDate(validThrough.getDate() + 30);
    
    return {
      datePosted: datePosted.toISOString().split('T')[0],
      validThrough: validThrough.toISOString().split('T')[0]
    };
  } catch {
    const today = new Date();
    const validThrough = new Date(today);
    validThrough.setDate(validThrough.getDate() + 30);
    
    return {
      datePosted: today.toISOString().split('T')[0],
      validThrough: validThrough.toISOString().split('T')[0]
    };
  }
};

// SIMPLE: Map employment type
const mapEmploymentType = (type?: string): string => {
  if (!type) return 'CONTRACT';
  const upper = type.toUpperCase();
  if (upper.includes('FULL')) return 'FULL_TIME';
  if (upper.includes('PART')) return 'PART_TIME';
  if (upper.includes('CONTRACT')) return 'CONTRACT';
  if (upper.includes('TEMP')) return 'TEMPORARY';
  if (upper.includes('INTERN')) return 'INTERN';
  return 'CONTRACT';
};

export default function JobSchema({ job }: JobSchemaProps) {
  const { datePosted, validThrough } = getValidDates(job.created_at);
  const cleanDesc = cleanDescription(job.description);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://talentvaults.com';
  
  // SIMPLE: Build schema from structured data
  const schema: any = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": job.title,
    "description": cleanDesc,
    "identifier": {
      "@type": "PropertyValue",
      "name": job.company || "Confidential",
      "value": job.id
    },
    "datePosted": datePosted,
    "validThrough": validThrough,
    "employmentType": mapEmploymentType(job.employment_type),
    "hiringOrganization": {
      "@type": "Organization",
      "name": job.company || "Confidential",
      ...(job.company_website && { "sameAs": job.company_website })
    },
    "url": `${baseUrl}/jobs/${job.page_slug}`,
  };
  
  // SIMPLE: Location from structured fields
  if (job.is_remote) {
    schema.jobLocationType = "TELECOMMUTE";
    // Only add restrictions if NOT worldwide AND we have a country
    if (!job.is_worldwide && job.country_code) {
      schema.applicantLocationRequirements = {
        "@type": "Country",
        "name": job.country_code
      };
    }
  } else if (job.country_code) {
    // Physical location with known country
    schema.jobLocation = {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": job.country_code
      }
    };
  }
  
  // SIMPLE: Salary from structured fields
  if (job.salary_min !== undefined && job.salary_currency && job.salary_unit) {
    schema.baseSalary = {
      "@type": "MonetaryAmount",
      "currency": job.salary_currency,
      "value": {
        "@type": "QuantitativeValue",
        ...(job.salary_max !== undefined 
          ? { minValue: job.salary_min, maxValue: job.salary_max }
          : { value: job.salary_min }),
        "unitText": job.salary_unit
      }
    };
  }
  
  return (
    <Script
      id={`job-schema-${job.id}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      strategy="afterInteractive"
    />
  );
}