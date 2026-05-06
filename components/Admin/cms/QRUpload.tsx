import { useRef } from 'react';

export function QRUpload({
  label,
  previewUrl,
  pendingFile,
  onFileChange,
  onRemove,
}: {
  label: string;
  previewUrl: string | null;
  pendingFile: File | null;
  onFileChange: (file: File) => void;
  onRemove: () => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const displaySrc = pendingFile ? URL.createObjectURL(pendingFile) : previewUrl;

  return (
    <div>
      <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--gray-800)' }}>{label}</label>
      <div
        onClick={() => ref.current?.click()}
        className="cursor-pointer border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-blue-50 transition-colors"
        style={{ borderColor: 'var(--gray-200)', minHeight: 120 }}
      >
        {displaySrc
          ? <img src={displaySrc} alt="QR Preview" className="h-24 w-24 object-contain rounded-lg" />
          : <><span className="text-2xl">📷</span><span className="text-xs text-gray-400">Click to upload QR code</span></>
        }
      </div>
      <input ref={ref} type="file" accept="image/*" className="hidden"
        onChange={e => e.target.files?.[0] && onFileChange(e.target.files[0])} />
      {displaySrc && (
        <button onClick={onRemove} className="mt-1 text-xs text-red-400 hover:text-red-600">Remove image</button>
      )}
    </div>
  );
}