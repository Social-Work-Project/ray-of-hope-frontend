export function SectionCard({
  title, onSave, saveLabel = 'Save Changes', children, span2 = false, saving = false,
}: {
  title: string; onSave: () => void; saveLabel?: string;
  children: React.ReactNode; span2?: boolean; saving?: boolean;
}) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border p-6 ${span2 ? 'lg:col-span-2' : ''}`}
      style={{ borderColor: 'var(--gray-100)' }}>
      <div className="flex justify-between items-center mb-5">
        <h3 className="font-bold text-sm" style={{ color: 'var(--navy)' }}>{title}</h3>
        <button onClick={onSave} disabled={saving}
          className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-(--blue) hover:bg-blue-800/80 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed">
          {saving ? 'Saving…' : saveLabel}
        </button>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}