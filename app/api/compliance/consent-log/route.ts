// /app/api/compliance/consent-log/route.ts - FIXED VERSION
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

// Define TypeScript interfaces for type safety
interface ConsentLogPayload {
  event: 'consent_accepted' | 'consent_rejected';
  user_consent_choice: string;
  legal_basis: string;
  timestamp: string;
  user_agent: string;
  banner_version?: string;
  retention_note?: string;
  note?: string;
}

// Helper function to anonymize IP address (GDPR Data Minimization)
function anonymizeIpAddress(ip: string | null | undefined): string | null {
  if (!ip) return null;
  
  // Remove IPv4 last octet: 192.168.1.123 -> 192.168.1.0
  if (ip.includes('.')) {
    return ip.replace(/\.\d+$/, '.0');
  }
  
  // For IPv6, truncate to first 64 bits
  if (ip.includes(':')) {
    const parts = ip.split(':');
    if (parts.length >= 4) {
      return `${parts.slice(0, 4).join(':')}::`;
    }
  }
  
  return null;
}

// Helper to validate the incoming payload
function validateConsentPayload(data: any): { isValid: boolean; payload?: ConsentLogPayload; error?: string } {
  try {
    // Required fields validation
    if (!data.event || !['consent_accepted', 'consent_rejected'].includes(data.event)) {
      return { isValid: false, error: 'Invalid or missing event type' };
    }
    
    if (!data.user_consent_choice || typeof data.user_consent_choice !== 'string') {
      return { isValid: false, error: 'Invalid or missing user_consent_choice' };
    }
    
    if (!data.legal_basis || typeof data.legal_basis !== 'string') {
      return { isValid: false, error: 'Invalid or missing legal_basis' };
    }
    
    // Ensure legal basis matches GDPR Article 6(1)(a)
    if (!data.legal_basis.includes('Art. 6(1)(a)')) {
      console.warn('⚠️ Legal basis mismatch: Expected Art. 6(1)(a) GDPR');
    }
    
    const validatedPayload: ConsentLogPayload = {
      event: data.event,
      user_consent_choice: data.user_consent_choice.substring(0, 100),
      legal_basis: data.legal_basis.substring(0, 50),
      timestamp: data.timestamp || new Date().toISOString(),
      user_agent: (data.user_agent || '').substring(0, 500),
      banner_version: data.banner_version || '1.0',
      retention_note: data.retention_note || 'Auto-deleted after 90 days per GDPR Art. 5(1)(c)',
      note: data.note ? data.note.substring(0, 1000) : undefined
    };
    
    return { isValid: true, payload: validatedPayload };
  } catch (error) {
    return { isValid: false, error: 'Payload validation failed' };
  }
}

// SIMPLE IN-MEMORY STORAGE FOR DEVELOPMENT
// Fixed to work with older TypeScript targets
class ConsentLogStore {
  private static instance: ConsentLogStore;
  private logs: Map<string, any> = new Map();
  
  static getInstance(): ConsentLogStore {
    if (!ConsentLogStore.instance) {
      ConsentLogStore.instance = new ConsentLogStore();
    }
    return ConsentLogStore.instance;
  }
  
