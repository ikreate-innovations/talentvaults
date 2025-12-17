// app/jobs/layout.tsx - Create this file in /app/jobs/
import { unstable_cache } from 'next/cache';

// This layout enables webhook-only caching for ALL jobs pages
export const revalidate = false; // No time-based revalidation
export const dynamic = 'error'; // Force static generation, error if dynamic

// Optional: Add this if you want to cache the layout itself
export default function JobsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}