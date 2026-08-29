import { useCallback, useEffect, useRef, useState } from "react";
import { fetchPackages, fetchPackage } from "../api";

// ─── Module-level caches (survive across renders, shared across all instances) ─
// Deduplicates in-flight requests: same key → same Promise
const inflight = new Map();

// Caches resolved list results so identical filter sets are served instantly
const listCache = new Map();

// Detail page deduplication
const detailPromises = new Map();

function fetchPackageOnce(id) {
  if (!detailPromises.has(id)) {
    detailPromises.set(id, fetchPackage(id));
  }
  return detailPromises.get(id);
}

function fetchPackagesCached(serializedKey, filtersObj) {
  // Return cached result immediately if available
  if (listCache.has(serializedKey)) {
    return Promise.resolve(listCache.get(serializedKey));
  }
  // Deduplicate in-flight: if same key is already fetching, reuse that promise
  if (inflight.has(serializedKey)) {
    return inflight.get(serializedKey);
  }
  const promise = fetchPackages(filtersObj).then((result) => {
    listCache.set(serializedKey, result);
    inflight.delete(serializedKey);
    return result;
  }).catch((err) => {
    inflight.delete(serializedKey);
    throw err;
  });
  inflight.set(serializedKey, promise);
  return promise;
}

// Call this to invalidate cache when filters change (e.g. user navigates)
export function invalidatePackageListCache() {
  listCache.clear();
}

export default function usePackages(id, filters = {}) {
  const [packages, setPackages] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [pack, setPack] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // useRef to track the last serialized filter key — prevents duplicate calls
  // when the parent re-renders but filters haven't actually changed
  const lastKeyRef = useRef(null);
  // useRef to track mounted state — prevents setState on unmounted component
  const mountedRef = useRef(true);
  // useRef to track the active fetch promise so we can ignore stale responses
  const activePromiseRef = useRef(null);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Stable serialized key from filters — sort keys so order doesn't matter
  const serializedKey = id
    ? `detail:${id}`
    : `list:${JSON.stringify(
        Object.fromEntries(
          Object.entries(filters)
            .filter(([, v]) => v !== undefined && v !== null && v !== "")
            .sort(([a], [b]) => a.localeCompare(b))
        )
      )}`;

  const load = useCallback(async () => {
    // Skip if nothing changed since last fetch
    if (lastKeyRef.current === serializedKey) return;
    lastKeyRef.current = serializedKey;

    if (mountedRef.current) setLoading(true);

    let currentPromise;
    try {
      if (id) {
        currentPromise = fetchPackageOnce(id);
        activePromiseRef.current = currentPromise;
        const result = await currentPromise;
        // Ignore if a newer fetch has started
        if (activePromiseRef.current !== currentPromise || !mountedRef.current) return;
        setPack(result);
      } else {
        const filtersObj = Object.fromEntries(
          Object.entries(filters)
            .filter(([, v]) => v !== undefined && v !== null && v !== "")
        );
        currentPromise = fetchPackagesCached(serializedKey, filtersObj);
        activePromiseRef.current = currentPromise;
        const result = await currentPromise;
        if (activePromiseRef.current !== currentPromise || !mountedRef.current) return;
        setPackages(result.items || []);
        setPagination(result);
      }
      if (mountedRef.current) setError("");
    } catch (e) {
      if (mountedRef.current) setError(e.message);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serializedKey]);

  useEffect(() => {
    load();
  }, [load]);

  return { packages, pack, pagination, loading, error, reload: load };
}
