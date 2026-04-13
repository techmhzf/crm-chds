import { useState, useEffect } from 'react';
import { LayoutTemplate, X, Check, Copy } from 'lucide-react';
import { DEFAULT_TEMPLATES, INDUSTRY_LABELS, TONE_COLORS, fillTemplate } from '../data/templates.js';
import { getEffectiveTemplatesForIndustry } from '../utils/templateStore.js';

export default function MessageTemplateModal({ lead, onClose }) {
  const [templates, setTemplates] = useState([]);
  const [selected, setSelected] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const industry = lead?.industry || 'general';
    const list = getEffectiveTemplatesForIndustry(DEFAULT_TEMPLATES, industry);
    setTemplates(list);
  }, [lead]);

  const preview = selected ? fillTemplate(selected.body, lead) : null;
  const industryLabel = INDUSTRY_LABELS[lead?.industry] || 'General';

  const handleCopy = () => {
    if (!preview) return;
    navigator.clipboard.writeText(preview);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-2xl flex flex-col" style={{ maxHeight: '88vh' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-white">Send Message</h2>
            <p className="text-[#888] text-xs mt-0.5">
              {lead?.name} · {industryLabel} · {templates.length} templates
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#555] hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">

          {/* Template list */}
          <div className="w-52 border-r border-white/10 overflow-y-auto p-2 shrink-0">
            <p className="text-[#555] text-[10px] uppercase tracking-widest px-2 mb-2 pt-1">Choose Template</p>
            {templates.map((t) => (
              <button
                key={t.id}
                onClick={() => { setSelected(t); setCopied(false); }}
                className={`w-full text-left px-3 py-2.5 rounded-lg mb-1 transition-all border ${
                  selected?.id === t.id
                    ? 'bg-white/10 border-white/20'
                    : 'hover:bg-white/5 border-transparent'
                }`}
              >
                <p className={`text-xs font-medium leading-snug ${selected?.id === t.id ? 'text-white' : 'text-[#888]'}`}>
                  {t.label}
                </p>
                <span className={`text-[9px] font-semibold border px-1.5 py-0.5 rounded-full mt-1 inline-block ${TONE_COLORS[t.tone] || TONE_COLORS.Custom}`}>
                  {t.tone}
                </span>
                {t.isCustom && (
                  <span className="text-[9px] text-purple-400 ml-1">MY</span>
                )}
              </button>
            ))}
          </div>

          {/* Preview */}
          <div className="flex-1 overflow-y-auto p-5 flex flex-col">
            {!selected ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <LayoutTemplate className="w-12 h-12 text-[#333] mb-3" />
                <p className="text-[#888] text-sm">Select a template to preview</p>
                <p className="text-[#555] text-xs mt-1">
                  Variables like <code className="bg-white/5 px-1 rounded">{'{name}'}</code> are auto-filled
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-semibold text-white">{selected.label}</span>
                  <span className={`text-[9px] font-semibold border px-2 py-0.5 rounded-full ${TONE_COLORS[selected.tone] || TONE_COLORS.Custom}`}>
                    {selected.tone}
                  </span>
                </div>

                <div className="bg-black border border-white/10 rounded-lg p-4 text-xs text-[#ccc] leading-relaxed whitespace-pre-wrap flex-1 font-mono overflow-y-auto">
                  {preview}
                </div>

                <button
                  onClick={handleCopy}
                  className={`w-full mt-4 rounded-lg px-4 py-3 text-sm font-semibold transition-all ${
                    copied
                      ? 'bg-green-500/20 border border-green-500/30 text-green-400'
                      : 'bg-white text-black hover:bg-gray-100'
                  }`}
                >
                  {copied ? (
                    <><Check className="w-4 h-4" /> Copied! Paste in LinkedIn DMs</>
                  ) : (
                    <><Copy className="w-4 h-4" /> Copy Message</>
                  )}
                </button>

                <p className="text-[#555] text-[10px] text-center mt-2">
                  Edit or create templates from the <span className="text-white">Templates</span> page
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
