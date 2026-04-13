const STEPS = [
  { label: 'Invite Sent', isChecked: () => true },
  {
    label: 'Message Sent',
    isChecked: (s) => ['message_sent', 'replied', 'follow_up', 'potential_client'].includes(s),
  },
  {
    label: 'Followed Up',
    isChecked: (s) => ['follow_up', 'potential_client'].includes(s),
  },
  {
    label: 'Replied',
    isChecked: (s) => ['replied', 'potential_client'].includes(s),
  },
];

export default function LeadChecklist({ status }) {
  return (
    <div className="flex gap-3 flex-wrap">
      {STEPS.map(({ label, isChecked }) => {
        const checked = isChecked(status);
        return (
          <div key={label} className={`flex items-center gap-1 text-xs ${checked ? 'text-white' : 'text-[#888]'}`}>
            <div
              className={`w-3 h-3 border rounded-sm flex items-center justify-center shrink-0 ${
                checked ? 'bg-white border-white' : 'border-white/20'
              }`}
            >
              {checked && (
                <span className="text-black leading-none font-bold" style={{ fontSize: '8px' }}>✓</span>
              )}
            </div>
            {label}
          </div>
        );
      })}
    </div>
  );
}
