import { useState, useEffect, useCallback } from 'react';
import { LayoutTemplate, Pencil, Trash2, ArrowLeft, RotateCcw, Check, Copy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  DEFAULT_TEMPLATES, INDUSTRIES, INDUSTRY_LABELS, INDUSTRY_ICONS, TONE_COLORS, fillTemplate,
} from '../data/templates.js';
import {
  getAllEffectiveTemplates, saveOverride, resetOverride,
  addCustomTemplate, updateCustomTemplate, deleteCustomTemplate,
} from '../utils/templateStore.js';
import Navbar from '../components/Navbar.jsx';

const SAMPLE = { name: 'Aditya Sharma', company: 'TechCorp', role: 'Sales Head' };
const TONES = ['Friendly', 'Casual', 'Professional', 'Custom'];

const EMPTY_FORM = { label: '', industry: 'general', tone: 'Custom', body: '' };

export default function Templates() {
  const navigate = useNavigate();
  const [activeIndustry, setActiveIndustry] = useState('general');
  const [templates, setTemplates] = useState([]);
  const [selected, setSelected] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editBody, setEditBody] = useState('');
  const [copied, setCopied] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newForm, setNewForm] = useState(EMPTY_FORM);
  const [saved, setSaved] = useState(false);

  const refresh = useCallback(() => {
    setTemplates(getAllEffectiveTemplates(DEFAULT_TEMPLATES));
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const all = templates.length > 0 ? templates : getAllEffectiveTemplates(DEFAULT_TEMPLATES);
  const industryTemplates = all.filter(
    (t) => t.industry === activeIndustry || (activeIndustry === 'all')
  );
  const totalCount = all.length;

  const handleSelect = (t) => {
    setSelected(t);
    setEditMode(false);
    setEditBody(t.body);
    setCopied(false);
    setSaved(false);
    setShowAddForm(false);
  };

  const handleEdit = () => {
    setEditBody(selected.body);
    setEditMode(true);
    setSaved(false);
  };

  const handleSave = () => {
    if (!selected) return;
    if (selected.isCustom) {
      updateCustomTemplate(selected.id, { body: editBody, label: selected.label });
    } else {
      saveOverride(selected.id, editBody);
    }
    refresh();
    setSaved(true);
    setEditMode(false);
    setSelected((prev) => ({ ...prev, body: editBody }));
  };

  const handleReset = () => {
    if (!selected || selected.isCustom) return;
    resetOverride(selected.id);
    refresh();
    const orig = DEFAULT_TEMPLATES.find((t) => t.id === selected.id);
    if (orig) {
      setSelected({ ...orig, isOverridden: false });
      setEditBody(orig.body);
    }
    setSaved(false);
    setEditMode(false);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this custom template?')) return;
    deleteCustomTemplate(id);
    setSelected(null);
    setEditMode(false);
    refresh();
  };

  const handleAddSubmit = () => {
    if (!newForm.label.trim() || !newForm.body.trim()) return;
    addCustomTemplate(newForm);
    refresh();
    setNewForm(EMPTY_FORM);
    setShowAddForm(false);
  };

  const handleCopy = () => {
    const text = editMode ? editBody : (selected?.body || '');
    navigator.clipboard.writeText(fillTemplate(text, SAMPLE));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const previewText = editMode ? fillTemplate(editBody, SAMPLE) : (selected ? fillTemplate(selected.body, SAMPLE) : '');

  const countForIndustry = (ind) => all.filter((t) => t.industry === ind).length;

  return (
    <div className="bg-black min-h-screen">
      <Navbar />

      {/* Page header */}
      <div className="max-w-7xl mx-auto px-6 pt-6 pb-4 border-b border-white/5">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <button onClick={() => navigate('/dashboard')} className="flex items-center gap-1 text-[#666] hover:text-white text-xs md:text-sm transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
              </button>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white">Templates</h1>
            <p className="text-[#888] text-xs md:text-sm mt-0.5 hidden sm:block">
              {totalCount} templates — edit existing or create your own
            </p>
          </div>
          <button
            onClick={() => { setShowAddForm(true); setSelected(null); setEditMode(false); }}
            className="bg-white text-black font-semibold hover:bg-gray-100 rounded-lg px-3 py-2 md:px-4 md:py-2.5 text-xs md:text-sm transition-all whitespace-nowrap"
          >
            + New Template
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row h-auto md:h-[calc(100vh-140px)]">

        {/* LEFT SIDEBAR — industry + list */}
        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/10 flex flex-col shrink-0 h-[45vh] md:h-full">

          {/* Industry tabs */}
          <div className="p-3 border-b border-white/10 flex md:flex-col overflow-x-auto md:overflow-y-auto shrink-0 hide-scrollbar gap-2 md:gap-0">
            {INDUSTRIES.map((ind) => {
              const IndustryIcon = INDUSTRY_ICONS[ind];
              return (
                <button
                  key={ind}
                  onClick={() => { setActiveIndustry(ind); setSelected(null); setEditMode(false); setShowAddForm(false); }}
                  className={`flex-none md:w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all md:mb-0.5 ${
                    activeIndustry === ind
                      ? 'bg-white text-black font-semibold'
                      : 'text-[#888] hover:bg-white/5 hover:text-white bg-[#111] md:bg-transparent'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <IndustryIcon className="w-4 h-4" />
                    {INDUSTRY_LABELS[ind]}
                  </span>
                  <span className={`text-xs font-medium ml-2 ${activeIndustry === ind ? 'text-black/50' : 'text-[#555]'}`}>
                    {countForIndustry(ind)}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Template list for selected industry */}
          <div className="flex-1 overflow-y-auto p-3">
            {industryTemplates.length === 0 ? (
              <p className="text-[#555] text-xs text-center py-8">No templates</p>
            ) : (
              industryTemplates.map((t) => (
                <div
                  key={t.id}
                  onClick={() => handleSelect(t)}
                  className={`px-3 py-2.5 rounded-lg mb-1 cursor-pointer transition-all border ${
                    selected?.id === t.id
                      ? 'bg-white/10 border-white/25'
                      : 'hover:bg-white/5 border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <p className={`text-xs font-medium flex-1 leading-snug ${selected?.id === t.id ? 'text-white' : 'text-[#888]'}`}>
                      {t.label}
                    </p>
                    {t.isCustom && (
                      <span className="text-[9px] font-bold text-purple-400 bg-purple-500/10 border border-purple-500/30 px-1.5 py-0.5 rounded-full shrink-0">MY</span>
                    )}
                    {t.isOverridden && !t.isCustom && (
                      <span className="text-[9px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.5 rounded-full shrink-0">EDITED</span>
                    )}
                  </div>
                  <span className={`text-[9px] font-semibold border px-1.5 py-0.5 rounded-full ${TONE_COLORS[t.tone] || TONE_COLORS.Custom}`}>
                    {t.tone}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT — preview / edit / add */}
        <div className="flex-1 overflow-hidden flex flex-col">

          {/* Add new template form */}
          {showAddForm && (
            <div className="flex-1 overflow-y-auto p-6">
              <h2 className="text-lg font-semibold text-white mb-1">New Template</h2>
              <p className="text-[#888] text-xs mb-5">Use <code className="bg-white/10 px-1 rounded">{'{name}'}</code>, <code className="bg-white/10 px-1 rounded">{'{company}'}</code>, <code className="bg-white/10 px-1 rounded">{'{role}'}</code> as placeholders.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-xs text-[#888] block mb-1.5">Template Name *</label>
                  <input
                    value={newForm.label}
                    onChange={(e) => setNewForm((p) => ({ ...p, label: e.target.value }))}
                    placeholder="e.g. My Design Intro"
                    className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-[#555] focus:outline-none focus:border-white/30 transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#888] block mb-1.5">Industry</label>
                  <select
                    value={newForm.industry}
                    onChange={(e) => setNewForm((p) => ({ ...p, industry: e.target.value }))}
                    className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30 transition-all"
                  >
                    {INDUSTRIES.map((i) => (
                      <option key={i} value={i}>{INDUSTRY_LABELS[i]}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="text-xs text-[#888] block mb-1.5">Tone</label>
                <div className="flex flex-wrap gap-2">
                  {TONES.map((tone) => (
                    <button
                      key={tone}
                      onClick={() => setNewForm((p) => ({ ...p, tone }))}
                      className={`px-3 py-1.5 rounded-lg text-xs border transition-all ${
                        newForm.tone === tone
                          ? TONE_COLORS[tone] || TONE_COLORS.Custom
                          : 'border-white/10 text-[#888] hover:border-white/20 bg-[#111]'
                      }`}
                    >
                      {tone}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="text-xs text-[#888] block mb-1.5">Message Body *</label>
                <textarea
                  value={newForm.body}
                  onChange={(e) => setNewForm((p) => ({ ...p, body: e.target.value }))}
                  placeholder={`Hi {name},\n\nCame across your profile — your work as a {role} at {company} really stood out.\n\nI'm Faraaz from CH Digital Solutions...\n\nWould love to hear your thoughts.`}
                  rows={12}
                  className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-[#444] focus:outline-none focus:border-white/30 transition-all font-mono resize-none leading-relaxed"
                />
              </div>

              <div className="flex gap-3">
                <button onClick={handleAddSubmit} disabled={!newForm.label.trim() || !newForm.body.trim()}
                  className="bg-white text-black font-semibold hover:bg-gray-100 rounded-lg px-5 py-2.5 text-sm transition-all disabled:opacity-40">
                  Save Template
                </button>
                <button onClick={() => { setShowAddForm(false); setNewForm(EMPTY_FORM); }}
                  className="bg-transparent border border-white/20 text-white hover:bg-white/5 rounded-lg px-5 py-2.5 text-sm transition-all">
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* No selection state */}
          {!showAddForm && !selected && (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
              <LayoutTemplate className="w-12 h-12 text-[#333] mb-4" />
              <p className="text-[#888] text-sm font-medium">Select a template to preview or edit</p>
              <p className="text-[#555] text-xs mt-2">
                Or click <strong className="text-white">+ New Template</strong> to create your own
              </p>
            </div>
          )}

          {/* Selected template — preview + edit mode */}
          {!showAddForm && selected && (
            <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col min-h-[50vh]">

              {/* Template header */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-lg font-semibold text-white">{selected.label}</h2>
                    <span className={`text-[9px] font-semibold border px-2 py-0.5 rounded-full ${TONE_COLORS[selected.tone] || TONE_COLORS.Custom}`}>
                      {selected.tone}
                    </span>
                    {selected.isCustom && (
                      <span className="text-[9px] font-bold text-purple-400 bg-purple-500/10 border border-purple-500/30 px-2 py-0.5 rounded-full">My Template</span>
                    )}
                    {selected.isOverridden && !selected.isCustom && (
                      <span className="text-[9px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full">Edited</span>
                    )}
                  </div>
                  <p className="text-[#555] text-xs flex items-center gap-1">
                    {(() => { const I = INDUSTRY_ICONS[selected.industry]; return I ? <I className="w-3.5 h-3.5" /> : null; })()}
                    {INDUSTRY_LABELS[selected.industry] || selected.industry}
                    {editMode && ' — editing mode'}
                    {saved && <span className="text-green-400 ml-2">Saved</span>}
                  </p>
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {!editMode && (
                    <button onClick={handleEdit}
                      className="bg-transparent border border-white/20 text-white hover:bg-white/5 rounded-lg px-3 py-1.5 text-xs transition-all flex items-center gap-1.5">
                      <Pencil className="w-3 h-3" /> Edit
                    </button>
                  )}
                  {editMode && (
                    <>
                      <button onClick={() => { setEditMode(false); setEditBody(selected.body); }}
                        className="bg-transparent border border-white/20 text-[#888] hover:bg-white/5 rounded-lg px-3 py-1.5 text-xs transition-all flex-1 md:flex-none">
                        Discard
                      </button>
                      <button onClick={handleSave}
                        className="bg-white text-black font-semibold hover:bg-gray-100 rounded-lg px-4 py-1.5 text-xs transition-all flex-1 md:flex-none">
                        Save Changes
                      </button>
                    </>
                  )}
                  {selected.isOverridden && !selected.isCustom && !editMode && (
                    <button onClick={handleReset}
                      className="text-[#888] hover:text-white text-xs transition-colors px-2 py-1.5 flex items-center gap-1.5">
                      <RotateCcw className="w-3 h-3" /> Reset
                    </button>
                  )}
                  {selected.isCustom && !editMode && (
                    <button onClick={() => handleDelete(selected.id)}
                      className="text-[#555] hover:text-red-400 text-xs transition-colors px-2 py-1.5 flex items-center gap-1.5">
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  )}
                </div>
              </div>

              {/* Sample context */}
              <div className="bg-black border border-white/10 rounded-lg px-4 py-2.5 flex items-center gap-3 mb-4">
                <div className="w-7 h-7 rounded-full bg-white text-black text-xs font-bold flex items-center justify-center shrink-0">AS</div>
                <div>
                  <p className="text-xs font-medium text-white">Aditya Sharma</p>
                  <p className="text-[10px] text-[#888]">Sales Head · TechCorp</p>
                </div>
                <span className="ml-auto text-[#555] text-[10px]">Preview with sample lead</span>
              </div>

              {/* Edit textarea */}
              {editMode ? (
                <>
                  <label className="text-xs text-[#888] mb-1.5 block">
                    Edit message body — use <code className="bg-white/10 px-1 rounded">{'{name}'}</code>, <code className="bg-white/10 px-1 rounded">{'{company}'}</code>, <code className="bg-white/10 px-1 rounded">{'{role}'}</code>
                  </label>
                  <textarea
                    value={editBody}
                    onChange={(e) => setEditBody(e.target.value)}
                    rows={14}
                    className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-white/40 transition-all font-mono resize-none leading-relaxed flex-1"
                  />
                  <div className="mt-3 bg-[#0a1a0a] border border-green-500/20 rounded-lg p-3">
                    <p className="text-[#888] text-xs mb-1 font-medium">Preview (with sample lead):</p>
                    <p className="text-xs text-[#aaa] whitespace-pre-wrap leading-relaxed font-mono">{previewText}</p>
                  </div>
                </>
              ) : (
                <div className="bg-black border border-white/10 rounded-lg p-4 text-xs text-[#ccc] leading-relaxed whitespace-pre-wrap font-mono flex-1">
                  {previewText}
                </div>
              )}

              {/* Copy button */}
              {!editMode && (
                <button
                  onClick={handleCopy}
                  className={`w-full mt-4 rounded-lg px-4 py-3 text-sm font-semibold transition-all ${
                    copied
                      ? 'bg-green-500/20 border border-green-500/30 text-green-400'
                      : 'bg-white text-black hover:bg-gray-100'
                  }`}
                >
                  {copied ? (
                    <><Check className="w-4 h-4" /> Copied — Paste it in LinkedIn DMs</>
                  ) : (
                    <><Copy className="w-4 h-4" /> Copy Message</>
                  )}
                </button>
              )}
              {!editMode && (
                <p className="text-[#555] text-[10px] text-center mt-2">
                  When used from a lead card, variables are auto-filled from that lead's data
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
