"use client";

import { useCallback, useState } from "react";
import { authService } from "@/services/authServices";
import { vendorService } from "@/services/vendorService";
import { useAuthStore } from "@/store/authStore";

interface UseEnsureVendorResult {
  vendorId: string | null;
  customerId: string | null;
  /** true once the user's profile has a vendor_id */
  isReady: boolean;
  isSyncing: boolean;
  error: string | null;
  /** No-ops if vendor_id is already present. Safe to call repeatedly (retry). */
  ensureVendor: () => Promise<void>;
}

/**
 * Fallback for the case where the backend's automatic vendor sync (which
 * runs on every login/register) failed silently server-side. Call
 * ensureVendor() before a vendor-only action; it's a fast no-op when
 * vendor_id already exists.
 */
export const useEnsureVendor = (): UseEnsureVendorResult => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const updateUser = useAuthStore((state) => state.updateUser);

  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ensureVendor = useCallback(async () => {
    if (!token || user?.vendor_id) return;

    setIsSyncing(true);
    setError(null);
    try {
      await vendorService.sync();
      // The sync response shape varies by branch — always re-fetch the
      // profile instead of parsing it, per the endpoint contract.
      const freshUser = await authService.getCurrentUser(token);
      updateUser(freshUser);
    } catch (err) {
      console.error("Vendor sync failed:", err);
      setError("Couldn't set up vendor account, try again.");
    } finally {
      setIsSyncing(false);
    }
  }, [token, user?.vendor_id, updateUser]);

  return {
    vendorId: user?.vendor_id ?? null,
    customerId: user?.customer_id ?? null,
    isReady: Boolean(user?.vendor_id),
    isSyncing,
    error,
    ensureVendor,
  };
};
