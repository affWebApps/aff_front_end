import apiClient from "@/lib/api/axios";

export const vendorService = {
  /**
   * Idempotently ensures the current user has a Medusa vendor_id and
   * customer_id. Response shape is inconsistent across branches (see
   * hooks/useEnsureVendor.ts) — callers should ignore the body and
   * re-fetch the user profile afterwards instead of parsing it.
   */
  sync: async (): Promise<void> => {
    await apiClient.post("/store/sync");
  },
};
