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
      <label
        className="block text-xs font-semibold mb-1.5"
        style={{ color: 'var(--gray-800)' }}
      >
        {label}
      </label>
 
      {/* On mobile: full-width row; on sm+: centered square */}
      <div
        onClick={() => ref.current?.click()}
        className="cursor-pointer border-2 border-dashed rounded-xl transition-colors hover:bg-blue-50 flex items-center justify-center"
        style={{
          borderColor: 'var(--gray-200)',
          minHeight: 120,
          padding: '16px',
        }}
      >
        {displaySrc ? (
          /* Responsive: smaller on mobile, normal on sm+ */
          <img
            src={displaySrc}
            alt="QR Preview"
            className="h-20 w-20 sm:h-24 sm:w-24 object-contain rounded-lg"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-center">
            <span className="text-2xl">📷</span>
            <span className="text-xs" style={{ color: 'var(--gray-400)' }}>
              Click to upload QR code
            </span>
          </div>
        )}
      </div>
 
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && onFileChange(e.target.files[0])}
      />
 
      {displaySrc && (
        <button
          type="button"
          onClick={onRemove}
          className="mt-1.5 text-xs text-red-400 hover:text-red-600 transition-colors"
        >
          Remove image
        </button>
      )}
    </div>
  );
}