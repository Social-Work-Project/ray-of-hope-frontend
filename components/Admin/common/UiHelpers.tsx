


export const inp =
  'w-full px-4 py-2.5 border rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-blue-200 bg-white';


export function Err({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="text-xs mt-1 font-medium text-red-500">{msg}</p>;
}

export function Lbl({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--gray-800)' }}>
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xs font-black uppercase tracking-widest" style={{ color: 'var(--sky)' }}>
          {title}
        </span>
        <div className="flex-1 h-px" style={{ background: 'var(--gray-100)' }} />
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}