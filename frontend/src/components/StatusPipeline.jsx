const STAGES = [
  { key: 'invite_sent', label: 'Invite Sent', countColor: 'text-gray-400' },
  { key: 'connected', label: 'Connected', countColor: 'text-blue-400' },
  { key: 'message_sent', label: 'Msg Sent', countColor: 'text-purple-400' },
  { key: 'replied', label: 'Replied', countColor: 'text-green-400' },
  { key: 'follow_up', label: 'Follow Up', countColor: 'text-amber-400' },
  { key: 'potential_client', label: 'Potential', countColor: 'text-emerald-400' },
  { key: 'not_interested', label: 'Not Int.', countColor: 'text-red-400' },
];

export default function StatusPipeline({ counts = {}, activeStatus, onSelect }) {
  return (
    <div className="px-6 py-3 border-b border-white/5">
      <p className="text-[#555] text-xs font-semibold tracking-widest mb-3">PIPELINE</p>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {STAGES.map(({ key, label, countColor }, i) => {
          const isActive = activeStatus === key;
          return (
            <div key={key} className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onSelect(isActive ? null : key)}
                className={`flex items-center gap-2 border rounded-full px-4 py-1.5 cursor-pointer whitespace-nowrap transition-all text-xs ${
                  isActive
                    ? 'border-white/40 bg-[#1a1a1a]'
                    : 'bg-[#111] border-white/10 hover:border-white/25'
                }`}
              >
                <span className={`font-bold ${countColor}`}>{counts[key] ?? 0}</span>
                <span className={isActive ? 'text-white' : 'text-[#888]'}>{label}</span>
              </button>
              {i < STAGES.length - 1 && (
                <span className="text-[#333] text-xs">›</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