  async saveLog(logData: any): Promise<string> {
    const auditId = `audit_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    this.logs.set(auditId, {
      ...logData,
      audit_id: auditId,
      created_at: new Date(),
      delete_after: new Date(Date.now() + (90 * 24 * 60 * 60 * 1000)) // 90 days
    });
    
    // Simple cleanup of expired logs
    this.cleanupExpiredLogs();
    
    return auditId;
  }
  
  async getLogs(filters?: any): Promise<any[]> {
    // Convert Map to Array for compatibility with older TypeScript targets
    let logs: any[] = [];
    this.logs.forEach((value, key) => {
      logs.push(value);
    });
    
    if (filters?.eventType) {
      logs = logs.filter(log => log.event === filters.eventType);
    }
    
    if (filters?.startDate) {
      const start = new Date(filters.startDate);
      logs = logs.filter(log => new Date(log.created_at) >= start);
    }
    
    if (filters?.endDate) {
      const end = new Date(filters.endDate);
      logs = logs.filter(log => new Date(log.created_at) <= end);
    }
    
    // Sort by newest first
    logs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    
    // Apply limit
    if (filters?.limit) {
      logs = logs.slice(0, Math.min(filters.limit, 1000));
    }
    
    return logs;
  }
  
  async deleteLogsBefore(date: Date): Promise<number> {
    const initialSize = this.logs.size;
    const deleteBefore = date.getTime();
    
    // Create an array of keys to delete (compatible with older TypeScript)
    const keysToDelete: string[] = [];
    this.logs.forEach((value, key) => {
      if (new Date(value.created_at).getTime() < deleteBefore) {
        keysToDelete.push(key);
      }
    });
    
    // Delete the keys
    keysToDelete.forEach(key => {
      this.logs.delete(key);
    });
    
    return initialSize - this.logs.size;
  }
  
  private cleanupExpiredLogs(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];
    
    this.logs.forEach((value, key) => {
      if (new Date(value.delete_after).getTime() < now) {
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach(key => {
      this.logs.delete(key);
    });
  }
}

// GET endpoint for internal audits
export async function GET(request: NextRequest) {
  try {
    // SECURITY: Implement proper authentication in production
    const authHeader = request.headers.get('authorization');
    const secretToken = process.env.AUDIT_API_TOKEN;
    
    // Basic token check
    if (process.env.NODE_ENV === 'production') {
      if (!authHeader || authHeader !== `Bearer ${secretToken}`) {
        return NextResponse.json(
          { error: 'Unauthorized - Audit access requires authentication' },
          { status: 401 }
        );
      }
    }
    
    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const filters = {
      eventType: searchParams.get('event'),
      startDate: searchParams.get('start_date'),
      endDate: searchParams.get('end_date'),
      limit: parseInt(searchParams.get('limit') || '100')
    };
    
    // Get logs from store
    const store = ConsentLogStore.getInstance();
    const logs = await store.getLogs(filters);
    
    // Return logs with metadata
    return NextResponse.json({
      success: true,
      count: logs.length,
      retention_notice: 'Logs are automatically deleted after 90 days per GDPR data minimization',
      legal_basis: 'Art. 6(1)(a) GDPR - User consent for logging their consent decision',
      logs: logs.map(log => ({
        id: log.audit_id,
        event: log.event,
        user_choice: log.user_consent_choice,
        timestamp: log.created_at,
        legal_basis: log.legal_basis,
        ip_anonymized: !!log.anonymized_ip,
        delete_scheduled: log.delete_after,
        days_remaining: Math.ceil((new Date(log.delete_after).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      }))
    });
    
  } catch (error) {
    console.error('❌ Audit log retrieval failed:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve audit logs', details: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST endpoint for logging consent events
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    
    // Validate the payload
    const validation = validateConsentPayload(body);
    if (!validation.isValid || !validation.payload) {
      return NextResponse.json(
        { error: 'Invalid consent log data', details: validation.error },
        { status: 400 }
      );
    }
    
    const logData = validation.payload;
    
    // Extract and anonymize IP address (GDPR Data Minimization)
    const headersList = await headers();
    const forwardedFor = headersList.get('x-forwarded-for');
    const realIp = headersList.get('x-real-ip');
    const remoteAddress = forwardedFor || realIp || 'unknown';
    
    // Anonymize IP - Critical for GDPR compliance
    const anonymizedIp = anonymizeIpAddress(remoteAddress.split(',')[0].trim());
    
    // Calculate deletion date: 90 days from now (GDPR Retention Limit)
    const deleteAfter = new Date();
    deleteAfter.setDate(deleteAfter.getDate() + 90);
    
    // Save to store
    const store = ConsentLogStore.getInstance();
    const auditId = await store.saveLog({
      ...logData,
      anonymized_ip: anonymizedIp,
      delete_after: deleteAfter
    });
    
    console.log(`✅ Consent event logged: ${logData.event} - Audit ID: ${auditId}`);
    console.log(`   Retention: 90 days (deletes on ${deleteAfter.toISOString().split('T')[0]})`);
    console.log(`   Legal Basis: ${logData.legal_basis}`);
    console.log(`   IP Handling: ${anonymizedIp ? 'Anonymized' : 'No IP stored'}`);
    
    // Return success response
    return NextResponse.json({
      success: true,
      audit_id: auditId,
      event: logData.event,
      timestamp: logData.timestamp,
      retention_period: '90 days',
      deletion_date: deleteAfter.toISOString(),
      ip_status: anonymizedIp ? 'anonymized_and_stored' : 'no_ip_stored',
      legal_basis: logData.legal_basis,
      note: 'Consent logged under Art. 6(1)(a) GDPR - Will be automatically deleted after 90 days'
    }, { status: 201 });
    
  } catch (error: any) {
    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON payload' },
        { status: 400 }
      );
    }
    
    // Handle other errors
    console.error('❌ Failed to log consent event:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: 'Consent logging service temporarily unavailable',
        note: 'This does not affect your consent choice - it is still recorded in your browser cookies'
      },
      { status: 500 }
    );
  }
}

// Optional: DELETE endpoint for manual cleanup
export async function DELETE(request: NextRequest) {
  try {
    // Strict authentication for admin operations
    const authHeader = request.headers.get('authorization');
    const adminToken = process.env.ADMIN_API_TOKEN;
    
    if (process.env.NODE_ENV === 'production') {
      if (!authHeader || authHeader !== `Bearer ${adminToken}`) {
        return NextResponse.json(
          { error: 'Unauthorized - Admin access required' },
          { status: 401 }
        );
      }
    }
    
    // Force delete logs older than specified date
    const searchParams = request.nextUrl.searchParams;
    const beforeDate = searchParams.get('before_date') || new Date().toISOString();
    
    const store = ConsentLogStore.getInstance();
    const deletedCount = await store.deleteLogsBefore(new Date(beforeDate));
    
    return NextResponse.json({
      success: true,
      deleted_count: deletedCount,
      before_date: beforeDate,
      note: 'Manual cleanup completed - Automatic 90-day deletion still active'
    });
    
  } catch (error) {
    console.error('❌ Manual cleanup failed:', error);
    return NextResponse.json(
      { error: 'Cleanup operation failed' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}