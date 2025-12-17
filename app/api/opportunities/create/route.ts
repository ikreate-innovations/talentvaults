// app/api/opportunities/create/route.ts - UPDATED WITH VETTING AGENT
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/db/supabase';
import axios from 'axios';
import { revalidatePath } from 'next/cache';

// ========== TYPE DEFINITIONS ==========
interface BaseOpportunityData {
  title: string;
  description: string;
  opportunityType: 'survey' | 'job' | 'tool';
  source: string;
  websiteName: string;
}

interface SurveyData extends BaseOpportunityData {
  type: 'survey';
  reward: string;
  timeEstimate: string;
  category: string;
  eligibility: string[];
  country_code?: string;
  compensation_amount?: number;
  compensation_currency?: string;
}

interface JobData extends BaseOpportunityData {
  type: 'job';
  company: string;
  location: string;
  hourlyRate: string;
  vettingScore: number;
  complianceStatus: string;
  country_code?: string;
  is_remote?: boolean;
  is_worldwide?: boolean;
  salary_min?: number;
  salary_max?: number;
  salary_currency?: string;
  salary_unit?: 'HOUR' | 'YEAR' | 'MONTH';
  company_website?: string;
}

interface ToolData extends BaseOpportunityData {
  type: 'tool';
  icon: string;
  iconColor: string;
  bgColor: string;
  toolDescription: string;
  link: string;
  application_category?: string;
  operating_system?: string;
  price?: number;
  price_currency?: string;
  rating_value?: number;
  rating_count?: number;
}

// ========== VETTING AGENT TYPES & FUNCTIONS ==========
interface VettingResult {
  score: number;
  status: 'APPROVED' | 'REJECTED' | 'MANUAL_REVIEW';
  flags: string[];
  complianceNote: string;
}

// Helper to normalize currency to USD for comparison
function normalizeToUSD(amount: number, currency: string): number {
  const rates: Record<string, number> = { 
    'EUR': 1.05, 
    'GBP': 1.25, 
    'USD': 1.0, 
    'CAD': 0.72, 
    'AUD': 0.65 
  };
  return amount * (rates[currency] || 1.0);
}

// Helper to scan for blacklisted keywords (Step 3: Scam-Proof Screening)
function checkBlacklistKeywords(text: string): string[] {
  const flags: string[] = [];
  const lowerText = text.toLowerCase();
  
  // High-risk contact methods
  if (lowerText.match(/(telegram|whatsapp|signal)\s*[:@\d+]/)) {
    flags.push('High Risk: Uses anonymous messaging apps (Telegram/WhatsApp)');
  }
  
  if (lowerText.match(/@(?:gmail|yahoo|hotmail|outlook|aol)\.com/)) {
    flags.push('Medium Risk: Uses generic email provider');
  }
  
  // Financial red flags
  if (lowerText.includes('check cashing') || lowerText.includes('cash check')) {
    flags.push('Critical Scam Risk: Check cashing mentioned');
  }
  
  if (lowerText.includes('western union') || lowerText.includes('moneygram')) {
    flags.push('Critical Scam Risk: Wire transfer mentioned');
  }
  
  if (lowerText.includes('equipment fee') || lowerText.includes('purchase equipment') || lowerText.includes('startup fee')) {
    flags.push('Critical Scam Risk: Upfront payment/equipment fee');
  }
  
  // Pyramid scheme indicators
  if (lowerText.includes('multi-level marketing') || lowerText.includes('mlm')) {
    flags.push('Critical Scam Risk: Multi-level marketing scheme');
  }
  
  if (lowerText.includes('passive income') && lowerText.includes('no experience')) {
    flags.push('Medium Risk: Unrealistic passive income claims');
  }
  
  return flags;
}

