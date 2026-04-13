import { useState } from 'react';
import { Link2, X, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useLeads } from '../context/LeadContext.jsx';
import { scrapeProfile } from '../services/scrapeService.js';

const INDUSTRIES = ['general', 'sales', 'travel', 'tech', 'design', 'real_estate', 'finance', 'marketing', 'other'];
const INDUSTRY_LABELS = {
  general: 'General', sales: 'Sales', travel: 'Travel', tech: 'Tech',
  design: 'Design', real_estate: 'Real Estate', finance: 'Finance',
  marketing: 'Marketing', other: 'Other',
};
const STATUSES = [
  { value: 'invite_sent', label: 'Invite Sent' },
  { value: 'connected', label: 'Connected' },
  { value: 'message_sent', label: 'Message Sent' },
  { value: 'replied', label: 'Replied' },
  { value: 'follow_up', label: 'Follow Up' },
  { value: 'potential_client', label: 'Potential Client' },
  { value: 'not_interested', label: 'Not Interested' },
];

const inputCls =
  'w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white placeholder-[#555] focus:outline-none focus:border-white/30 text-sm transition-all';
const labelCls = 'block text-xs text-[#888] mb-2';

export default function AddLeadModal({ onClose }) {
  const { addLead } = useLeads();
  const [form, setForm] = useState({
    name: '', role: '', company: '', industry: '',
    linkedinUrl: '', profileSummary: '', notes: '', status: 'invite_sent',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // URL auto-fill state
  const [urlInput, setUrlInput] = useState('');
  const [scraping, setScraping] = useState(false);
  const [scrapeStatus, setScrapeStatus] = useState(null); // 'success' | 'partial' | 'error'
  const [scrapeMsg, setScrapeMsg] = useState('');

  const set = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  // Custom industry
  const [customIndustry, setCustomIndustry] = useState(false);

  const handleAutoFill = async () => {
    const url = urlInput.trim();
    if (!url || !url.includes('linkedin.com/in/')) {
      setScrapeStatus('error');
      setScrapeMsg('Please paste a valid LinkedIn profile URL (linkedin.com/in/...)');
      return;
    }
    setScraping(true);
    setScrapeStatus(null);
    setScrapeMsg('');
    try {
      const { data } = await scrapeProfile(url);
      setForm((prev) => ({
        ...prev,
        name: data.name || prev.name,
        role: data.role || prev.role,
        company: data.company || prev.company,
        linkedinUrl: data.linkedinUrl || url,
      }));
      if (data.scraped) {
        setScrapeStatus('success');
        setScrapeMsg('Profile auto-filled — review and save');
      } else {
        setScrapeStatus('partial');
        setScrapeMsg('LinkedIn blocked full scrape — URL and name filled, please complete manually');
      }
    } catch {
      setScrapeStatus('error');
      setScrapeMsg('Invalid URL or connection error');
    } finally {
      setScraping(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await addLead(form);
      onClose();
    } catch (err) {
      const status = err.response?.status;
      const data   = err.response?.data;
      if (status === 409 && data?.existing) {
        setError(`Already in your pipeline as "${data.existing.name}" — no duplicate created.`);
      } else {
        setError(data?.message || 'Failed to add lead');
      }
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#111] border border-white/10 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-white">Add New Lead</h2>
          <button
            onClick={onClose}
            className="text-[#555] hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── URL Auto-fill Section ─────────────────────── */}
        <div className="bg-black border border-white/10 rounded-xl p-4 mb-2">
          <div className="flex items-center gap-1.5 text-xs text-[#888] mb-3 font-medium">
            <Link2 className="w-3.5 h-3.5" /> Paste a LinkedIn URL to auto-fill the form
          </div>
          <div className="flex gap-2">
            <input
              value={urlInput}
              onChange={(e) => { setUrlInput(e.target.value); setScrapeStatus(null); }}
              onKeyDown={(e) => e.key === 'Enter' && handleAutoFill()}
              placeholder="https://www.linkedin.com/in/username"
              className="flex-1 bg-[#111] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-[#555] focus:outline-none focus:border-white/30 text-sm transition-all"
            />
            <button
              onClick={handleAutoFill}
              disabled={scraping || !urlInput.trim()}
              className="bg-white text-black font-semibold hover:bg-gray-100 rounded-lg px-4 py-2.5 text-sm transition-all disabled:opacity-40 flex items-center gap-2 shrink-0"
            >
              {scraping ? (
                <>
                  <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Filling...
                </>
              ) : 'Auto-fill'}
            </button>
          </div>

          {/* Feedback banner */}
          {scrapeStatus === 'success' && (
            <p className="text-green-400 text-xs mt-2.5 flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 shrink-0" />{scrapeMsg}</p>
          )}
          {scrapeStatus === 'partial' && (
            <p className="text-amber-400 text-xs mt-2.5 flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5 shrink-0" />{scrapeMsg}</p>
          )}
          {scrapeStatus === 'error' && (
            <p className="text-red-400 text-xs mt-2.5 flex items-center gap-1.5"><XCircle className="w-3.5 h-3.5 shrink-0" />{scrapeMsg}</p>
          )}
        </div>

        {/* Divider */}
        <div className="relative flex items-center my-5">
          <div className="flex-1 border-t border-white/10" />
          <span className="mx-3 text-[#555] text-xs">or fill manually</span>
          <div className="flex-1 border-t border-white/10" />
        </div>

        {/* ── Manual Form ───────────────────────────────── */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg px-4 py-3 text-sm mb-5">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Full Name *</label>
              <input name="name" value={form.name} onChange={set} required placeholder="John Doe" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Job Title</label>
              <input name="role" value={form.role} onChange={set} placeholder="Sales Manager" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Company</label>
              <input name="company" value={form.company} onChange={set} placeholder="Acme Corp" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Industry</label>
              <select
                value={customIndustry ? '__custom__' : form.industry}
                onChange={(e) => {
                  if (e.target.value === '__custom__') {
                    setCustomIndustry(true);
                    setForm((p) => ({ ...p, industry: '' }));
                  } else {
                    setCustomIndustry(false);
                    setForm((p) => ({ ...p, industry: e.target.value }));
                  }
                }}
                className={inputCls + ' bg-black'}
              >
                <option value="__custom__">✎ Write your own...</option>
                <option value="" disabled>── Categories ──</option>
                {INDUSTRIES.map((i) => (
                  <option key={i} value={i}>{INDUSTRY_LABELS[i]}</option>
                ))}
              </select>
              {customIndustry && (
                <input
                  name="industry"
                  value={form.industry}
                  onChange={set}
                  placeholder="e.g. Healthcare, Education, Logistics..."
                  autoFocus
                  className={inputCls + ' mt-2'}
                />
              )}
            </div>
            <div>
              <label className={labelCls}>Status</label>
              <select name="status" value={form.status} onChange={set} className={inputCls + ' bg-black'}>
                {STATUSES.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>LinkedIn URL</label>
              <input
                name="linkedinUrl"
                value={form.linkedinUrl}
                onChange={set}
                placeholder="https://linkedin.com/in/..."
                className={inputCls}
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelCls}>Profile Summary</label>
              <textarea
                name="profileSummary"
                value={form.profileSummary}
                onChange={set}
                placeholder="Paste notes from their LinkedIn profile..."
                rows={3}
                className={inputCls + ' resize-none'}
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelCls}>Personal Notes</label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={set}
                placeholder="Any personal notes about this lead..."
                rows={2}
                className={inputCls + ' resize-none'}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="bg-transparent border border-white/20 text-white hover:bg-white/5 rounded-lg px-4 py-2 text-sm transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-white text-black font-semibold hover:bg-gray-100 rounded-lg px-4 py-2 text-sm transition-all disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
