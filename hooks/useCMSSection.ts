import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export function useCMSSection<T>(
  fetchFn: () => Promise<{ data: T | null | any}>,
  createFn: (data: T) => Promise<unknown>,
  updateFn: (data: T) => Promise<unknown>,
  defaults: T,
  successMsg = 'Saved successfully!'
) {
  const [data, setData]     = useState<T>(defaults);
  const [exists, setExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);

  useEffect(() => {
    fetchFn()
      .then(res => {
        // Only treat as "not yet created" when the API explicitly
        // returns null, undefined, or an empty array — NOT an object
        // with empty string fields (that is a real persisted record).
        const d = res.data?.results || [];
        console.log("Response: ", d)
        const notCreated =
          d === null ||
          d === undefined ||
          (Array.isArray(d) && d.length === 0);

        if (notCreated) {
          setData(defaults);
          setExists(false);
        } else {
          setData(d as T);
          setExists(true);
        }
      })
      .catch(() => {
        setData(defaults);
        setExists(false);
      })
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await (exists ? updateFn(data) : createFn(data));
      setExists(true); // flip once after first successful POST
      toast.success(successMsg);
    } catch {
      toast.error('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return { data, setData, loading, saving, save };
}