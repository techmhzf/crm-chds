import { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useAlerts } from '../context/AlertContext.jsx';
import { updateLeadStatus } from '../services/leadService.js';

export default function FollowUpBanner() {
  const { alerts, alertCount, fetchAlerts } = useAlerts();
  const [collapsed, setCollapsed] = useState(false);

  if (alertCount === 0) return null;

  const handleMarkDone = async (id) => {
    await updateLeadStatus(id, 'follow_up');
    await fetchAlerts();
  };

  const daysSince = (date) => {
    if (!date) return '?';
    return Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="bg-[#1a1100] border border-amber-500/20 rounded-xl px-5 py-4 mb-4 mx-6">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setCollapsed(!collapsed)}
      >
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
          <span className="text-amber-400 text-sm font-semibold">Follow-up Needed</span>
          <span className="bg-amber-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">
            {alertCount}
          </span>
        </div>
        {collapsed ? <ChevronDown className="w-4 h-4 text-[#888]" /> : <ChevronUp className="w-4 h-4 text-[#888]" />}
      </div>

      {!collapsed && (
        <div className="mt-3 space-y-2">
          {alerts.map((lead) => (
            <div key={lead._id} className="flex items-center justify-between py-2 border-t border-amber-500/10">
              <div>
                <p className="text-sm text-white font-medium">{lead.name}</p>
                <p className="text-xs text-[#888]">
                  {[lead.role, lead.company].filter(Boolean).join(' · ')} · {daysSince(lead.lastContactedAt)}d ago
                </p>
              </div>
              <button
                onClick={() => handleMarkDone(lead._id)}
                className="bg-transparent border border-white/20 text-white hover:bg-white/5 rounded-lg px-3 py-1.5 text-xs transition-all whitespace-nowrap ml-4"
              >
                Mark Done
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
