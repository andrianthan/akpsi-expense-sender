export function Steps({ current }: { current: 1 | 2 | 3 }) {
  const steps = ['Fill Details', 'Preview', 'Confirmed'];

  return (
    <div className="flex items-center">
      {steps.map((label, i) => {
        const num = (i + 1) as 1 | 2 | 3;
        const done = num < current;
        const active = num === current;

        return (
          <div key={num} className="flex items-center">
            {i > 0 && (
              <div className={`w-10 h-px mx-3 transition-colors ${done ? 'bg-[#C9A84C]' : 'bg-slate-200'}`} />
            )}
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-colors ${
                done
                  ? 'bg-[#C9A84C] text-white'
                  : active
                  ? 'bg-[#1B3A6B] text-white'
                  : 'bg-slate-200 text-slate-400'
              }`}>
                {done ? '✓' : num}
              </div>
              <span className={`text-xs font-medium transition-colors ${
                active ? 'text-[#1B3A6B]' : done ? 'text-[#C9A84C]' : 'text-slate-400'
              }`}>
                {label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
