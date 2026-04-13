import { useState } from 'react';
import { Send, X, ChevronDown, Pencil, ExternalLink } from 'lucide-react';
import { useLeads } from '../context/LeadContext.jsx';
import EditLeadModal from './EditLeadModal.jsx';

const STATUS_CONFIG = {
  invite_sent:      { label: 'Invite Sent',    color: 'text-slate-400',   dot: 'bg-slate-400',    bar: 'bg-slate-400',    progress: 1 },
  connected:        { label: 'Connected',      color: 'text-blue-400',    dot: 'bg-blue-400',     bar: 'bg-blue-400',     progress: 2 },
  message_sent:     { label: 'Msg Sent',       color: 'text-violet-400',  dot: 'bg-violet-400',   bar: 'bg-violet-400',   progress: 3 },
  replied:          { label: 'Replied',        color: 'text-green-400',   dot: 'bg-green-400',    bar: 'bg-green-400',    progress: 4 },
  follow_up:        { label: 'Follow Up',      color: 'text-amber-400',   dot: 'bg-amber-400',    bar: 'bg-amber-400',    progress: 3 },
  potential_client: { label: 'Potential',      color: 'text-emerald-400', dot: 'bg-emerald-400',  bar: 'bg-emerald-400',  progress: 5 },
  not_interested:   { label: 'Not Interested', color: 'text-red-400',     dot: 'bg-red-400',      bar: 'bg-red-400',      progress: 0 },
};

const STATUSES = Object.keys(STATUS_CONFIG);
const PROGRESS_TOTAL = 5;

const INDUSTRY_LABELS = {
  general: 'General', sales: 'Sales', travel: 'Travel', tech: 'Tech',
  design: 'Design', real_estate: 'Real Estate', finance: 'Finance',
  marketing: 'Marketing', other: 'Other',
};

export default function LeadCard({ lead, onGenerateMessage }) {
  const { changeStatus, removeLead } = useLeads();
  const [showMenu, setShowMenu] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const cfg = STATUS_CONFIG[lead.status] || STATUS_CONFIG.invite_sent;

  const handleStatusChange = async (status) => {
    await changeStatus(lead._id, status);
    setShowMenu(false);
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete ${lead.name}?`)) return;
    setDeleting(true);
    await removeLead(lead._id);
  };

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : null;

  const initials = lead.name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="group relative bg-[#0c0c0c] border border-white/[0.07] rounded-2xl p-5 hover:border-white/[0.13] transition-all duration-200 flex flex-col gap-0">

      {/* ── Header ── */}
      <div className="flex items-start gap-3.5 mb-4">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-xl bg-white/8 border border-white/10 text-white text-[13px] font-bold flex items-center justify-center shrink-0 tracking-wide">
          {initials}
        </div>

        {/* Name + role */}
        <div className="flex-1 min-w-0 pt-0.5">
          <p className="text-sm font-semibold text-white leading-tight truncate">{lead.name}</p>
          {lead.role && (
            <p className="text-[11px] text-white/40 truncate mt-0.5 leading-tight">{lead.role}</p>
          )}
          {lead.company && (
            <p className="text-[11px] text-white/25 truncate leading-tight">{lead.company}</p>
          )}
        </div>

        {/* LinkedIn */}
        {lead.linkedinUrl && (
          <a
            href={lead.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/15 hover:text-white/50 transition-colors shrink-0 mt-0.5"
            title="Open LinkedIn"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      {/* ── Status + meta row ── */}
      <div className="flex items-center gap-2 mb-3.5">
        {/* Status pill */}
        <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold rounded-full px-2.5 py-1 border bg-white/[0.03] ${cfg.color} border-current/20`}>
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
          {cfg.label}
        </span>

        {/* Industry */}
        {lead.industry && (
          <span className="text-[10px] text-white/25 bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 rounded-full">
            {INDUSTRY_LABELS[lead.industry] || lead.industry}
          </span>
        )}

        {/* Date */}
        {lead.lastContactedAt && (
          <span className="text-[10px] text-white/20 ml-auto font-medium tabular-nums">
            {formatDate(lead.lastContactedAt)}
          </span>
        )}
      </div>

      {/* ── Progress bar ── */}
      {lead.status !== 'not_interested' ? (
        <div className="flex gap-1 mb-4">
          {Array.from({ length: PROGRESS_TOTAL }).map((_, i) => (
            <div
              key={i}
              className={`h-0.5 flex-1 rounded-full transition-all duration-300 ${
                i < cfg.progress ? cfg.bar : 'bg-white/[0.07]'
              }`}
            />
          ))}
        </div>
      ) : (
        <div className="h-0.5 rounded-full bg-red-500/30 mb-4" />
      )}

      {/* ── Notes ── */}
      {lead.notes && (
        <p className="text-[11px] text-white/20 line-clamp-1 leading-relaxed mb-3.5 italic">
          {lead.notes}
        </p>
      )}

      {/* ── Actions footer ── */}
      <div className="flex items-center gap-1.5 pt-3.5 border-t border-white/[0.05] mt-auto">
        {/* Send message */}
        <button
          onClick={() => onGenerateMessage(lead)}
          className="flex items-center gap-1.5 text-white/50 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.07] hover:border-white/15 rounded-lg px-3 py-1.5 text-xs transition-all"
        >
          <Send className="w-3 h-3" />
          Message
        </button>

        {/* Edit */}
        <button
          onClick={() => setShowEdit(true)}
          title="Edit lead"
          className="text-white/30 hover:text-white/70 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.07] hover:border-white/15 rounded-lg p-1.5 transition-all"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>

        {/* Status dropdown */}
        <div className="relative ml-auto">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-1 text-white/30 hover:text-white/70 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.07] hover:border-white/15 text-xs rounded-lg px-2.5 py-1.5 transition-all"
          >
            Status <ChevronDown className="w-3 h-3" />
          </button>

          {showMenu && (
            <>
              {/* Backdrop */}
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute bottom-full right-0 mb-2 bg-[#141414] border border-white/[0.1] rounded-xl shadow-2xl z-20 min-w-44 py-1.5 overflow-hidden">
                {STATUSES.map((s) => {
                  const sc = STATUS_CONFIG[s];
                  return (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(s)}
                      className={`w-full text-left px-3.5 py-2 text-xs hover:bg-white/5 transition-colors flex items-center gap-2.5 ${
                        lead.status === s ? sc.color : 'text-white/35'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${sc.dot}`} />
                      {sc.label}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Delete */}
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="text-white/20 hover:text-red-400 transition-colors disabled:opacity-40 p-1.5"
          title="Delete lead"
        >
          {deleting
            ? <span className="w-3 h-3 rounded-full border border-current border-t-transparent animate-spin inline-block" />
            : <X className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Edit modal */}
      {showEdit && <EditLeadModal lead={lead} onClose={() => setShowEdit(false)} />}
    </div>
  );
}