// The Vetting Agent Function
async function vetJobOpportunity(description: string, extractedData: JobData): Promise<VettingResult> {
  console.log('🛡️ Vetting Agent: Analyzing opportunity...');
  const flags: string[] = [];
  let step2Score = 0; // Senior Pay
  let step3Score = 0; // Scam Proof
  let step4Score = 0; // Clarity

  // --- STEP 2: Senior-Level Pay ($80+/hr) ---
  const minRate = extractedData.salary_min || 0;
  const currency = extractedData.salary_currency || 'USD';
  const usdRate = normalizeToUSD(minRate, currency);

  if (usdRate >= 80) {
    step2Score = 30; // Full points for meeting threshold
  } else if (usdRate >= 50) {
    step2Score = 15; // Partial points for mid-level
    flags.push(`Pay Rate Warning: $${usdRate.toFixed(2)}/hr is below senior standard ($80+)`);
  } else {
    step2Score = 0;
    flags.push(`Low Pay: $${usdRate.toFixed(2)}/hr does not meet senior vetting criteria`);
  }

  // --- STEP 3 (Part A): Keyword Scan ---
  const keywordFlags = checkBlacklistKeywords(description + ' ' + extractedData.company);
  flags.push(...keywordFlags);
  
  // If critical keywords found, Step 3 score is 0
  const hasCriticalScam = keywordFlags.some(f => f.includes('Critical'));
  if (hasCriticalScam) {
    step3Score = 0;
  } else {
    step3Score = 30; // Start with full points, AI might deduct
  }

  // --- STEP 3 (Part B) & STEP 4: AI Analysis for Context & Clarity ---
  try {
    const response = await axios.post(
      'https://api.mistral.ai/v1/chat/completions',
      {
        model: 'mistral-small-latest',
        messages: [
          {
            role: 'system',
            content: `You are a Risk & Quality Assurance Auditor for a job board that serves senior professionals. Analyze the job description.
            
            Evaluate two specific areas:
            1. SCAM RISK (Step 3): Look for "too good to be true" language, vague business models, or requests for upfront work/money. Also check for unrealistic promises or poor grammar that indicates spam.
            2. DELIVERABLE CLARITY (Step 4): Does it list specific responsibilities and deliverables? Or is it vague "rockstar" fluff? Score based on specificity and professional tone.

            Return JSON:
            {
              "scam_likelihood": "LOW" | "MEDIUM" | "HIGH",
              "clarity_score": number (0-10, where 10 is very specific scope),
              "clarity_reason": "short explanation",
              "risk_reason": "short explanation"
            }
            
            IMPORTANT: LOW scam likelihood = no red flags, MEDIUM = some concerning elements, HIGH = clear scam indicators.`
          },
          { 
            role: 'user', 
            content: `Job Title: ${extractedData.title}\nCompany: ${extractedData.company}\nLocation: ${extractedData.location}\nRate: ${extractedData.hourlyRate}\n\nDescription:\n${description}` 
          }
        ],
        max_tokens: 300,
        temperature: 0.1,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
        },
      }
    );

    const content = response.data.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('No JSON found in AI vetting response');
    }
    
    const analysis = JSON.parse(jsonMatch[0]);
    
    // Calculate AI Scores
    // Scam adjustments
    if (analysis.scam_likelihood === 'HIGH') {
      step3Score = 0;
      flags.push(`AI Scam Flag: ${analysis.risk_reason}`);
    } else if (analysis.scam_likelihood === 'MEDIUM') {
      step3Score = 15;
      flags.push(`AI Risk Warning: ${analysis.risk_reason}`);
    }

    // Clarity Score (Step 4) - Max 40 points
    // 0-10 scale maps to 0-40 points
    step4Score = (analysis.clarity_score / 10) * 40;
    
    if (analysis.clarity_score < 5) {
      flags.push(`Vague Description: ${analysis.clarity_reason}`);
    }

  } catch (error) {
    console.error('⚠️ AI Vetting failed, defaulting to neutral clarity score', error);
    step4Score = 20; // Default to middle if AI fails
  }

  // --- FINAL SCORE CALCULATION ---
  // Max Score = 30 (Pay) + 30 (Scam) + 40 (Clarity) = 100
  let totalScore = Math.round(step2Score + step3Score + step4Score);
  
  // Critical Failure Overrides
  if (hasCriticalScam) {
    totalScore = 0;
  }

  // Status Logic
  let status: 'APPROVED' | 'REJECTED' | 'MANUAL_REVIEW' = 'APPROVED';
  if (totalScore < 50 || hasCriticalScam) {
    status = 'REJECTED';
  } else if (totalScore < 85) {
    status = 'MANUAL_REVIEW'; // Below your 85+ promise
  }

  // Generate Compliance Note
  const complianceNote = `Vetting Score: ${totalScore}/100. ${flags.length > 0 ? 'Flags: ' + flags.join('; ') : 'Meets all quality protocols for senior professionals.'}`;

  console.log('📊 Vetting Complete:', { 
    score: totalScore, 
    status, 
    flags: flags.length,
    breakdown: { step2Score, step3Score, step4Score }
  });

  return { 
    score: totalScore, 
    status, 
    flags, 
    complianceNote 
  };
}

// ========== UTILITY FUNCTIONS ==========
function validateRephrasing(original: string, reworded: string): void {
  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did']);
  
  const originalWords = original.toLowerCase()
    .split(/\W+/)
    .filter(w => w.length > 3 && !stopWords.has(w));
  
  const rewordedWords = reworded.toLowerCase()
    .split(/\W+/)
    .filter(w => w.length > 3 && !stopWords.has(w));
  
  if (originalWords.length === 0 || rewordedWords.length === 0) return;
  
  const commonWords = originalWords.filter(word => 
    rewordedWords.includes(word)
  ).length;
  
  const similarityRatio = commonWords / Math.max(originalWords.length, 1);
  
  if (similarityRatio > 0.5) {
    console.warn(`⚠️ High similarity detected: ${Math.round(similarityRatio * 100)}% word overlap`);
  }
}

function cleanFirstSentence(text: string): string {
  if (!text) return text;
  
  const lines = text.split('\n');
  if (lines.length > 0) {
    lines[0] = lines[0].replace(/\*\*(.*?)\*\*/g, '$1');
  }
  
  return lines.join('\n');
}

