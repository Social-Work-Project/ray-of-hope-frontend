const cls = "w-full px-4 py-3 border rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-blue-200";

export function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--gray-800)' }}>
        {label}{hint && <span className="text-gray-400 font-normal ml-1">{hint}</span>}
      </label>
      {children}
    </div>
  );
}

export function TextInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
    className={cls} style={{ borderColor: 'var(--gray-200)' }} />;
}

export function TextArea({ value, onChange, rows = 3 }: { value: string; onChange: (v: string) => void; rows?: number }) {
  return <textarea value={value} onChange={e => onChange(e.target.value)} rows={rows}
    className={cls} style={{ borderColor: 'var(--gray-200)', resize: 'vertical' }} />;
}

export function SelectInput({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)} className={cls} style={{ borderColor: 'var(--gray-200)' }}>
      {options.map(o => <option key={o}>{o}</option>)}
    </select>
  );
}