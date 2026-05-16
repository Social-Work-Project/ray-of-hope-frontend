import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';

export function useCMSSection<T, P = T>(
  fetchFn:       () => Promise<{ data: any }>,
  createFn:      (payload: P) => Promise<unknown>,
  updateFn:      (payload: P) => Promise<unknown>,
  defaults:      T,
  successMsg:    string = 'Saved successfully!',
  buildPayload?: (data: T) => P | null,
) {
  const [data,    setData]    = useState<T>(defaults);
  const [exists,  setExists]  = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);

  // Ref keeps the authoritative exists value in sync for use inside save()
  // without depending on a stale closure over the state variable.
  const existsRef = useRef(false);
  const syncExists = (val: boolean) => {
    existsRef.current = val;
    setExists(val);
  };

  const fetchData = useCallback(async (opts?: { preserveExists?: boolean }) => {
    try {
      const res = await fetchFn();
      const raw = res.data?.results;
      const d   = Array.isArray(raw) ? (raw[0] ?? null) : (raw ?? null);

      if (d === null || d === undefined) {
        setData(defaults);
        // Only reset exists to false if we haven't successfully saved yet.
        // After a POST the GET might still return null (eventual consistency
        // or the endpoint only returns data on a separate detail route).
        if (!opts?.preserveExists) syncExists(false);
      } else {
        setData(d as T);
        syncExists(true);
      }
    } catch {
      if (!opts?.preserveExists) {
        setData(defaults);
        syncExists(false);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchData().finally(() => setLoading(false));
  }, [fetchData]);

  const save = async () => {
    setSaving(true);
    try {
      let payload: P;

      if (buildPayload) {
        const built = buildPayload(data);
        if (built === null) return;
        payload = built;
      } else {
        payload = data as unknown as P;
      }

      // Use ref so we always read the latest value, never a stale closure
      const wasCreated = existsRef.current;
      await (wasCreated ? updateFn(payload) : createFn(payload));

      // Flip exists immediately — don't wait for the re-fetch to confirm it.
      // If the GET returns null after a POST (eventual consistency), we still
      // want the next save to call PATCH, not POST again.
      syncExists(true);

      toast.success(successMsg);

      // Re-fetch to pull fresh URLs/data from the server.
      // preserveExists: true so a null response doesn't flip us back to false.
      await fetchData({ preserveExists: true });
    } catch {
      toast.error('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return { data, setData, loading, saving, save };
}