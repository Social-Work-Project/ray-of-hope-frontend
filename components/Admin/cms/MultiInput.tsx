const inputCls =
  'w-full px-4 py-3 border rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-blue-200';
 
export function MultiInput({
  label,
  values = [],
  onChange,
  placeholder,
}: {
  label: string;
  values: string[];
  onChange: (vals: string[]) => void;
  placeholder?: string;
}) {
  const safeValues = values.length > 0 ? values : [''];
 
  const add    = () => onChange([...safeValues, '']);
  const remove = (i: number) => onChange(safeValues.filter((_, idx) => idx !== i));
  const update = (i: number, val: string) =>
    onChange(safeValues.map((v, idx) => (idx === i ? val : v)));
 
  return (
    <div>
      <label
        className="block text-xs font-semibold mb-1.5"
        style={{ color: 'var(--gray-800)' }}
      >
        {label}
      </label>
      <div className="space-y-2">
        {safeValues.map((v, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={v}
              onChange={(e) => update(i, e.target.value)}
              placeholder={placeholder}
              className={inputCls + ' flex-1 min-w-0'}
              style={{ borderColor: 'var(--gray-200)' }}
            />
            {safeValues.length > 1 && (
              <button
                type="button"
                onClick={() => remove(i)}
                className="shrink-0 px-3 py-2 rounded-lg text-xs font-semibold text-red-500 border border-red-200 hover:bg-red-50 transition-colors"
                aria-label={`Remove ${label} entry`}
              >
                ✕
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={add}
          className="mt-1 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors hover:bg-blue-50"
          style={{ color: 'var(--blue)', borderColor: 'var(--blue)' }}
        >
          + Add {label}
        </button>
      </div>
    </div>
  );
}