// app/admin/add-opportunity/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type OpportunityType = 'survey' | 'job' | 'tool';

export default function AddOpportunityPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    opportunityType: 'survey' as OpportunityType,
    originalDescription: '',
    referralLink: '',
    websiteName: '', // New field
    company: '',
    location: '',
    hourlyRate: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    // Validate website name
    if (!formData.websiteName.trim()) {
      setError('Website Name is required');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/opportunities/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create opportunity');
      }

      setSuccess(true);
      
      // Reset form
      setFormData({
        opportunityType: 'survey',
        originalDescription: '',
        referralLink: '',
        websiteName: '',
        company: '',
        location: '',
        hourlyRate: '',
      });

      // Redirect based on type
      setTimeout(() => {
        if (formData.opportunityType === 'survey') {
          router.push(`/research/${data.slug}`);
        } else if (formData.opportunityType === 'job') {
          router.push(`/jobs/${data.slug}`);
        } else {
          router.push(`/tools/${data.slug}`);
        }
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="py-12 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
      <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-lg p-6 sm:p-10 border border-border-light dark:border-border-dark">
        <h1 className="text-3xl font-bold text-text-light dark:text-white mb-2">
          Add New Opportunity
        </h1>
        <p className="text-text-muted-light dark:text-text-muted-dark mb-8">
          Paste the description and our AI will create a professional page automatically.
        </p>

        {success && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            ✓ Opportunity created! AI is processing and creating the page...
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            ✗ Error: {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Type Selector */}
          <div>
            <label className="block text-sm font-semibold text-text-light dark:text-white mb-2">
              Opportunity Type *
            </label>
            <select
              name="opportunityType"
              value={formData.opportunityType}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-card-dark text-text-light dark:text-white"
              required
            >
              <option value="survey">📊 Research Survey</option>
              <option value="job">💼 Remote Job</option>
              <option value="tool">🛠️ Digital Tool</option>
            </select>
          </div>

          {/* Website Name Field (for all types) */}
          <div>
            <label className="block text-sm font-semibold text-text-light dark:text-white mb-2">
              Website Name *
            </label>
            <input
              type="text"
              name="websiteName"
              value={formData.websiteName}
              onChange={handleChange}
              placeholder={
                formData.opportunityType === 'survey' 
                  ? "e.g., Respondent.io, UserInterviews.com, etc."
                  : formData.opportunityType === 'job'
                  ? "e.g., Mercor.com, Draftboard.com, etc."
                  : "e.g., ToolName.com, ServicePlatform.com, etc."
              }
              className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-card-dark text-text-light dark:text-white"
              required
            />
            <p className="text-xs text-text-muted-light dark:text-text-muted-dark mt-1">
              This will appear in the disclaimer text on the page
            </p>
          </div>

          {/* Conditional Fields for Jobs */}
          {formData.opportunityType === 'job' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-text-light dark:text-white mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="e.g., Draftboard, Stripe, etc."
                  className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-card-dark text-text-light dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-light dark:text-white mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., Remote (Global)"
                  className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-card-dark text-text-light dark:text-white"
                />
              </div>
            </div>
          )}

          {/* Original Description */}
          <div>
            <label className="block text-sm font-semibold text-text-light dark:text-white mb-2">
              {formData.opportunityType === 'survey' && 'Full Description (Copy-Paste everything) *'}
              {formData.opportunityType === 'job' && 'Job Description (Copy-Paste everything) *'}
              {formData.opportunityType === 'tool' && 'Tool Description (Copy-Paste everything) *'}
            </label>
            <textarea
              name="originalDescription"
              value={formData.originalDescription}
              onChange={handleChange}
              placeholder={
                formData.opportunityType === 'survey' 
                  ? "Paste the complete survey/job description including title, reward, time estimate, requirements, etc..."
                  : formData.opportunityType === 'job'
                  ? "Paste the complete job description including responsibilities, requirements, compensation, etc..."
                  : "Paste the complete tool description including features, benefits, pricing, etc..."
              }
              rows={10}
              className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-card-dark text-text-light dark:text-white placeholder-text-muted-light dark:placeholder-text-muted-dark font-mono text-sm"
              required
            />
            <p className="text-xs text-text-muted-light dark:text-text-muted-dark mt-1">
              AI will extract and structure all relevant details
            </p>
          </div>

          {/* Referral Link */}
          <div>
            <label className="block text-sm font-semibold text-text-light dark:text-white mb-2">
              Referral Link *
            </label>
            <input
              type="url"
              name="referralLink"
              value={formData.referralLink}
              onChange={handleChange}
              placeholder={
                formData.opportunityType === 'survey' 
                  ? "https://respondent.io/survey?ref=YOUR_CODE"
                  : formData.opportunityType === 'job'
                  ? "https://company.com/careers?ref=YOUR_CODE"
                  : "https://tool.com?ref=YOUR_CODE"
              }
              className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-card-dark text-text-light dark:text-white placeholder-text-muted-light dark:placeholder-text-muted-dark"
              required
            />
            <p className="text-xs text-text-muted-light dark:text-text-muted-dark mt-1">
              Include your affiliate/referral code in the URL
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-white bg-secondary hover:bg-secondary/90 transition disabled:bg-gray-400"
          >
            {loading ? 'AI Processing...' : 'Create Opportunity & Generate Page'}
          </button>
        </form>

        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            <strong>How it works:</strong>
            <br/>
            1. Select the opportunity type
            <br/>
            2. Add the Website Name (appears in disclaimer)
            <br/>
            3. Paste the complete description
            <br/>
            4. Add your referral link
            <br/>
            5. AI extracts details and rewrites professionally
            <br/>
            6. Page is automatically created with proper disclaimers
            <br/>
            7. Live on your site within seconds!
          </p>
        </div>
      </div>
    </main>
  );
}