function extractCountryCode(location: string): string | undefined {
  if (!location) return 'US';
  
  const match = location.match(/\(([A-Z]{2})\)/);
  if (match) return match[1];
  
  const lowerLocation = location.toLowerCase();
  if (lowerLocation.includes('usa') || lowerLocation.includes('united states') || lowerLocation.includes('u.s.')) return 'US';
  if (lowerLocation.includes('uk') || lowerLocation.includes('united kingdom') || lowerLocation.includes('britain')) return 'GB';
  if (lowerLocation.includes('germany')) return 'DE';
  if (lowerLocation.includes('france')) return 'FR';
  if (lowerLocation.includes('spain')) return 'ES';
  if (lowerLocation.includes('canada')) return 'CA';
  if (lowerLocation.includes('australia')) return 'AU';
  if (lowerLocation.includes('india')) return 'IN';
  
  return 'US';
}

function parseSalary(salaryString: string): {
  min?: number;
  max?: number;
  currency: string;
  unit: 'HOUR' | 'YEAR' | 'MONTH';
} {
  if (!salaryString) return { currency: 'USD', unit: 'HOUR' };
  
  let currency = 'USD';
  if (salaryString.includes('€')) currency = 'EUR';
  else if (salaryString.includes('£')) currency = 'GBP';
  
  let unit: 'HOUR' | 'YEAR' | 'MONTH' = 'HOUR';
  const lower = salaryString.toLowerCase();
  if (lower.includes('year') || lower.includes('annual')) unit = 'YEAR';
  else if (lower.includes('month')) unit = 'MONTH';
  
  const numbers = salaryString.replace(/[^0-9\-]/g, ' ').split(/\s+/).filter(n => n.includes('-') || !isNaN(parseFloat(n)));
  let min, max;
  
  if (numbers.length > 0) {
    const firstNum = numbers[0];
    if (firstNum.includes('-')) {
      const range = firstNum.split('-').map(n => parseFloat(n));
      min = range[0];
      max = range[1];
    } else {
      min = parseFloat(firstNum);
      max = min;
    }
  }
  
  return { min, max, currency, unit };
}

function parseCompensation(reward: string): {
  amount?: number;
  currency: string;
} {
  if (!reward) return { currency: 'USD' };
  
  let currency = 'USD';
  if (reward.includes('€')) currency = 'EUR';
  else if (reward.includes('£')) currency = 'GBP';
  
  const match = reward.match(/\$?(\d+(?:\.\d+)?)/);
  const amount = match ? parseFloat(match[1]) : undefined;
  
  return { amount, currency };
}

// ========== SURVEY AGENTS ==========
async function extractSurveyData(description: string, websiteName: string): Promise<SurveyData> {
  console.log('🤖 Survey Agent 1: Extracting structured data...');
  
  try {
    const response = await axios.post(
      'https://api.mistral.ai/v1/chat/completions',
      {
        model: 'mistral-small-latest',
        messages: [
          {
            role: 'system',
            content: `You are an expert data extraction agent for HIGH-VALUE research surveys targeting SENIOR PROFESSIONALS. Extract structured data.
            Return a valid JSON object with these exact keys: title, reward, timeEstimate, category, eligibility, source, country_code, compensation_amount, compensation_currency.
            
            CRITICAL GUIDELINES:
            - title: Create a CONCISE, PROFESSIONAL, AND ATTRACTIVE title (max 10 words). Use language that resonates with experts.
            - category: Determine a SPECIFIC type (e.g., "User Interview", "Market Research", "Expert Panel", "Technical Survey").
            - reward: Extract the compensation amount (e.g., "$150 USD", "$50 gift card").
            - timeEstimate: Extract the time commitment (e.g., "60 minutes", "45-60 min").
            - eligibility: Array of CLEAN, professional requirement strings.
            - source: Infer from context ("respondent", "mercor", or "other").
            - country_code: Extract target country as ISO code (e.g., "US", "GB", "DE"). Default to "US".
            - compensation_amount: Extract numerical value from reward (e.g., 150 from "$150").
            - compensation_currency: Extract currency from reward (e.g., "USD", "EUR", "GBP").
            
            Return ONLY valid JSON, no other text.`,
          },
          {
            role: 'user',
            content: `Extract structured data from this survey description:\n\n${description}`,
          },
        ],
        max_tokens: 600,
        temperature: 0.1,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
        },
      }
    );

    const content = response.data.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) throw new Error('No JSON found in AI response');
    
    const extracted = JSON.parse(jsonMatch[0]);
    
    const compensation = parseCompensation(extracted.reward || '');
    
    return {
      type: 'survey',
      title: extracted.title || 'Professional Research Opportunity',
      description: '',
      opportunityType: 'survey',
      reward: extracted.reward || 'Varies',
      timeEstimate: extracted.timeEstimate || 'Not specified',
      category: extracted.category || 'Research',
      eligibility: Array.isArray(extracted.eligibility) ? extracted.eligibility : [],
      source: extracted.source || 'other',
      websiteName: websiteName,
      country_code: extracted.country_code || 'US',
      compensation_amount: extracted.compensation_amount || compensation.amount,
      compensation_currency: extracted.compensation_currency || compensation.currency,
    };
  } catch (error) {
    console.error('❌ Survey extraction error:', error);
    const compensation = parseCompensation('');
    return {
      type: 'survey',
      title: 'Professional Research Opportunity',
      description: '',
      opportunityType: 'survey',
      reward: 'Varies',
      timeEstimate: 'Not specified',
      category: 'Research',
      eligibility: [],
      source: 'other',
      websiteName: websiteName,
      country_code: 'US',
      compensation_amount: compensation.amount,
      compensation_currency: compensation.currency,
    };
  }
}

