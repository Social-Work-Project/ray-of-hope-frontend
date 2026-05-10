export function SectionCard({
  title,
  onSave,
  saveLabel = 'Save Changes',
  children,
  span2 = false,
  saving = false,
}: {
  title: string;
  onSave: () => void;
  saveLabel?: string;
  children: React.ReactNode;
  span2?: boolean;
  saving?: boolean;
}) {
  return (
    <div
      className={`bg-white rounded-xl shadow-sm border p-4 sm:p-6 ${span2 ? 'lg:col-span-2' : ''}`}
      style={{ borderColor: 'var(--gray-100)' }}
    >
      {/* Header — stacks on very small screens, side-by-side otherwise */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <h3 className="font-bold text-sm" style={{ color: 'var(--navy)' }}>
          {title}
        </h3>
        <button
          onClick={onSave}
          disabled={saving}
          className="w-full sm:w-auto px-4 py-2 rounded-lg text-xs font-semibold text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ background: 'var(--blue)' }}
        >
          {saving ? 'Saving…' : saveLabel}
        </button>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}