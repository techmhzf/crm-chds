import { useState } from 'react';
import { Sparkles, RefreshCw, X, Check, Copy } from 'lucide-react';
import { generateMessage } from '../services/messageService.js';

export default function AIMessageGenerator({ lead, onClose }) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setError('');
    setLoading(true);
    try {
      const { data } = await generateMessage({
        name: lead.name,
        role: lead.role,
        company: lead.company,
        industry: lead.industry,
        profileSummary: lead.profileSummary,
      });
      setMessage(data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate message');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#111] border border-white/10 rounded-2xl p-6 w-full max-w-lg">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-semibold text-white">AI Message Generator</h2>
            <p className="text-[#888] text-xs mt-0.5">Hinglish LinkedIn outreach</p>
          </div>
          <button
            onClick={onClose}
            className="text-[#555] hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-black border border-white/10 rounded-lg p-3 mb-4">
          <p className="text-sm text-white font-medium">{lead.name}</p>
          {lead.role && <p className="text-xs text-[#888] mt-0.5">{lead.role}{lead.company ? ` · ${lead.company}` : ''}</p>}
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg px-4 py-3 text-sm mb-4">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-black border border-white/10 rounded-lg p-4 text-sm text-[#ccc] leading-relaxed font-mono whitespace-pre-wrap mb-4">
            {message}
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-white text-black font-semibold hover:bg-gray-100 rounded-lg px-4 py-3 text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 rounded-full border-2 border-black border-t-transparent animate-spin" />
              Generating...
            </>
          ) : message ? (
            <><RefreshCw className="w-4 h-4" /> Regenerate</>
          ) : (
            <><Sparkles className="w-4 h-4" /> Generate Message</>
          )}
        </button>

        {message && (
          <button
            onClick={handleCopy}
            className={`w-full mt-2 bg-transparent border rounded-lg px-4 py-2 text-sm transition-all ${
              copied
                ? 'border-green-500/30 text-green-400'
                : 'border-white/20 text-white hover:bg-white/5'
            }`}
          >
            {copied ? (
              <><Check className="w-4 h-4" /> Copied!</>
            ) : (
              <><Copy className="w-4 h-4" /> Copy to clipboard</>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