async function rewordSurveyDescription(description: string, extractedData: any): Promise<string> {
  console.log('📝 Survey Agent 2: Rewriting description...');
  
  try {
    const response = await axios.post(
      'https://api.mistral.ai/v1/chat/completions',
      {
        model: 'mistral-small-latest',
        messages: [
          {
            role: 'system',
            content: `You are a professional copywriter. Create a compelling survey description that will be displayed on a website.

CRITICAL FORMATTING RULES:
1. **FIRST SENTENCE MUST BE BOLD AND COMPELLING** - Start with a powerful, attention-grabbing sentence that highlights the value
2. **DO NOT use markdown formatting** - No asterisks (**), no markdown, just plain text
3. **Structure the description naturally** - After the first sentence, continue with a compelling description
4. **Focus on transformation and benefits** - Explain what participants will gain and why it's valuable

FORMAT EXAMPLE:
Unlock the Power of Your Expertise. Are you a seasoned professional with experience in this field? Your insights are invaluable for shaping the future of this industry. This confidential interview will explore your experiences and challenges while providing you with an opportunity to influence key decisions.

GUIDELINES:
- First sentence: Powerful, bold, and compelling (this will be styled as bold in CSS)
- Second sentence: Continue the thought, ask a rhetorical question
- Then: Explain the research objectives, methodology, and value
- Keep it professional but engaging
- Focus on the participant's benefit and the impact of their contribution
- Do not mention rewards or time estimates (those are separate fields)

Return ONLY the reworded description in plain text.`,
          },
          {
            role: 'user',
            content: `Create a compelling survey description for "${extractedData.title}". Start with a powerful first sentence that will be displayed in bold. Do not use any markdown formatting. Original description:\n\n${description}`,
          },
        ],
        max_tokens: 600,
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
        },
      }
    );

    let reworded = response.data.choices[0].message.content;
    reworded = cleanFirstSentence(reworded);
    validateRephrasing(description, reworded);
    return reworded;
  } catch (error) {
    console.error('❌ Survey reword error:', error);
    return description;
  }
}

// ========== JOB AGENTS ==========
async function extractJobData(description: string, websiteName: string): Promise<JobData> {
  console.log('🤖 Job Agent 1: Extracting job data...');
  
  try {
    const response = await axios.post(
      'https://api.mistral.ai/v1/chat/completions',
      {
        model: 'mistral-small-latest',
        messages: [
          {
            role: 'system',
            content: `You are an expert job data extraction agent. Extract structured data from job descriptions.
            Return a valid JSON object with these exact keys: title, company, location, hourlyRate, country_code, is_remote, is_worldwide, salary_min, salary_max, salary_currency, salary_unit.
            
            Guidelines:
            - title: Extract or create a professional job title
            - company: Extract company name (if not mentioned, use "Confidential" or "Leading Company")
            - location: Extract location (e.g., "Remote", "Remote (Global)", "New York, NY")
            - hourlyRate: Extract compensation (e.g., "$85-110/hour", "€75-95/hour")
            - country_code: Extract ISO country code from location (e.g., "US", "DE", "GB")
            - is_remote: Boolean, true if location contains "Remote" or similar
            - is_worldwide: Boolean, true if location contains "Global" or "Worldwide"
            - salary_min: Extract minimum value from hourlyRate (e.g., 85 from "$85-110/hour")
            - salary_max: Extract maximum value from hourlyRate (e.g., 110 from "$85-110/hour")
            - salary_currency: Extract currency (e.g., "USD", "EUR", "GBP")
            - salary_unit: Always "HOUR" for hourly rates
            
            For vettingScore and complianceStatus, use placeholders (0 and empty string) as they will be set by vetting agent.
            
            Return ONLY valid JSON, no other text.`,
          },
          {
            role: 'user',
            content: `Extract structured data from this job description:\n\n${description}`,
          },
        ],
        max_tokens: 800,
        temperature: 0.1,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
        },
      }
    );

    const content = response.data.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) throw new Error('No JSON found in AI response');
    
    const extracted = JSON.parse(jsonMatch[0]);
    
    const salary = parseSalary(extracted.hourlyRate || '');
    const countryCode = extractCountryCode(extracted.location || '');
    const isRemote = (extracted.location || '').toLowerCase().includes('remote');
    const isWorldwide = (extracted.location || '').toLowerCase().includes('global') || 
                       (extracted.location || '').toLowerCase().includes('worldwide');
    
    return {
      type: 'job',
      title: extracted.title || 'Remote Professional Position',
      description: '',
      opportunityType: 'job',
      company: extracted.company || 'Leading Company',
      location: extracted.location || 'Remote (Global)',
      hourlyRate: extracted.hourlyRate || '$80-120/hour',
      vettingScore: 0, // Placeholder - will be set by vetting agent
      complianceStatus: 'Pending vetting analysis', // Placeholder
      source: 'other',
      websiteName: websiteName,
      country_code: extracted.country_code || countryCode,
      is_remote: extracted.is_remote !== undefined ? extracted.is_remote : isRemote,
      is_worldwide: extracted.is_worldwide !== undefined ? extracted.is_worldwide : isWorldwide,
      salary_min: extracted.salary_min || salary.min,
      salary_max: extracted.salary_max || salary.max,
      salary_currency: extracted.salary_currency || salary.currency,
      salary_unit: extracted.salary_unit || salary.unit,
      company_website: undefined,
    };
  } catch (error) {
    console.error('❌ Job extraction error:', error);
    const salary = parseSalary('$80-120/hour');
    return {
      type: 'job',
      title: 'Remote Professional Position',
      description: '',
      opportunityType: 'job',
      company: 'Leading Company',
      location: 'Remote (Global)',
      hourlyRate: '$80-120/hour',
      vettingScore: 0, // Placeholder
      complianceStatus: 'Pending vetting analysis',
      source: 'other',
      websiteName: websiteName,
      country_code: 'US',
      is_remote: true,
      is_worldwide: false,
      salary_min: salary.min,
      salary_max: salary.max,
      salary_currency: salary.currency,
      salary_unit: salary.unit,
      company_website: undefined,
    };
  }
}

