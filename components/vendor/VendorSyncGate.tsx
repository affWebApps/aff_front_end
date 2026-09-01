"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useEnsureVendor } from "@/hooks/useEnsureVendor";

/**
 * Drop into any vendor-only screen (product listing, product creation,
 * vendor orders). Triggers a one-shot vendor-sync fallback on mount and
 * renders a lightweight inline banner — never blocks the rest of the page.
 * Renders nothing once vendor_id is present or before the check has run.
 */
export function VendorSyncGate() {
  const { isReady, isSyncing, error, ensureVendor } = useEnsureVendor();

  useEffect(() => {
    if (!isReady) ensureVendor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isReady) return null;

  if (isSyncing) {
    return (
      <div className="mb-4 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800">
        <Loader2 size={14} className="animate-spin" />
        Setting up your vendor account…
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
        <span>{error}</span>
        <button
          type="button"
          onClick={() => ensureVendor()}
          className="font-medium underline hover:no-underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return null;
}
