import { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, CheckCircle } from 'lucide-react';
import { getTodaysTasks } from '../services/taskService.js';
import { updateLeadStatus } from '../services/leadService.js';

export default function TodaysTasksPanel({ onGenerateMessage }) {
  const [tasks, setTasks] = useState(null);
  const [open, setOpen] = useState({ toMessage: true, toFollowUp: true, newConnections: true });

  const toggle = (k) => setOpen((p) => ({ ...p, [k]: !p[k] }));

  const refresh = async () => {
    try {
      const { data } = await getTodaysTasks();
      setTasks(data);
    } catch {}
  };

  useEffect(() => { refresh(); }, []);

  const handleMarkFollowUp = async (id) => {
    await updateLeadStatus(id, 'follow_up');
    refresh();
  };

  if (!tasks) return null;

  const { toMessage, toFollowUp, newConnections, totalTasks } = tasks;

  const SectionHeader = ({ sectionKey, label, dot, count }) => (
    <button onClick={() => toggle(sectionKey)} className="flex items-center gap-2 w-full text-left mb-2">
      <span className={`w-2 h-2 rounded-full shrink-0 ${dot}`} />
      <span className="text-xs font-semibold text-[#888] uppercase tracking-wider">{label}</span>
      <span className="text-xs text-[#555]">({count})</span>
      {open[sectionKey] ? <ChevronUp className="w-3.5 h-3.5 text-[#555] ml-auto" /> : <ChevronDown className="w-3.5 h-3.5 text-[#555] ml-auto" />}
    </button>
  );

  if (totalTasks === 0) {
    return (
      <div className="bg-[#111] border border-white/10 rounded-xl p-5 mb-4 mx-6">
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-sm font-semibold text-white">Today's Tasks</h2>
          <span className="bg-white text-black text-xs font-bold px-2 py-0.5 rounded-full">0</span>
        </div>
        <p className="text-[#888] text-sm text-center py-4 flex items-center justify-center gap-1.5">
          <CheckCircle className="w-4 h-4 text-green-500" /> All caught up for today
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#111] border border-white/10 rounded-xl p-5 mb-4 mx-6">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-sm font-semibold text-white">Today's Tasks</h2>
        <span className="bg-white text-black text-xs font-bold px-2 py-0.5 rounded-full">{totalTasks}</span>
      </div>

      <div className="space-y-4">
        {toMessage.length > 0 && (
          <div>
            <SectionHeader sectionKey="toMessage" label="To Message" dot="bg-blue-400" count={toMessage.length} />
            {open.toMessage && (
              <div className="ml-4 space-y-1">
                {toMessage.map((lead) => (
                  <div key={lead._id} className="flex items-center justify-between py-1.5 border-t border-white/5">
                    <div>
                      <p className="text-sm text-white">{lead.name}</p>
                      <p className="text-xs text-[#888]">{lead.role || 'No title'}</p>
                    </div>
                    <button
                      onClick={() => onGenerateMessage(lead)}
                      className="bg-transparent border border-white/20 text-white hover:bg-white/5 rounded-lg px-3 py-1.5 text-xs transition-all whitespace-nowrap ml-3"
                    >
                      Send Message
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {toFollowUp.length > 0 && (
          <div>
            <SectionHeader sectionKey="toFollowUp" label="To Follow Up" dot="bg-amber-400" count={toFollowUp.length} />
            {open.toFollowUp && (
              <div className="ml-4 space-y-1">
                {toFollowUp.map((lead) => (
                  <div key={lead._id} className="flex items-center justify-between py-1.5 border-t border-white/5">
                    <div>
                      <p className="text-sm text-white">{lead.name}</p>
                      <p className="text-xs text-[#888]">{lead.role || 'No title'}</p>
                    </div>
                    <button
                      onClick={() => handleMarkFollowUp(lead._id)}
                      className="bg-transparent border border-white/20 text-white hover:bg-white/5 rounded-lg px-3 py-1.5 text-xs transition-all whitespace-nowrap ml-3"
                    >
                      Mark Done
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {newConnections.length > 0 && (
          <div>
            <SectionHeader sectionKey="newConnections" label="New Connections" dot="bg-green-400" count={newConnections.length} />
            {open.newConnections && (
              <div className="ml-4 space-y-1">
                {newConnections.map((lead) => (
                  <div key={lead._id} className="flex items-center justify-between py-1.5 border-t border-white/5">
                    <div>
                      <p className="text-sm text-white">{lead.name}</p>
                      <p className="text-xs text-[#888]">{lead.role || 'No title'}</p>
                    </div>
                    <span className="text-xs text-[#555] ml-3">Connected today</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