async function rewordJobDescription(description: string, extractedData: JobData): Promise<string> {
  console.log('📝 Job Agent 2: Rewriting job description...');
  
  try {
    const response = await axios.post(
      'https://api.mistral.ai/v1/chat/completions',
      {
        model: 'mistral-small-latest',
        messages: [
          {
            role: 'system',
            content: `You are a job description writer. Create a COMPREHENSIVE, NON-REPETITIVE job description with substantial textual transformation.

CRITICAL REQUIREMENTS:
• NEVER repeat the job title in the description
• NEVER copy more than 3 consecutive words from the original
• Include ALL information from the original description in a fluid structure
• Use **bold text** for section titles only (not for entire paragraphs)
• Create a cohesive structure without repeating information
• Include responsibilities, requirements, project details, and compensation in a clear format

MANDATORY STRUCTURE (with bold section titles in this order):
**Strategic Opportunity**
[Engaging opening about the role's strategic importance and impact - PARAGRAPH FORM]

**Core Responsibilities**
- [Key responsibility 1]
- [Key responsibility 2]
- [Key responsibility 3]
- [Key responsibility 4]
- [Key responsibility 5]

**Required Expertise**
- [Required skill/experience 1]
- [Required skill/experience 2]
- [Required skill/experience 3]
- [Required skill/experience 4]
- [Required skill/experience 5]

**Project & Compensation**
- [Project detail 1]
- [Project detail 2]
- [Compensation detail 1]
- [Compensation detail 2]

**Application Process**
[How to apply and next steps - PARAGRAPH FORM]

IMPORTANT: 
- Write Strategic Opportunity and Application Process in paragraph form
- Write Core Responsibilities, Required Expertise, and Project & Compensation in bullet points (with hyphens)
- Do not use asterisks (*) for formatting except for bold section titles
- Make it clear and professional
- All facts about role, company, compensation MUST remain accurate but rephrased
- Return ONLY the transformed description.`,
          },
          {
            role: 'user',
            content: `Create a comprehensive, non-repetitive description for a ${extractedData.title} role at ${extractedData.company}. Include all information from the original description in the specified structure. Original description:\n\n${description}`,
          },
        ],
        max_tokens: 1200,
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
        },
      }
    );

    const reworded = response.data.choices[0].message.content;
    validateRephrasing(description, reworded);
    return reworded;
  } catch (error) {
    console.error('❌ Job reword error:', error);
    return description;
  }
}

