import { useState } from 'react';
import { Link2, X, Check } from 'lucide-react';
import { useLeads } from '../context/LeadContext.jsx';

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

export default function EditLeadModal({ lead, onClose }) {
  const { editLead } = useLeads();
  const [form, setForm] = useState({
    name: lead.name || '',
    role: lead.role || '',
    company: lead.company || '',
    industry: lead.industry || '',
    linkedinUrl: lead.linkedinUrl || '',
    profileSummary: lead.profileSummary || '',
    notes: lead.notes || '',
    status: lead.status || 'invite_sent',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  // Custom industry: true if the existing value isn't in our predefined list
  const [customIndustry, setCustomIndustry] = useState(
    !!lead.industry && !INDUSTRIES.includes(lead.industry)
  );

  const set = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await editLead(lead._id, form);
      setSaved(true);
      setTimeout(() => onClose(), 700);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save changes');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#111] border border-white/10 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white text-black text-sm font-bold flex items-center justify-center shrink-0">
              {lead.name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Edit Profile</h2>
              <p className="text-xs text-[#555]">{lead.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#555] hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* LinkedIn URL highlight box */}
        <div className="bg-black border border-white/10 rounded-xl p-4 mb-5">
          <div className="flex items-center gap-1.5 text-xs text-[#888] mb-2 font-medium">
            <Link2 className="w-3.5 h-3.5" /> LinkedIn Profile URL
          </div>
          <input
            name="linkedinUrl"
            value={form.linkedinUrl}
            onChange={set}
            placeholder="https://linkedin.com/in/username"
            className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-[#555] focus:outline-none focus:border-white/30 text-sm transition-all"
          />
          {form.linkedinUrl && (
            <a
              href={form.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 mt-2 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Preview link
            </a>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg px-4 py-3 text-sm mb-5">
            {error}
          </div>
        )}

        {/* Form */}
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
            <div className="md:col-span-2">
              <label className={labelCls}>Profile Summary</label>
              <textarea
                name="profileSummary"
                value={form.profileSummary}
                onChange={set}
                placeholder="Notes from their LinkedIn profile..."
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
              disabled={loading || saved}
              className={`rounded-lg px-5 py-2 text-sm font-semibold transition-all disabled:opacity-70 flex items-center gap-2
                ${saved
                  ? 'bg-green-500 text-white'
                  : 'bg-white text-black hover:bg-gray-100'
                }`}
            >
              {saved ? (
                <>
                <Check className="w-4 h-4" />
                Saved!
              </>
              ) : loading ? (
                <>
                  <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