// ========== TOOL AGENTS ==========
async function extractToolData(description: string, websiteName: string): Promise<ToolData> {
  console.log('🤖 Tool Agent 1: Extracting tool data...');
  
  try {
    const response = await axios.post(
      'https://api.mistral.ai/v1/chat/completions',
      {
        model: 'mistral-small-latest',
        messages: [
          {
            role: 'system',
            content: `You are an expert digital tool analyzer. Extract structured data from tool descriptions.
            Return a valid JSON object with these exact keys: title, icon, iconColor, bgColor, toolDescription, link, application_category, operating_system, price, price_currency, rating_value, rating_count.
            
            Guidelines:
            - title: Create a compelling tool name/title
            - icon: Choose a relevant Material Icon name (e.g., "account_balance_wallet", "security", "receipt_long")
            - iconColor: Choose a Tailwind text color class (e.g., "text-primary", "text-secondary", "text-amber-500")
            - bgColor: Choose a matching Tailwind bg color class (e.g., "bg-primary/10", "bg-secondary/10")
            - toolDescription: Create a concise, benefit-focused description (max 2 sentences)
            - link: Use "#" as placeholder
            - application_category: Determine category (e.g., "BusinessApplication", "Productivity", "Finance", "Health")
            - operating_system: Usually "Web" for SaaS tools
            - price: Extract price if mentioned (e.g., 0 for free, 99 for paid)
            - price_currency: Usually "USD"
            - rating_value: Default to 4.8 if not mentioned
            - rating_count: Default to 24 if not mentioned
            
            Return ONLY valid JSON, no other text.`,
          },
          {
            role: 'user',
            content: `Extract structured data from this tool description:\n\n${description}`,
          },
        ],
        max_tokens: 600,
        temperature: 0.3,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
        },
      }
    );

    const content = response.data.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) throw new Error('No JSON found in AI response');
    
    const extracted = JSON.parse(jsonMatch[0]);
    
    const colorOptions = [
      { icon: 'text-primary', bg: 'bg-primary/10' },
      { icon: 'text-secondary', bg: 'bg-secondary/10' },
      { icon: 'text-amber-500', bg: 'bg-amber-500/10' },
      { icon: 'text-red-500', bg: 'bg-red-500/10' },
      { icon: 'text-green-500', bg: 'bg-green-500/10' },
      { icon: 'text-blue-500', bg: 'bg-blue-500/10' },
      { icon: 'text-purple-500', bg: 'bg-purple-500/10' },
    ];
    
    const randomColor = colorOptions[Math.floor(Math.random() * colorOptions.length)];
    
    return {
      type: 'tool',
      title: extracted.title || 'Professional Digital Tool',
      description: '',
      opportunityType: 'tool',
      icon: extracted.icon || 'settings',
      iconColor: extracted.iconColor || randomColor.icon,
      bgColor: extracted.bgColor || randomColor.bg,
      toolDescription: extracted.toolDescription || 'A valuable digital tool for professionals.',
      link: extracted.link || '#',
      source: 'other',
      websiteName: websiteName,
      application_category: extracted.application_category || 'BusinessApplication',
      operating_system: extracted.operating_system || 'Web',
      price: extracted.price !== undefined ? extracted.price : 0,
      price_currency: extracted.price_currency || 'USD',
      rating_value: extracted.rating_value !== undefined ? extracted.rating_value : 4.8,
      rating_count: extracted.rating_count !== undefined ? extracted.rating_count : 24,
    };
  } catch (error) {
    console.error('❌ Tool extraction error:', error);
    const randomColor = { icon: 'text-primary', bg: 'bg-primary/10' };
    return {
      type: 'tool',
      title: 'Professional Digital Tool',
      description: '',
      opportunityType: 'tool',
      icon: 'settings',
      iconColor: randomColor.icon,
      bgColor: randomColor.bg,
      toolDescription: 'A valuable digital tool for remote professionals and digital nomads.',
      link: '#',
      source: 'other',
      websiteName: websiteName,
      application_category: 'BusinessApplication',
      operating_system: 'Web',
      price: 0,
      price_currency: 'USD',
      rating_value: 4.8,
      rating_count: 24,
    };
  }
}

async function rewordToolDescription(description: string, extractedData: ToolData): Promise<string> {
  console.log('📝 Tool Agent 2: Rewriting tool description...');
  
  try {
    const response = await axios.post(
      'https://api.mistral.ai/v1/chat/completions',
      {
        model: 'mistral-small-latest',
        messages: [
          {
            role: 'system',
            content: `You are a marketing copywriter. Create a SIMPLE tool description with ONLY:
            1. One creative, compelling, and very concise paragraph (2-3 sentences max)
            2. 5-7 key selling points as bullet points (using hyphens, NO markdown)
            
            CRITICAL RULES:
            - NO section titles (no "Tool Overview", "Key Features", etc.)
            - NO markdown formatting (no asterisks **)
            - NO additional paragraphs after bullet points
            - Just one paragraph, then bullet points
            - Each bullet point: "Feature Name: Description"
            
            FORMAT EXAMPLE:
            Wise for Business is a multi-currency account designed specifically for freelancers, enabling them to invoice clients globally as a local and receive payments in multiple currencies with zero fees. It offers seamless integration with accounting tools and transparent pricing.
            
            - Multi-Currency Accounts: Get your own UK, Eurozone, Australian, New Zealand, and US bank details for free in minutes
            - Zero Fees on Receipts: Invoice clients in their currency and receive money without any fees
            - Seamless Xero Integration: Connect your Wise for Business account with Xero for streamlined financial management
            - Open API for Automation: Automate payments and workflows using Wise's open API
            - Competitive Exchange Rates: Benefit from the real exchange rate with low, transparent fees
            - BatchTransfer for Multiple Payments: Pay multiple invoices in one go
            
            Return ONLY the formatted description.`,
          },
          {
            role: 'user',
            content: `Create a simple tool description for "${extractedData.title}". One compelling paragraph followed by 5-7 key selling points as bullet points. NO section titles, NO markdown, NO extra paragraphs. Original description:\n\n${description}`,
          },
        ],
        max_tokens: 800,
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
        },
      }
    );

    const reworded = response.data.choices[0].message.content;
    validateRephrasing(description, reworded);
    return reworded;
  } catch (error) {
    console.error('❌ Tool reword error:', error);
    return description;
  }
}

// ========== MAIN API HANDLER ==========
export async function POST(request: NextRequest) {
  console.log('🚀 POST /api/opportunities/create called');
  
  try {
    const body = await request.json();
    
    console.log('📦 Request body received:', {
      opportunityType: body.opportunityType,
      websiteName: body.websiteName,
      hasDescription: !!body.originalDescription || !!body.description
    });
    
    const { 
      opportunityType = 'tool',
      originalDescription = body.description || '',
      referralLink = body.link || '#',
      websiteName,
      company, 
      location, 
      hourlyRate 
    } = body;

    // Validate required fields
    if (!originalDescription || !websiteName) {
      return NextResponse.json(
        { 
          error: 'Missing required fields',
          receivedFields: Object.keys(body),
          requiredFields: ['originalDescription (or description)', 'websiteName']
        },
        { status: 400 }
      );
    }

    let extractedData: SurveyData | JobData | ToolData;
    let rewordedDescription: string;
    let vettingResult: VettingResult | null = null;

    // Route to appropriate agents based on type
    if (opportunityType === 'survey') {
      extractedData = await extractSurveyData(originalDescription, websiteName);
      rewordedDescription = await rewordSurveyDescription(originalDescription, extractedData);
    } else if (opportunityType === 'job') {
      extractedData = await extractJobData(originalDescription, websiteName);
      
      // Override with form data if provided
      if (company) (extractedData as JobData).company = company;
      if (location) (extractedData as JobData).location = location;
      if (hourlyRate) (extractedData as JobData).hourlyRate = hourlyRate;

      // 🔥 NEW: RUN VETTING AGENT HERE 🔥
      vettingResult = await vetJobOpportunity(originalDescription, (extractedData as JobData));
      
      // Update job data with vetting results
      (extractedData as JobData).vettingScore = vettingResult.score;
      (extractedData as JobData).complianceStatus = vettingResult.complianceNote;

      rewordedDescription = await rewordJobDescription(originalDescription, extractedData);
    } else if (opportunityType === 'tool') {
      extractedData = await extractToolData(originalDescription, websiteName);
      rewordedDescription = await rewordToolDescription(originalDescription, extractedData);
    } else {
      return NextResponse.json(
        { error: 'Invalid opportunity type. Must be "survey", "job", or "tool"' },
        { status: 400 }
      );
    }

    // Generate unique slug
    const baseSlug = extractedData.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .slice(0, 50);
    
    let slug = baseSlug;
    let counter = 1;
    
    while (true) {
      const { data: existing } = await supabaseAdmin
        .from('opportunities')
        .select('id')
        .eq('page_slug', slug)
        .maybeSingle();

      if (!existing) break;
      
      slug = `${baseSlug}-${counter}`;
      counter++;
      if (counter > 10) {
        slug = `${baseSlug}-${Date.now()}`;
        break;
      }
    }

    // Prepare database insertion
    const dbData: any = {
      type: extractedData.type,
      title: extractedData.title,
      description: rewordedDescription,
      original_description: originalDescription,
      source: extractedData.source,
      referral_link: referralLink,
      website_name: websiteName,
      page_slug: slug,
      reworded_by_ai: true,
      opportunity_type: opportunityType,
    };

    // Handle page_generated based on vetting for jobs
    if (opportunityType === 'job' && vettingResult) {
      dbData.page_generated = vettingResult.status === 'APPROVED';
      console.log(`📊 Job vetting status: ${vettingResult.status}, page_generated: ${dbData.page_generated}`);
    } else {
      dbData.page_generated = true; // Default for surveys and tools
    }

    // Add type-specific fields
    if (opportunityType === 'survey') {
      const surveyData = extractedData as SurveyData;
      dbData.reward = surveyData.reward;
      dbData.time_estimate = surveyData.timeEstimate;
      dbData.category = surveyData.category;
      dbData.eligibility = surveyData.eligibility;
      dbData.country_code = surveyData.country_code || 'US';
      dbData.compensation_amount = surveyData.compensation_amount;
      dbData.compensation_currency = surveyData.compensation_currency || 'USD';
    } else if (opportunityType === 'job') {
      const jobData = extractedData as JobData;
      dbData.company = jobData.company;
      dbData.location = jobData.location;
      dbData.hourly_rate = jobData.hourlyRate;
      dbData.vetting_score = jobData.vettingScore;
      dbData.compliance_status = jobData.complianceStatus;
      dbData.country_code = jobData.country_code || 'US';
      dbData.is_remote = jobData.is_remote !== undefined ? jobData.is_remote : jobData.location?.toLowerCase().includes('remote');
      dbData.is_worldwide = jobData.is_worldwide !== undefined ? jobData.is_worldwide : jobData.location?.toLowerCase().includes('global') || jobData.location?.toLowerCase().includes('worldwide');
      dbData.salary_min = jobData.salary_min;
      dbData.salary_max = jobData.salary_max;
      dbData.salary_currency = jobData.salary_currency || 'USD';
      dbData.salary_unit = jobData.salary_unit || 'HOUR';
      dbData.company_website = jobData.company_website;
    } else if (opportunityType === 'tool') {
      const toolData = extractedData as ToolData;
      dbData.icon = toolData.icon;
      dbData.icon_color = toolData.iconColor;
      dbData.bg_color = toolData.bgColor;
      dbData.tool_description = toolData.toolDescription;
      dbData.application_category = toolData.application_category || 'BusinessApplication';
      dbData.operating_system = toolData.operating_system || 'Web';
      dbData.price = toolData.price !== undefined ? toolData.price : 0;
      dbData.price_currency = toolData.price_currency || 'USD';
      dbData.rating_value = toolData.rating_value;
      dbData.rating_count = toolData.rating_count;
    }

    console.log('💾 Saving to database:', {
      type: opportunityType,
      title: extractedData.title,
      vettingScore: opportunityType === 'job' ? (extractedData as JobData).vettingScore : 'N/A',
      structuredFields: opportunityType === 'job' ? {
        country_code: dbData.country_code,
        is_remote: dbData.is_remote,
        salary_range: `${dbData.salary_min}-${dbData.salary_max} ${dbData.salary_currency}`
      } : undefined
    });

    // Save to database
    const { data: savedOpp, error: dbError } = await supabaseAdmin
      .from('opportunities')
      .insert([dbData])
      .select()
      .single();

    if (dbError) {
      console.error('❌ Database error:', dbError);
      throw new Error(`Database error: ${dbError.message}`);
    }

    console.log(`✅ Created ${opportunityType} with ID:`, savedOpp?.id);

    // Revalidate paths immediately after creation
    try {
      revalidatePath('/');
      console.log('✅ Immediately revalidated path: /');
      
      if (opportunityType === 'job') {
        revalidatePath('/jobs');
        console.log('✅ Immediately revalidated path: /jobs');
      } else if (opportunityType === 'survey') {
        revalidatePath('/research');
        console.log('✅ Immediately revalidated path: /research');
      } else if (opportunityType === 'tool') {
        revalidatePath('/tools');
        console.log('✅ Immediately revalidated path: /tools');
      }
      
      console.log('✅ All paths immediately revalidated after creation');
    } catch (revalidateError) {
      console.warn('⚠️ Could not revalidate paths immediately:', revalidateError);
    }

    // Determine redirect URL for the admin
    let redirectUrl = '';
    if (opportunityType === 'survey') redirectUrl = `/research/${slug}`;
    else if (opportunityType === 'job') redirectUrl = `/jobs/${slug}`;
    else redirectUrl = `/tools/${slug}`;

    return NextResponse.json({
      success: true,
      opportunityId: savedOpp?.id,
      slug: slug,
      title: extractedData.title,
      type: opportunityType,
      redirectUrl: redirectUrl,
      vettingResult: vettingResult ? {
        score: vettingResult.score,
        status: vettingResult.status,
        flags: vettingResult.flags,
        published: dbData.page_generated
      } : undefined,
      message: `${opportunityType.charAt(0).toUpperCase() + opportunityType.slice(1)} created successfully with vetting agent!`,
    });
  } catch (error: any) {
    console.error('💥 Error creating opportunity:', error.message);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to create opportunity',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// ========== GET HANDLER FOR TESTING ==========
export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Opportunities API with Vetting Agent is running',
    endpoint: '/api/opportunities/create',
    methods: ['POST'],
    description: 'Create new opportunities with AI processing, structured data extraction, and real vetting engine',
    vettingFeatures: {
      step1: 'Manual verification of real companies',
      step2: 'Automatic senior pay verification ($80+/hr)',
      step3: 'Scam-proof keyword and context screening',
      step4: 'Deliverable clarity assessment',
      scoring: '0-100 based on all 4 steps'
    },
    structuredFields: {
      job: ['country_code', 'is_remote', 'is_worldwide', 'salary_min', 'salary_max', 'salary_currency', 'salary_unit', 'company_website'],
      survey: ['country_code', 'compensation_amount', 'compensation_currency'],
      tool: ['application_category', 'operating_system', 'price', 'price_currency', 'rating_value', 'rating_count']
    }
  });
}